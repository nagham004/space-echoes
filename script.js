/**
 * Space Echoes - Fullscreen 3D Universe Experience
 * Powered by Three.js (r128)
 */

let createGlobe;

(function () {
    'use strict';

    // Application State
    let currentLang = 'ar';
    let viewMode = 'overview'; // 'overview' | 'explore'
    let activeForeground = 'Moon'; // 'Moon' | 'Mars'
    let currentBody = 'Moon'; // Active body in explore mode
    let currentArtifact = null;
    let currentChapterIndex = 0;
    let currentSelectedMarkerIndex = 0;

    // Three.js Globals
    let renderer, scene, camera;
    let moonGroup, marsGroup;
    let moonMesh, marsMesh;
    let moonGlowMesh, marsGlowMesh;
    let moonMarkersGroup, marsMarkersGroup;
    let moonMarkerMeshes = [];
    let marsMarkerMeshes = [];
    let hoveredMarker = null;

    // Smooth Lerp Targets
    const targets = {
        moonPos: new THREE.Vector3(-0.7, -0.15, 0.5),
        moonScale: 1.3,
        marsPos: new THREE.Vector3(1.6, 0.8, -2.0),
        marsScale: 0.88,
        cameraPos: new THREE.Vector3(0, 0, 4.4),
        moonGlow: 0.0,
        marsGlow: 0.0
    };

    let autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isDragging = false;
    let startPointerPos = { x: 0, y: 0 };
    let lastPointerPos = { x: 0, y: 0 };

    // Scrollytelling Entrance State
    let scrollProgress = 0.0;
    let planetEntrance = 0.0;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    // Actual file paths in project
    const MOON_TEX_PATH = 'assets/images/Moon/lroc_color_2k.jpg';
    const MARS_TEX_PATH = 'assets/images/Mars/mars_color_2k.jpg';

    // DOM Elements
    const elements = {
        html: document.documentElement,
        langToggle: document.getElementById('lang-toggle'),
        heroTitleSection: document.getElementById('hero-title-section'),
        heroTitleContent: document.getElementById('hero-title-content'),
        mainTitle: document.getElementById('main-title'),
        mainDesc: document.getElementById('main-desc'),
        scrollPrompt: document.getElementById('scroll-prompt'),
        scrollDownHint: document.querySelector('.scroll-down-hint'),
        spaceCanvas: document.getElementById('space-canvas'),
        exploreControls: document.getElementById('explore-controls'),
        btnBackToOverview: document.getElementById('btn-back-to-overview'),
        btnSwitchMoon: document.getElementById('btn-switch-moon'),
        btnSwitchMars: document.getElementById('btn-switch-mars'),
        sectionHeading: document.getElementById('section-heading'),
        sectionSubheading: document.getElementById('section-subheading'),
        markersNavLabel: document.getElementById('markers-nav-label'),
        markerPills: document.getElementById('marker-pills'),
        artifactDrawer: document.getElementById('artifact-drawer'),
        btnCloseDrawer: document.getElementById('btn-close-drawer'),
        artifactTag: document.getElementById('artifact-tag'),
        artifactTitle: document.getElementById('artifact-title'),
        artifactYear: document.getElementById('artifact-year'),
        artifactCoords: document.getElementById('artifact-coords'),
        artifactIntroBox: document.getElementById('artifact-intro-box'),
        artifactSummary: document.getElementById('artifact-summary'),
        btnDiscoverStory: document.getElementById('btn-discover-story'),
        chaptersWrapper: document.getElementById('chapters-wrapper'),
        chapterCounter: document.getElementById('chapter-counter'),
        chaptersContainer: document.getElementById('chapters-container'),
        btnPrevChapter: document.getElementById('btn-prev-chapter'),
        btnNextChapter: document.getElementById('btn-next-chapter')
    };

    /**
     * Texture Loader with Color Space configuration and onError error logging
     */
    const textureLoader = new THREE.TextureLoader();

    function configureTexture(texture) {
        if (typeof THREE.sRGBEncoding !== 'undefined') {
            texture.encoding = THREE.sRGBEncoding;
        } else if (typeof THREE.SRGBColorSpace !== 'undefined') {
            texture.colorSpace = THREE.SRGBColorSpace;
        }
        texture.needsUpdate = true;
    }

    function loadPlanetTexture(path, bodyKey) {
        const isFileProtocol = window.location.protocol === 'file:';
        const hasEmbedded = typeof embeddedTextures !== 'undefined' && embeddedTextures && embeddedTextures[bodyKey];

        // On file:// protocol, Chrome blocks relative assets with CORS error ('null' origin).
        // If embedded NASA textures exist, use them immediately so images never fail on file://
        const initialPath = (isFileProtocol && hasEmbedded) ? embeddedTextures[bodyKey] : path;

        return textureLoader.load(
            initialPath,
            texture => {
                configureTexture(texture);
            },
            undefined,
            err => {
                console.error(`Failed to load texture at path: ${path}`, err);
                if (hasEmbedded) {
                    textureLoader.load(embeddedTextures[bodyKey], fallbackTex => {
                        configureTexture(fallbackTex);
                        if (bodyKey === 'moon' && moonMesh) {
                            moonMesh.material.map = fallbackTex;
                            moonMesh.material.needsUpdate = true;
                        } else if (bodyKey === 'mars' && marsMesh) {
                            marsMesh.material.map = fallbackTex;
                            marsMesh.material.needsUpdate = true;
                        }
                    });
                }
            }
        );
    }

    /**
     * Convert Latitude and Longitude to 3D Cartesian coordinates on sphere
     * (Equirectangular with prime meridian 0° at center, East to the right)
     */
    function latLngToVec(lat, lng, r) {
        const b = lat * Math.PI / 180;
        const l = lng * Math.PI / 180;
        return new THREE.Vector3(
            r * Math.cos(b) * Math.cos(l),
            r * Math.sin(b),
            -r * Math.cos(b) * Math.sin(l)
        );
    }

    /**
     * Standalone createGlobe function as requested
     */
    createGlobe = function (canvas, texturePath, artifacts) {
        if (canvas._globeController) {
            canvas._globeController.update(texturePath, artifacts);
            return canvas._globeController;
        }

        const controller = {
            update(newTex, newArtifacts) {
                if (newTex.toLowerCase().includes('mars')) {
                    enterExploreMode('Mars');
                } else {
                    enterExploreMode('Moon');
                }
            },
            rotateToMarker(mesh) {
                rotateActivePlanetToMarker(mesh);
            },
            resize() {
                resizeStage();
            }
        };

        canvas._globeController = controller;
        return controller;
    };

    /**
     * Initialize Fullscreen 3D Scene
     */
    function initSpaceScene() {
        const canvas = elements.spaceCanvas;
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);

        // Configure renderer output color space for true color reproduction
        if (typeof THREE.sRGBEncoding !== 'undefined') {
            renderer.outputEncoding = THREE.sRGBEncoding;
        } else if (typeof THREE.SRGBColorSpace !== 'undefined') {
            renderer.outputColorSpace = THREE.SRGBColorSpace;
        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.set(0, 0, 4.4);

        // Balanced natural lighting matching reference (moon.html)
        // Soft ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
        scene.add(ambientLight);

        // Natural Sun directional light
        const sun = new THREE.DirectionalLight(0xffffff, 1.1);
        sun.position.set(5, 2.5, 5);
        scene.add(sun);

        // 1. Build Moon Sphere with Authentic Map Texture
        moonGroup = new THREE.Group();
        moonGroup.position.copy(targets.moonPos);
        moonGroup.scale.set(targets.moonScale, targets.moonScale, targets.moonScale);
        // Face near side (prime meridian 0°) towards camera initially
        moonGroup.rotation.y = -Math.PI / 2;
        scene.add(moonGroup);

        const moonTexture = loadPlanetTexture(MOON_TEX_PATH, 'moon');
        const moonMat = new THREE.MeshStandardMaterial({
            map: moonTexture,
            roughness: 1.0,
            metalness: 0.0,
            color: 0xffffff
        });
        moonMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), moonMat);
        moonMesh.userData = { body: 'Moon' };
        moonGroup.add(moonMesh);

        // Outer Atmospheric Hover Glow (Separate shell, leaves map colors natural)
        const moonGlowMat = new THREE.MeshBasicMaterial({
            color: 0x7cc4ff,
            transparent: true,
            opacity: 0.0,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        moonGlowMesh = new THREE.Mesh(new THREE.SphereGeometry(1.05, 32, 32), moonGlowMat);
        moonGroup.add(moonGlowMesh);

        // Moon Landing Markers Group
        moonMarkersGroup = new THREE.Group();
        moonMarkersGroup.visible = false;
        moonGroup.add(moonMarkersGroup);
        buildMarkersForBody('Moon', moonMarkersGroup, moonMarkerMeshes);

        // 2. Build Mars Sphere with Authentic Map Texture
        marsGroup = new THREE.Group();
        marsGroup.position.copy(targets.marsPos);
        marsGroup.scale.set(targets.marsScale, targets.marsScale, targets.marsScale);
        marsGroup.rotation.y = -Math.PI / 2;
        scene.add(marsGroup);

        const marsTexture = loadPlanetTexture(MARS_TEX_PATH, 'mars');
        const marsMat = new THREE.MeshStandardMaterial({
            map: marsTexture,
            roughness: 1.0,
            metalness: 0.0,
            color: 0xffffff
        });
        marsMesh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), marsMat);
        marsMesh.userData = { body: 'Mars' };
        marsGroup.add(marsMesh);

        // Outer Atmospheric Hover Glow (Separate shell)
        const marsGlowMat = new THREE.MeshBasicMaterial({
            color: 0xff5a36,
            transparent: true,
            opacity: 0.0,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        marsGlowMesh = new THREE.Mesh(new THREE.SphereGeometry(1.05, 32, 32), marsGlowMat);
        marsGroup.add(marsGlowMesh);

        // Mars Landing Markers Group
        marsMarkersGroup = new THREE.Group();
        marsMarkersGroup.visible = false;
        marsGroup.add(marsMarkersGroup);
        buildMarkersForBody('Mars', marsMarkersGroup, marsMarkerMeshes);

        setupControls();
        resizeStage();
        window.addEventListener('resize', resizeStage);

        // prefers-reduced-motion
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (motionQuery.addEventListener) {
            motionQuery.addEventListener('change', e => {
                autoRotate = !e.matches;
            });
        }

        animateStage();
    }

    /**
     * Build Landing Markers
     */
    function buildMarkersForBody(body, group, meshList) {
        meshList.length = 0;
        const artifacts = spaceArtifacts.filter(item => {
            const loc = (item.location || item.en?.location || '').toLowerCase();
            return loc === body.toLowerCase() && item.coordinates;
        });

        artifacts.forEach((artifact, idx) => {
            const { lat, lng } = artifact.coordinates;
            const markerPos = latLngToVec(lat, lng, 1.018);

            const markerGeo = new THREE.SphereGeometry(0.028, 20, 20);
            const markerMat = new THREE.MeshStandardMaterial({
                color: 0xff5a36,
                emissive: 0xff3b14,
                emissiveIntensity: 0.85,
                roughness: 0.3
            });

            const marker = new THREE.Mesh(markerGeo, markerMat);
            marker.position.copy(markerPos);

            const haloGeo = new THREE.RingGeometry(0.035, 0.048, 24);
            const haloMat = new THREE.MeshBasicMaterial({
                color: 0xffa07a,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.75
            });
            const halo = new THREE.Mesh(haloGeo, haloMat);
            halo.lookAt(markerPos.clone().multiplyScalar(2));
            marker.add(halo);

            marker.userData = {
                artifact: artifact,
                index: idx,
                halo: halo,
                body: body
            };

            meshList.push(marker);
            group.add(marker);
        });
    }

    /**
     * Swap foreground planet in Overview mode
     */
    function swapForeground(newForeground) {
        activeForeground = newForeground;

        if (newForeground === 'Moon') {
            targets.moonPos.set(-0.7, -0.15, 0.5);
            targets.moonScale = 1.3;

            targets.marsPos.set(1.6, 0.8, -2.0);
            targets.marsScale = 0.88;
        } else {
            targets.marsPos.set(0.7, -0.15, 0.5);
            targets.marsScale = 1.3;

            targets.moonPos.set(-1.6, 0.8, -2.0);
            targets.moonScale = 0.88;
        }
    }

    /**
     * Enter Explore Mode: Expands the planet to full screen
     */
    function enterExploreMode(body) {
        viewMode = 'explore';
        currentBody = body;
        currentSelectedMarkerIndex = 0;

        if (body === 'Moon') {
            targets.moonPos.set(0, 0, 0);
            targets.moonScale = 1.18;
            moonMarkersGroup.visible = true;

            targets.marsPos.set(0, 0, -35);
            targets.marsScale = 0.05;
            marsMarkersGroup.visible = false;
        } else {
            targets.marsPos.set(0, 0, 0);
            targets.marsScale = 1.18;
            marsMarkersGroup.visible = true;

            targets.moonPos.set(0, 0, -35);
            targets.moonScale = 0.05;
            moonMarkersGroup.visible = false;
        }

        targets.cameraPos.set(0, 0, 3.2);
        targets.moonGlow = 0.0;
        targets.marsGlow = 0.0;

        // UI transitions
        if (elements.heroTitleSection) {
            elements.heroTitleSection.style.display = 'none';
        }
        elements.exploreControls.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        const strings = uiText[currentLang];
        elements.spaceCanvas.setAttribute('aria-label', body === 'Moon' ? strings.moonSphereAria : strings.marsSphereAria);

        elements.btnSwitchMoon.classList.toggle('active', body === 'Moon');
        elements.btnSwitchMoon.setAttribute('aria-checked', body === 'Moon' ? 'true' : 'false');

        elements.btnSwitchMars.classList.toggle('active', body === 'Mars');
        elements.btnSwitchMars.setAttribute('aria-checked', body === 'Mars' ? 'true' : 'false');

        elements.sectionHeading.textContent = body === 'Moon' ? strings.moonSectionTitle : strings.marsSectionTitle;
        elements.sectionSubheading.textContent = body === 'Moon' ? strings.moonSectionDesc : strings.marsSectionDesc;

        updateMarkerPills();
        elements.spaceCanvas.focus();
    }

    /**
     * Exit Explore Mode
     */
    function exitExploreMode() {
        viewMode = 'overview';
        moonMarkersGroup.visible = false;
        marsMarkersGroup.visible = false;
        document.body.style.overflow = '';

        swapForeground(activeForeground);
        targets.cameraPos.set(0, 0, 4.4);

        if (elements.heroTitleSection) {
            elements.heroTitleSection.style.display = '';
        }
        elements.exploreControls.classList.add('hidden');
        elements.artifactDrawer.classList.add('hidden');

        const strings = uiText[currentLang];
        elements.spaceCanvas.setAttribute('aria-label', strings.overviewSphereAria);

        onWindowScroll();
        elements.spaceCanvas.focus();
    }

    /**
     * Update marker pills toolbar
     */
    function updateMarkerPills() {
        elements.markerPills.innerHTML = '';
        const meshes = currentBody === 'Moon' ? moonMarkerMeshes : marsMarkerMeshes;

        meshes.forEach((mesh, idx) => {
            const artifact = mesh.userData.artifact;
            const name = artifact[currentLang]?.name || artifact.id;
            const btn = document.createElement('button');
            btn.className = 'pill-btn' + (idx === currentSelectedMarkerIndex ? ' active' : '');
            btn.textContent = name;
            btn.setAttribute('aria-label', name);
            btn.addEventListener('click', () => {
                currentSelectedMarkerIndex = idx;
                rotateActivePlanetToMarker(mesh);
                openArtifactCard(artifact);
                highlightActivePill(idx);
            });
            elements.markerPills.appendChild(btn);
        });
    }

    function highlightActivePill(index) {
        const pills = elements.markerPills.querySelectorAll('.pill-btn');
        pills.forEach((p, i) => {
            p.classList.toggle('active', i === index);
        });
    }

    function rotateActivePlanetToMarker(mesh) {
        autoRotate = false;
        const artifact = mesh.userData.artifact;
        if (!artifact || !artifact.coordinates) return;

        const group = currentBody === 'Moon' ? moonGroup : marsGroup;
        const { lat, lng } = artifact.coordinates;
        group.rotation.y = - (lng * Math.PI / 180) - Math.PI / 2;
        group.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, lat * Math.PI / 180));
    }

    function clampX(group) {
        if (group) {
            group.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, group.rotation.x));
        }
    }

    function zoom(delta) {
        if (viewMode === 'explore') {
            camera.position.z = Math.max(1.8, Math.min(5.0, camera.position.z + delta));
            targets.cameraPos.z = camera.position.z;
        }
    }

    /**
     * Interaction Controls
     */
    function setupControls() {
        const canvas = elements.spaceCanvas;

        canvas.addEventListener('pointerdown', e => {
            isDragging = true;
            startPointerPos = { x: e.clientX, y: e.clientY };
            lastPointerPos = { x: e.clientX, y: e.clientY };
            canvas.setPointerCapture(e.pointerId);
            if (viewMode === 'explore') {
                canvas.style.cursor = 'grabbing';
                autoRotate = false;
            }
        });

        canvas.addEventListener('pointermove', e => {
            const rect = canvas.getBoundingClientRect();
            mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            if (isDragging) {
                const deltaX = e.clientX - lastPointerPos.x;
                const deltaY = e.clientY - lastPointerPos.y;

                if (viewMode === 'explore') {
                    const activeGroup = currentBody === 'Moon' ? moonGroup : marsGroup;
                    activeGroup.rotation.y += deltaX * 0.005;
                    activeGroup.rotation.x += deltaY * 0.005;
                    clampX(activeGroup);
                }

                lastPointerPos = { x: e.clientX, y: e.clientY };
            } else {
                handlePointerHover();
            }
        });

        canvas.addEventListener('pointerup', e => {
            if (isDragging) {
                isDragging = false;
                canvas.style.cursor = 'grab';

                const dist = Math.hypot(e.clientX - startPointerPos.x, e.clientY - startPointerPos.y);
                if (dist < 6) {
                    handlePointerClick();
                }
            }
        });

        canvas.addEventListener('pointercancel', () => {
            isDragging = false;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('wheel', e => {
            if (viewMode === 'explore') {
                e.preventDefault();
                zoom(e.deltaY * 0.002);
            }
        }, { passive: false });

        canvas.addEventListener('keydown', e => {
            if (viewMode === 'explore') {
                const activeGroup = currentBody === 'Moon' ? moonGroup : marsGroup;
                const step = 0.1;
                const k = e.key;

                if (k === 'ArrowLeft') {
                    activeGroup.rotation.y -= step;
                } else if (k === 'ArrowRight') {
                    activeGroup.rotation.y += step;
                } else if (k === 'ArrowUp') {
                    activeGroup.rotation.x -= step;
                } else if (k === 'ArrowDown') {
                    activeGroup.rotation.x += step;
                } else if (k === '+' || k === '=') {
                    zoom(-0.2);
                } else if (k === '-') {
                    zoom(0.2);
                } else if (k === 'Enter' || k === ' ') {
                    e.preventDefault();
                    if (hoveredMarker) {
                        openArtifactCard(hoveredMarker.userData.artifact);
                    } else {
                        const meshes = currentBody === 'Moon' ? moonMarkerMeshes : marsMarkerMeshes;
                        if (meshes.length > 0) {
                            const target = meshes[currentSelectedMarkerIndex] || meshes[0];
                            rotateActivePlanetToMarker(target);
                            openArtifactCard(target.userData.artifact);
                        }
                    }
                    return;
                } else {
                    return;
                }

                e.preventDefault();
                clampX(activeGroup);
                autoRotate = false;
            } else {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    enterExploreMode(activeForeground);
                }
            }
        });
    }

    /**
     * Hover Raycast for Atmospheric Glow
     */
    function handlePointerHover() {
        if (!camera) return;
        raycaster.setFromCamera(mouseVector, camera);

        if (viewMode === 'overview') {
            if (planetEntrance < 0.6) {
                targets.moonGlow = 0.0;
                targets.marsGlow = 0.0;
                elements.spaceCanvas.style.cursor = 'default';
                return;
            }

            const intersects = raycaster.intersectObjects([moonMesh, marsMesh], false);

            if (intersects.length > 0) {
                const hit = intersects[0].object;
                elements.spaceCanvas.style.cursor = 'pointer';

                if (hit === moonMesh) {
                    targets.moonGlow = 1.0;
                    targets.marsGlow = 0.0;
                } else if (hit === marsMesh) {
                    targets.marsGlow = 1.0;
                    targets.moonGlow = 0.0;
                }
            } else {
                targets.moonGlow = 0.0;
                targets.marsGlow = 0.0;
                elements.spaceCanvas.style.cursor = 'grab';
            }
        } else {
            const currentMeshes = currentBody === 'Moon' ? moonMarkerMeshes : marsMarkerMeshes;
            const intersects = raycaster.intersectObjects(currentMeshes, true);

            if (intersects.length > 0) {
                let hit = intersects[0].object;
                while (hit && !hit.userData.artifact && hit.parent) {
                    hit = hit.parent;
                }
                if (hit && hit.userData.artifact) {
                    elements.spaceCanvas.style.cursor = 'pointer';
                    if (hoveredMarker !== hit) {
                        if (hoveredMarker) hoveredMarker.scale.set(1, 1, 1);
                        hoveredMarker = hit;
                        hoveredMarker.scale.set(1.4, 1.4, 1.4);
                    }
                    return;
                }
            }

            if (hoveredMarker) {
                hoveredMarker.scale.set(1, 1, 1);
                hoveredMarker = null;
            }
            elements.spaceCanvas.style.cursor = 'grab';
        }
    }

    /**
     * Click Raycast for Swap / Explore
     */
    function handlePointerClick() {
        if (!camera) return;
        raycaster.setFromCamera(mouseVector, camera);

        if (viewMode === 'overview') {
            if (planetEntrance < 0.6) return;

            const intersects = raycaster.intersectObjects([moonMesh, marsMesh], false);

            if (intersects.length > 0) {
                const hitBody = intersects[0].object.userData.body;

                if (hitBody === activeForeground) {
                    // Clicked foreground -> Expand to full screen!
                    enterExploreMode(hitBody);
                } else {
                    // Clicked background -> Swap forward!
                    swapForeground(hitBody);
                }
            }
        } else {
            const currentMeshes = currentBody === 'Moon' ? moonMarkerMeshes : marsMarkerMeshes;
            const intersects = raycaster.intersectObjects(currentMeshes, true);

            if (intersects.length > 0) {
                let hit = intersects[0].object;
                while (hit && !hit.userData.artifact && hit.parent) {
                    hit = hit.parent;
                }
                if (hit && hit.userData.artifact) {
                    currentSelectedMarkerIndex = hit.userData.index || 0;
                    highlightActivePill(currentSelectedMarkerIndex);
                    openArtifactCard(hit.userData.artifact);
                }
            }
        }
    }

    /**
     * Cinematic Scroll Listener:
     * - Shrinks and fades the hero title as user scrolls down
     * - Gradually introduces the 3D celestial planets from below
     */
    function onWindowScroll() {
        if (viewMode === 'explore') return;

        const scrollY = window.scrollY || window.pageYOffset || 0;
        const vh = window.innerHeight || 1;

        // Progress normalized across the hero scroll track
        scrollProgress = Math.min(1, Math.max(0, scrollY / (vh * 0.85)));

        // Phase 1: Hero title shrinks and fades
        if (elements.heroTitleContent) {
            // Shrinks smoothly from scale 1.0 to 0.55 and fades to 0
            const titleProgress = Math.min(1, Math.max(0, scrollProgress / 0.45));
            const titleOpacity = Math.max(0, 1 - titleProgress);
            const titleScale = Math.max(0.55, 1 - (titleProgress * 0.42));
            const titleTranslateY = -titleProgress * 80;

            elements.heroTitleContent.style.opacity = titleOpacity.toFixed(3);
            elements.heroTitleContent.style.transform = `scale(${titleScale.toFixed(3)}) translateY(${titleTranslateY.toFixed(1)}px)`;
            elements.heroTitleContent.style.pointerEvents = titleOpacity < 0.1 ? 'none' : 'auto';
            elements.heroTitleContent.style.visibility = titleOpacity <= 0 ? 'hidden' : 'visible';
        }

        // Phase 2: Planets rise and appear (starts at 0.15, fully entered by 0.9)
        const entranceRaw = Math.min(1, Math.max(0, (scrollProgress - 0.15) / 0.75));
        planetEntrance = 1 - Math.pow(1 - entranceRaw, 3);
    }

    /**
     * Animation Loop
     */
    function animateStage() {
        requestAnimationFrame(animateStage);

        // 1. Position & Scale Lerping
        if (viewMode === 'overview') {
            if (planetEntrance < 0.01) {
                if (moonGroup) moonGroup.visible = false;
                if (marsGroup) marsGroup.visible = false;
            } else {
                if (moonGroup) moonGroup.visible = true;
                if (marsGroup) marsGroup.visible = true;
            }

            // Smooth entrance from below
            const yOffset = (1 - planetEntrance) * -4.2;
            const zOffset = (1 - planetEntrance) * -2.0;

            const targetMoonPos = targets.moonPos.clone();
            targetMoonPos.y += yOffset;
            targetMoonPos.z += zOffset;

            const targetMarsPos = targets.marsPos.clone();
            targetMarsPos.y += yOffset;
            targetMarsPos.z += zOffset;

            const targetMoonScale = Math.max(0.001, targets.moonScale * planetEntrance);
            const targetMarsScale = Math.max(0.001, targets.marsScale * planetEntrance);

            moonGroup.position.lerp(targetMoonPos, 0.1);
            marsGroup.position.lerp(targetMarsPos, 0.1);
            camera.position.lerp(targets.cameraPos, 0.08);

            const currentMoonScale = moonGroup.scale.x + (targetMoonScale - moonGroup.scale.x) * 0.1;
            moonGroup.scale.set(currentMoonScale, currentMoonScale, currentMoonScale);

            const currentMarsScale = marsGroup.scale.x + (targetMarsScale - marsGroup.scale.x) * 0.1;
            marsGroup.scale.set(currentMarsScale, currentMarsScale, currentMarsScale);
        } else {
            moonGroup.position.lerp(targets.moonPos, 0.08);
            marsGroup.position.lerp(targets.marsPos, 0.08);
            camera.position.lerp(targets.cameraPos, 0.08);

            const currentMoonScale = moonGroup.scale.x + (targets.moonScale - moonGroup.scale.x) * 0.08;
            moonGroup.scale.set(currentMoonScale, currentMoonScale, currentMoonScale);

            const currentMarsScale = marsGroup.scale.x + (targets.marsScale - marsGroup.scale.x) * 0.08;
            marsGroup.scale.set(currentMarsScale, currentMarsScale, currentMarsScale);
        }

        // 2. Atmospheric Outer Glow Shell Opacity Lerping (Surface texture remains natural)
        if (moonGlowMesh) {
            moonGlowMesh.material.opacity += (targets.moonGlow * 0.35 - moonGlowMesh.material.opacity) * 0.1;
        }

        if (marsGlowMesh) {
            marsGlowMesh.material.opacity += (targets.marsGlow * 0.35 - marsGlowMesh.material.opacity) * 0.1;
        }

        // 3. Natural Planetary Rotation
        if (autoRotate) {
            if (viewMode === 'overview') {
                moonGroup.rotation.y += 0.002;
                marsGroup.rotation.y += 0.0022;
            } else {
                const activeGroup = currentBody === 'Moon' ? moonGroup : marsGroup;
                activeGroup.rotation.y += 0.002;
            }
        }

        // 4. Marker Halo Pulses
        if (viewMode === 'explore') {
            const time = Date.now() * 0.003;
            const meshes = currentBody === 'Moon' ? moonMarkerMeshes : marsMarkerMeshes;
            meshes.forEach(m => {
                if (m.userData.halo) {
                    const s = 1 + Math.sin(time + m.userData.index) * 0.15;
                    m.userData.halo.scale.set(s, s, s);
                }
            });
        }

        renderer.render(scene, camera);
    }

    /**
     * Resize to Full Viewport
     */
    function resizeStage() {
        if (!renderer || !camera) return;
        const w = window.innerWidth;
        const h = window.innerHeight;

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    /**
     * Artifact Story Drawer
     */
    function openArtifactCard(artifact) {
        currentArtifact = artifact;
        currentChapterIndex = 0;

        const langData = artifact[currentLang] || artifact.en;
        const strings = uiText[currentLang];

        elements.artifactTag.textContent = langData.location || (currentBody === 'Moon' ? strings.planetMoon : strings.planetMars);
        elements.artifactTitle.textContent = langData.name || artifact.id;
        elements.artifactYear.textContent = `${strings.year}: ${langData.year || ''}`;

        if (artifact.coordinates) {
            const latStr = `${Math.abs(artifact.coordinates.lat).toFixed(2)}° ${artifact.coordinates.lat >= 0 ? 'N' : 'S'}`;
            const lngStr = `${Math.abs(artifact.coordinates.lng).toFixed(2)}° ${artifact.coordinates.lng >= 0 ? 'E' : 'W'}`;
            elements.artifactCoords.textContent = `${strings.coordinates}: ${latStr}, ${lngStr}`;
            elements.artifactCoords.classList.remove('hidden');
        } else {
            elements.artifactCoords.classList.add('hidden');
        }

        let summaryText = '';
        if (langData.chapters && langData.chapters.length > 0) {
            summaryText = langData.chapters[0].content || langData.chapters[0].title;
        } else if (langData.story_parts) {
            summaryText = langData.story_parts.intro || '';
        }
        elements.artifactSummary.textContent = summaryText;

        elements.artifactIntroBox.classList.remove('hidden');
        elements.chaptersWrapper.classList.add('hidden');
        elements.artifactDrawer.classList.remove('hidden');

        elements.artifactTitle.setAttribute('tabindex', '-1');
        elements.artifactTitle.focus();
    }

    function startChapters() {
        if (!currentArtifact) return;
        elements.artifactIntroBox.classList.add('hidden');
        elements.chaptersWrapper.classList.remove('hidden');
        currentChapterIndex = 0;
        renderChapter(currentChapterIndex);
    }

    function getArtifactChapters() {
        if (!currentArtifact) return [];
        const langData = currentArtifact[currentLang] || currentArtifact.en;

        if (langData.chapters && Array.isArray(langData.chapters) && langData.chapters.length > 0) {
            return langData.chapters;
        }

        if (langData.story_parts) {
            const parts = langData.story_parts;
            return [
                { type: 'text', title: currentLang === 'ar' ? 'المقدمة' : 'Introduction', content: parts.intro },
                { type: 'facts', title: currentLang === 'ar' ? 'سبب الإرسال' : 'Mission Purpose', items: [parts.mission] },
                { type: 'numbers', title: currentLang === 'ar' ? 'الإنجازات' : 'Achievements', stats: [{ value: langData.year || '—', label: parts.achievement }] },
                { type: 'text', title: currentLang === 'ar' ? 'كيف انتهت' : 'How it Ended', content: parts.ending }
            ];
        }

        return [];
    }

    function renderChapter(index) {
        const chapters = getArtifactChapters();
        const total = chapters.length;
        if (total === 0) return;

        const chapter = chapters[index];
        const strings = uiText[currentLang];

        elements.chapterCounter.textContent = `${strings.chapter} ${index + 1} ${strings.of} ${total}`;

        elements.chaptersContainer.innerHTML = '';
        const chapterCard = document.createElement('article');
        chapterCard.className = `chapter-card chapter-${chapter.type}`;

        const heading = document.createElement('h3');
        heading.className = 'chapter-title';
        heading.textContent = chapter.title || `${strings.chapter} ${index + 1}`;
        heading.setAttribute('tabindex', '-1');
        chapterCard.appendChild(heading);

        switch (chapter.type) {
            case 'text': {
                const p = document.createElement('p');
                p.className = 'chapter-text-content';
                p.textContent = chapter.content || '';
                chapterCard.appendChild(p);
                break;
            }
            case 'facts': {
                const ul = document.createElement('ul');
                ul.className = 'facts-list';
                const items = chapter.items || [];
                items.forEach(item => {
                    const li = document.createElement('li');
                    li.innerHTML = `<span class="fact-icon" aria-hidden="true">✦</span><span class="fact-body">${typeof item === 'string' ? item : (item.text || item.label || '')}</span>`;
                    ul.appendChild(li);
                });
                chapterCard.appendChild(ul);
                break;
            }
            case 'timeline': {
                const tl = document.createElement('div');
                tl.className = 'timeline-flow';
                const events = chapter.events || [];
                events.forEach(ev => {
                    const item = document.createElement('div');
                    item.className = 'timeline-item';
                    item.innerHTML = `
                        <div class="timeline-badge">${ev.year || ''}</div>
                        <div class="timeline-body">
                            <h4 class="timeline-title">${ev.title || ''}</h4>
                            <p class="timeline-desc">${ev.description || ''}</p>
                        </div>
                    `;
                    tl.appendChild(item);
                });
                chapterCard.appendChild(tl);
                break;
            }
            case 'numbers': {
                const grid = document.createElement('div');
                grid.className = 'numbers-grid';
                const stats = chapter.stats || [];
                stats.forEach(st => {
                    const box = document.createElement('div');
                    box.className = 'stat-card';
                    box.innerHTML = `
                        <div class="stat-number">${st.value || ''}</div>
                        <div class="stat-label">${st.label || ''}</div>
                    `;
                    grid.appendChild(box);
                });
                chapterCard.appendChild(grid);
                break;
            }
            default: {
                const fallback = document.createElement('p');
                fallback.className = 'chapter-text-content';
                fallback.textContent = chapter.content || JSON.stringify(chapter);
                chapterCard.appendChild(fallback);
                break;
            }
        }

        elements.chaptersContainer.appendChild(chapterCard);

        if (index > 0) {
            elements.btnPrevChapter.classList.remove('hidden');
            elements.btnPrevChapter.textContent = strings.prevChapter;
        } else {
            elements.btnPrevChapter.classList.add('hidden');
        }

        if (index < total - 1) {
            elements.btnNextChapter.textContent = strings.nextChapter;
        } else {
            elements.btnNextChapter.textContent = strings.finishStory;
        }

        setTimeout(() => {
            heading.focus();
        }, 50);
    }

    function handleNextChapter() {
        const chapters = getArtifactChapters();
        if (currentChapterIndex < chapters.length - 1) {
            currentChapterIndex++;
            renderChapter(currentChapterIndex);
        } else {
            elements.artifactDrawer.classList.add('hidden');
            elements.spaceCanvas.focus();
        }
    }

    function handlePrevChapter() {
        if (currentChapterIndex > 0) {
            currentChapterIndex--;
            renderChapter(currentChapterIndex);
        }
    }

    function closeArtifactDrawer() {
        elements.artifactDrawer.classList.add('hidden');
        elements.spaceCanvas.focus();
    }

    /**
     * Language Localization
     */
    function setLanguage(lang) {
        currentLang = lang;
        const strings = uiText[lang];

        elements.html.lang = lang;
        elements.html.dir = lang === 'ar' ? 'rtl' : 'ltr';

        elements.langToggle.textContent = strings.langToggle;
        elements.mainTitle.textContent = strings.siteTitle;
        elements.mainDesc.textContent = strings.siteDesc;

        elements.btnBackToOverview.textContent = strings.backToPlanets;
        elements.btnSwitchMoon.textContent = strings.planetMoon;
        elements.btnSwitchMars.textContent = strings.planetMars;

        elements.markersNavLabel.textContent = strings.activeArtifactsCount + ':';

        if (viewMode === 'overview') {
            if (elements.hintText) elements.hintText.textContent = strings.overviewHint;
            elements.spaceCanvas.setAttribute('aria-label', strings.overviewSphereAria);
        } else {
            if (elements.hintText) elements.hintText.textContent = strings.exploreHint;
            elements.spaceCanvas.setAttribute('aria-label', currentBody === 'Moon' ? strings.moonSphereAria : strings.marsSphereAria);
            elements.sectionHeading.textContent = currentBody === 'Moon' ? strings.moonSectionTitle : strings.marsSectionTitle;
            elements.sectionSubheading.textContent = currentBody === 'Moon' ? strings.moonSectionDesc : strings.marsSectionDesc;
            updateMarkerPills();
        }

        elements.btnDiscoverStory.textContent = strings.discoverStory;
        elements.btnNextChapter.textContent = strings.nextChapter;
        elements.btnPrevChapter.textContent = strings.prevChapter;

        if (elements.scrollPrompt && strings.scrollPrompt) {
            elements.scrollPrompt.textContent = strings.scrollPrompt;
        }
    }

    /**
     * Setup Event Listeners
     */
    function setupEventListeners() {
        elements.langToggle.addEventListener('click', () => {
            setLanguage(currentLang === 'ar' ? 'en' : 'ar');
        });

        window.addEventListener('scroll', onWindowScroll, { passive: true });

        if (elements.scrollDownHint) {
            elements.scrollDownHint.addEventListener('click', () => {
                window.scrollTo({
                    top: window.innerHeight * 1.05,
                    behavior: 'smooth'
                });
            });
        }

        // Explore Mode Switcher buttons
        elements.btnSwitchMoon.addEventListener('click', () => enterExploreMode('Moon'));
        elements.btnSwitchMars.addEventListener('click', () => enterExploreMode('Mars'));
        elements.btnBackToOverview.addEventListener('click', exitExploreMode);

        // Story Drawer controls
        elements.btnDiscoverStory.addEventListener('click', startChapters);
        elements.btnNextChapter.addEventListener('click', handleNextChapter);
        elements.btnPrevChapter.addEventListener('click', handlePrevChapter);
        elements.btnCloseDrawer.addEventListener('click', closeArtifactDrawer);

        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (!elements.artifactDrawer.classList.contains('hidden')) {
                    closeArtifactDrawer();
                } else if (viewMode === 'explore') {
                    exitExploreMode();
                }
            }
        });
    }

    function init() {
        setupEventListeners();
        initSpaceScene();
        setLanguage('ar');
        onWindowScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
