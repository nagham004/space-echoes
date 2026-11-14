/**
 * ============================================================================
 * Space Echoes - Scroll-Driven 3D Starfield Background (Three.js)
 * ============================================================================
 * - Moves strictly on page scroll: no auto-rotation, no mouse/gyro parallax.
 * - Idle when not scrolling: render loop stops completely after smooth lerp.
 * - SCROLL_SPEED constant at top for easy adjustment.
 * - Respects prefers-reduced-motion: reduce (completely static when active).
 * ============================================================================
 */

// 1. Easy-to-tune scroll sensitivity coefficient (radians per scroll pixel)
const SCROLL_SPEED = 0.0004;

(function () {
    'use strict';

    let scene, camera, renderer, starGroup;
    let animId = null;
    let isRunning = false;

    // Accessibility check
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isReducedMotion = motionMedia.matches;

    // Smooth scroll interpolation values
    let targetY = 0;
    let currentY = 0;
    let targetScrollNorm = 0;
    let currentScrollNorm = 0;

    /**
     * Circular soft star texture using offscreen canvas (prevents square particle boxes)
     */
    function createStarTexture() {
        const size = 32;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const center = size / 2;
        const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
        gradient.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(0.25, 'rgba(240, 245, 255, 0.85)');
        gradient.addColorStop(0.55, 'rgba(200, 220, 255, 0.35)');
        gradient.addColorStop(1.0, 'rgba(180, 200, 255, 0.0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
        return texture;
    }

    /**
     * Build multi-layered starfield points
     */
    function buildStarLayers(starTexture) {
        starGroup = new THREE.Group();

        const isMobile = window.innerWidth < 768;
        const totalStars = isMobile ? 1500 : 3000;

        // 3 depth layers: distant dim, mid, bright (pixel-accurate sizes with sizeAttenuation: false)
        const layers = [
            { count: Math.round(totalStars * 0.60), size: isMobile ? 1.4 : 1.6, opacity: 0.75, minR: 600, maxR: 1200 },
            { count: Math.round(totalStars * 0.30), size: isMobile ? 2.2 : 2.6, opacity: 0.90, minR: 450, maxR: 900 },
            { count: Math.round(totalStars * 0.10), size: isMobile ? 3.4 : 4.2, opacity: 1.00, minR: 350, maxR: 750 }
        ];

        // ~70% slightly tinted white, ~30% mix of --c1 (#D8CAD5), --c5 (#A2D2DD), and --c4 (#878BBF)
        const colorPalette = [
            { r: 0.97, g: 0.97, b: 1.00 },
            { r: 0.98, g: 0.97, b: 0.99 },
            { r: 0.96, g: 0.98, b: 1.00 },
            { r: 0.99, g: 0.98, b: 0.97 },
            { r: 0.97, g: 0.98, b: 1.00 },
            { r: 0.98, g: 0.98, b: 1.00 },
            { r: 1.00, g: 0.99, b: 0.98 },
            { r: 0.847, g: 0.792, b: 0.835 }, // --c1 (#D8CAD5)
            { r: 0.635, g: 0.824, b: 0.867 }, // --c5 (#A2D2DD)
            { r: 0.529, g: 0.545, b: 0.749 }  // --c4 (#878BBF)
        ];

        layers.forEach(layer => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(layer.count * 3);
            const colors = new Float32Array(layer.count * 3);

            for (let i = 0; i < layer.count; i++) {
                const i3 = i * 3;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const radius = layer.minR + Math.random() * (layer.maxR - layer.minR);

                positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);

                const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                const lum = 0.85 + Math.random() * 0.15;
                colors[i3]     = c.r * lum;
                colors[i3 + 1] = c.g * lum;
                colors[i3 + 2] = c.b * lum;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: layer.size,
                sizeAttenuation: false,
                map: starTexture,
                transparent: true,
                opacity: layer.opacity,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            starGroup.add(new THREE.Points(geometry, material));
        });

        scene.add(starGroup);
    }

    /**
     * Render a single frame
     */
    function renderFrame() {
        if (!renderer || !scene || !camera) return;
        renderer.render(scene, camera);
    }

    /**
     * Animation Loop - active only while smoothing scroll movement
     */
    function renderLoop() {
        if (!isRunning) return;

        if (!isReducedMotion) {
            const diff = targetY - currentY;
            const scrollDiff = targetScrollNorm - currentScrollNorm;

            // If the difference is still noticeable, keep smoothing
            if (Math.abs(diff) > 0.00001 || Math.abs(scrollDiff) > 0.0001) {
                currentY += diff * 0.08;
                currentScrollNorm += scrollDiff * 0.08;
                starGroup.rotation.y = currentY;
                document.documentElement.style.setProperty('--scroll', currentScrollNorm.toFixed(4));
                renderFrame();
                animId = requestAnimationFrame(renderLoop);
            } else {
                // Smoothing finished: snap to target, render once, and stop loop
                currentY = targetY;
                currentScrollNorm = targetScrollNorm;
                starGroup.rotation.y = currentY;
                document.documentElement.style.setProperty('--scroll', currentScrollNorm.toFixed(4));
                renderFrame();
                isRunning = false;
                animId = null;
            }
        } else {
            // Reduced motion active: static render once and stop
            renderFrame();
            isRunning = false;
            animId = null;
        }
    }

    function startLoop() {
        if (isRunning) return;
        isRunning = true;
        animId = requestAnimationFrame(renderLoop);
    }

    function stopLoop() {
        isRunning = false;
        if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
        }
    }

    /**
     * Scroll event handler - updates target rotation based on scroll position
     */
    function onScroll() {
        if (isReducedMotion || !starGroup) return;
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        targetY = scrollY * SCROLL_SPEED;
        targetScrollNorm = Math.min(1, Math.max(0, scrollY / maxScroll));
        startLoop();
    }

    /**
     * Viewport Resize Handling
     */
    function onResize() {
        if (!renderer || !camera) return;
        const w = window.innerWidth;
        const h = window.innerHeight;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderFrame();
    }

    /**
     * Initialize Starfield
     */
    function initStarfield() {
        if (typeof THREE === 'undefined') {
            setTimeout(initStarfield, 100);
            return;
        }

        let canvas = document.getElementById('starfield');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'starfield';
            canvas.setAttribute('aria-hidden', 'true');
            document.body.prepend(canvas);
        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(0, 0, 0);

        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            alpha: true,
            powerPreference: 'low-power'
        });

        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(window.innerWidth, window.innerHeight, false);

        const starTexture = createStarTexture();
        buildStarLayers(starTexture);

        // Listen for changes in accessibility preferences
        motionMedia.addEventListener('change', e => {
            isReducedMotion = e.matches;
            if (isReducedMotion) {
                stopLoop();
                currentY = 0;
                currentScrollNorm = 0;
                targetScrollNorm = 0;
                document.documentElement.style.setProperty('--scroll', '0');
                if (starGroup) starGroup.rotation.y = 0;
                renderFrame();
            }
        });

        // Scroll listener: passive for high performance
        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial scroll position alignment
        const initialScrollY = window.scrollY || window.pageYOffset || 0;
        const maxInitialScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        targetY = initialScrollY * SCROLL_SPEED;
        currentY = targetY;
        targetScrollNorm = Math.min(1, Math.max(0, initialScrollY / maxInitialScroll));
        currentScrollNorm = targetScrollNorm;
        if (!isReducedMotion) {
            document.documentElement.style.setProperty('--scroll', currentScrollNorm.toFixed(4));
        }
        if (starGroup && !isReducedMotion) {
            starGroup.rotation.y = currentY;
        }

        // Performance: Stop RAF loop when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopLoop();
            } else if (!isReducedMotion && Math.abs(targetY - currentY) > 0.00001) {
                startLoop();
            } else {
                renderFrame();
            }
        });

        window.addEventListener('resize', onResize, { passive: true });

        // Render initial static frame (no automatic motion on load)
        renderFrame();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStarfield);
    } else {
        initStarfield();
    }
})();
