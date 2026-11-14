/**
 * ============================================================================
 * Space Echoes - 3D Celestial Starfield Background (Three.js)
 * ============================================================================
 * - High-performance THREE.Points with BufferGeometry
 * - Multi-layered depth distribution (distant, mid, bright hero stars)
 * - Subtle astronomical tints (soft blue, warm pale gold, pure white)
 * - Ultra-smooth, tranquil cosmic rotation with gentle mouse/gyro parallax
 * - Respects prefers-reduced-motion and supports interactive pause/play
 * - Automatically pauses loop during visibilitychange (document.hidden)
 * - Zero runtime object allocations inside requestAnimationFrame
 * ============================================================================
 */

(function () {
    'use strict';

    let scene, camera, renderer, starGroup;
    let animId = null;
    let isRunning = false;
    let isMotionActive = true;

    // Pre-allocated parallax coordinates to avoid allocations inside loop
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    /**
     * Generate a soft circular star particle texture using offscreen canvas.
     * Prevents blocky/square particles and creates soft celestial pinpricks.
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

        // 3 Balanced depth layers:
        // 1. Distant dim stars (60%)
        // 2. Mid-range ambient stars (30%)
        // 3. Bright hero celestial stars (10%)
        const layers = [
            { count: Math.round(totalStars * 0.60), size: isMobile ? 1.4 : 1.7, opacity: 0.72, minR: 600, maxR: 1200 },
            { count: Math.round(totalStars * 0.30), size: isMobile ? 2.2 : 2.7, opacity: 0.88, minR: 450, maxR: 900 },
            { count: Math.round(totalStars * 0.10), size: isMobile ? 3.4 : 4.0, opacity: 0.98, minR: 350, maxR: 750 }
        ];

        // Color palette weights:
        // 65% Soft icy blue-white
        // 25% Warm pale stellar yellow
        // 10% Pure crisp white
        const colorPalette = [
            { r: 0.88, g: 0.93, b: 1.00 }, // Soft blue
            { r: 0.88, g: 0.93, b: 1.00 },
            { r: 0.88, g: 0.93, b: 1.00 },
            { r: 1.00, g: 0.95, b: 0.88 }, // Pale gold
            { r: 1.00, g: 1.00, b: 1.00 }  // Pure white
        ];

        layers.forEach(layer => {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(layer.count * 3);
            const colors = new Float32Array(layer.count * 3);

            for (let i = 0; i < layer.count; i++) {
                const i3 = i * 3;

                // Spherical uniform distribution around the observer
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                const radius = layer.minR + Math.random() * (layer.maxR - layer.minR);

                positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
                positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                positions[i3 + 2] = radius * Math.cos(phi);

                const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
                // Slight natural brightness variation per star
                const lum = 0.85 + Math.random() * 0.15;
                colors[i3]     = c.r * lum;
                colors[i3 + 1] = c.g * lum;
                colors[i3 + 2] = c.b * lum;
            }

            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: layer.size,
                sizeAttenuation: true,
                map: starTexture,
                transparent: true,
                opacity: layer.opacity,
                vertexColors: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const points = new THREE.Points(geometry, material);
            starGroup.add(points);
        });

        scene.add(starGroup);
    }

    /**
     * Animation Loop - zero allocations inside loop
     */
    function renderLoop() {
        if (!isRunning) return;
        animId = requestAnimationFrame(renderLoop);

        if (isMotionActive) {
            // Very calm, gentle rotation
            starGroup.rotation.y += 0.00012;
            starGroup.rotation.x += 0.00004;

            // Gentle parallax damping
            currentParallaxX += (targetParallaxX - currentParallaxX) * 0.04;
            currentParallaxY += (targetParallaxY - currentParallaxY) * 0.04;

            camera.position.x = currentParallaxX * 18;
            camera.position.y = -currentParallaxY * 18;
            camera.lookAt(0, 0, 0);
        }

        renderer.render(scene, camera);
    }

    function startLoop() {
        if (isRunning) return;
        isRunning = true;
        renderLoop();
    }

    function stopLoop() {
        isRunning = false;
        if (animId !== null) {
            cancelAnimationFrame(animId);
            animId = null;
        }
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

        if (!isMotionActive) {
            renderer.render(scene, camera);
        }
    }

    /**
     * Motion Toggle Functionality (Accessible & respects user preference)
     */
    function setMotion(enabled) {
        isMotionActive = !!enabled;

        if (!isMotionActive) {
            targetParallaxX = 0;
            targetParallaxY = 0;
            currentParallaxX = 0;
            currentParallaxY = 0;
            if (camera) {
                camera.position.set(0, 0, 0);
                camera.lookAt(0, 0, 0);
            }
            if (renderer && scene && camera) {
                renderer.render(scene, camera);
            }
        }

        updateMotionButtonUI();
    }

    function toggleMotion() {
        setMotion(!isMotionActive);
    }

    function updateMotionButtonUI() {
        const btn = document.getElementById('motion-toggle');
        if (!btn) return;

        const isArabic = document.documentElement.lang !== 'en';
        const labelPlay = isArabic ? 'تشغيل الحركة' : 'Play Motion';
        const labelPause = isArabic ? 'إيقاف الحركة' : 'Pause Motion';

        const textSpan = btn.querySelector('.motion-text');
        const iconSpan = btn.querySelector('.motion-icon');

        if (isMotionActive) {
            btn.setAttribute('aria-label', labelPause);
            btn.setAttribute('title', labelPause);
            if (textSpan) textSpan.textContent = labelPause;
            if (iconSpan) iconSpan.textContent = '⏸';
            btn.classList.remove('is-paused');
        } else {
            btn.setAttribute('aria-label', labelPlay);
            btn.setAttribute('title', labelPlay);
            if (textSpan) textSpan.textContent = labelPlay;
            if (iconSpan) iconSpan.textContent = '▶';
            btn.classList.add('is-paused');
        }
    }

    /**
     * Initialize Starfield
     */
    function initStarfield() {
        if (typeof THREE === 'undefined') {
            console.warn('Three.js is not loaded. Starfield initialization deferred.');
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

        // Dedicated scene and camera
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(0, 0, 0);

        // Low-power, performant WebGL renderer with deep dark clear color (#05060a)
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: false,
            alpha: false,
            powerPreference: 'low-power'
        });

        renderer.setClearColor(0x05060a, 1.0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(window.innerWidth, window.innerHeight, false);

        // Generate circular star texture and build star layers
        const starTexture = createStarTexture();
        buildStarLayers(starTexture);

        // Check user motion preferences (prefers-reduced-motion)
        const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionMedia.matches) {
            isMotionActive = false;
        }
        motionMedia.addEventListener('change', e => {
            setMotion(!e.matches);
        });

        // Pointer Parallax (Passive listeners)
        window.addEventListener('pointermove', e => {
            if (!isMotionActive) return;
            targetParallaxX = (e.clientX / window.innerWidth - 0.5) * 0.18;
            targetParallaxY = (e.clientY / window.innerHeight - 0.5) * 0.18;
        }, { passive: true });

        // Mobile Gyroscope Parallax (DeviceOrientation)
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', e => {
                if (!isMotionActive || e.gamma === null || e.beta === null) return;
                targetParallaxX = (Math.max(-45, Math.min(45, e.gamma)) / 45) * 0.18;
                targetParallaxY = (Math.max(-45, Math.min(45, e.beta - 45)) / 45) * 0.18;
            }, { passive: true });
        }

        // Performance: Pause RAF when page is inactive or tab switched
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopLoop();
            } else {
                startLoop();
            }
        });

        window.addEventListener('resize', onResize, { passive: true });

        // Wire motion toggle button
        const motionBtn = document.getElementById('motion-toggle');
        if (motionBtn) {
            motionBtn.addEventListener('click', toggleMotion);
            updateMotionButtonUI();
        }

        // Initial render and start loop
        startLoop();
    }

    // Expose global controller for language synchronization or testing
    window.Starfield = {
        toggleMotion: toggleMotion,
        setMotion: setMotion,
        isMotionActive: function () { return isMotionActive; },
        updateUI: updateMotionButtonUI
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initStarfield);
    } else {
        initStarfield();
    }
})();
