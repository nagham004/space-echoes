/**
 * Space Echoes - Fullscreen 3D Universe Experience
 * Powered by Three.js (r128)
 */

// ----------------------------------------------------------------------------
// Visual Lighting & Tone Mapping Configuration (Easy Tuning)
// ----------------------------------------------------------------------------
const AMBIENT_LIGHT_INTENSITY = 0.3;
const SUN_LIGHT_INTENSITY = 0.9;
const FILL_LIGHT_INTENSITY = 0.2;
const TONE_MAPPING_EXPOSURE = 0.85;

// ----------------------------------------------------------------------------
// 3D Artifact Surface Markers & Artifact Showcase Settings
// ----------------------------------------------------------------------------
const MOON_SURFACE_SCALE_RATIO = 0.048; // Height ~4.8% of planet diameter (2.0 * 0.048 = 0.096)
const MARS_SURFACE_SCALE_RATIO = 0.048; // Height ~4.8% of planet diameter (2.0 * 0.048 = 0.096)

// Showcase tunables - all sizes are fractions of the screen, so they adapt to any viewport.
// Step 1: tap on a marker, the camera flies to it
const FOCUS_CAMERA_SECONDS = 0.8;   // camera fly-in / fly-out duration
const FOCUS_ELEVATION_DEG = 32;     // camera height over the surface (three-quarter view)
const FOCUS_MODEL_FILL = 0.60;      // model height / screen height
const FOCUS_FREE_FILL_MAX = 0.9;    // ...and never more than this share of the free area
// Step 2: "Discover the story"
const STORY_MOVE_SECONDS = 0.9;     // model floats to the right
const STORY_ASTRONAUT_SECONDS = 1.0;// astronaut enters / exits
const STORY_MODEL_X = 0.80;         // model centre (share of screen width)
const STORY_MODEL_FILL = 0.40;      // model height / screen height
const STORY_ASTRONAUT_X = 0.50;     // astronaut centre (share of screen width)
const STORY_ASTRONAUT_HEIGHT = 0.55;// astronaut height / screen height
const STORY_ASTRONAUT_TURN = 0.3;   // astronaut yaw in radians (towards the text)
const STORY_OVERLAY_DISTANCE = 2.4; // distance of the floating objects from the camera
const STORY_FLOAT_AMPLITUDE = 0.02; // bob height as a share of the screen height
// Step 3: story text pages
const STORY_MAX_CHARS = 300;        // longest text page (longer paragraphs split at sentences)
const STORY_MAX_ITEMS = 4;          // facts / timeline events / numbers per page

// Model orientation offsets, scaling, and default 3/4 viewing angles
const MODEL_CONFIGS = {
    apollo_lm: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scaleFactor: 1.0,
        initRotX: 0.20,
        initRotY: -0.45
    },
    lrv: {
        rotX: -Math.PI / 2, // Z was UP in original trimesh vehicle model
        rotY: 0,
        rotZ: 0,
        scaleFactor: 1.0,
        initRotX: 0.25,
        initRotY: -0.60
    },
    spirit: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scaleFactor: 1.0,
        initRotX: 0.22,
        initRotY: -0.45
    },
    opportunity: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scaleFactor: 1.0,
        initRotX: 0.22,
        initRotY: -0.45
    },
    ingenuity: {
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scaleFactor: 1.0,
        initRotX: 0.20,
        initRotY: -0.35
    }
};

const SCALE_NOTE_TEXT = {
    ar: 'الحجم مكبّر للتوضيح',
    en: 'Scale exaggerated for clarity'
};

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
    let hoveredPlanet = null;
    let astronautGroup;

    // Artifact showcase state
    let showStage = 'off';        // 'off' | 'focus' | 'story' | 'closing'
    let showMarker = null;        // the clicked marker (group, scale, template info)
    let showToken = 0;            // invalidates an open that is still loading
    let showCamBlend = 0;         // 0 = overview camera, 1 = focused on the marker
    let showStoryBlend = 0;       // 0 = model on the surface, 1 = floating at the right
    let showAstronautBlend = 0;   // 0 = astronaut away, 1 = floating in the middle
    let showScene = null;         // overlay pass: floating model, astronaut, their lights
    let showPivot = null;
    let showKeyLight = null;
    let showFillLight = null;
    let showAmbientLight = null;
    let showLastTime = 0;
    let resizeTimer = 0;
    const showBasePos = new THREE.Vector3();
    const showViewOffset = { x: 0, y: 0 }; // current camera view shift in px
    let storyPages = [];
    let storyPageIndex = 0;
    let storyTimer = 0;
    let storyBusy = false;
    let astronautBaseHeight = 1.04;
    let lastClientX = 0, lastClientY = 0;

    // Model Template Cache
    const modelTemplateCache = {};
    const modelLoadingPromises = {};
    const markersBuiltStatus = { Moon: false, Mars: false };

    // Smooth Lerp Targets
    const targets = {
        moonPos: new THREE.Vector3(-0.7, -0.15, 0.5),
        moonScale: 1.3,
        marsPos: new THREE.Vector3(1.6, 0.8, -2.0),
        marsScale: 0.88,
        cameraPos: new THREE.Vector3(0, 0, 4.4),
        moonGlow: 0.0,
        marsGlow: 0.0,
        astronautPos: new THREE.Vector3(1.10, 0.0, 0.6),
        astronautScale: 1.0,
        astronautRotY: -0.35
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
    const ASTRONAUT_MODEL_PATH = 'assets/models/astronaut.glb';

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
        btnBackToOverview: document.getElementById('btn-back-to-overview'),
        artifactDrawer: document.getElementById('artifact-drawer'),
        artifactCard: document.querySelector('.artifact-card'),
        btnCloseDrawer: document.getElementById('btn-close-drawer'),
        artifactTag: document.getElementById('artifact-tag'),
        artifactTitle: document.getElementById('artifact-title'),
        artifactYear: document.getElementById('artifact-year'),
        artifactCoords: document.getElementById('artifact-coords'),
        artifactIntroBox: document.getElementById('artifact-intro-box'),
        artifactSummary: document.getElementById('artifact-summary'),
        btnDiscoverStory: document.getElementById('btn-discover-story'),
        storyPanel: document.getElementById('story-panel'),
        storyLive: document.getElementById('story-live'),
        storyTitle: document.getElementById('story-title'),
        storyScrim: document.getElementById('story-scrim'),
        btnStoryNext: document.getElementById('btn-story-next'),
        astronautCaption: document.getElementById('astronaut-caption'),
        astronautCaptionText: document.getElementById('astronaut-caption-text'),
        markerTooltip: document.getElementById('marker-tooltip'),
        a11yArtifactsNav: document.getElementById('a11y-artifacts-nav'),
        artifactScaleNote: document.getElementById('artifact-scale-note')
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

    function createAtmosphereGlowMaterial(hexColor) {
        return new THREE.ShaderMaterial({
            uniforms: {
                uColor: { value: new THREE.Color(hexColor) },
                uOpacity: { value: 0.0 }
            },
            vertexShader: [
                'varying vec3 vNormalView;',
                'void main() {',
                '    vNormalView = normalize(normalMatrix * normal);',
                '    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
                '}'
            ].join('\n'),
            fragmentShader: [
                'uniform vec3 uColor;',
                'uniform float uOpacity;',
                'varying vec3 vNormalView;',
                'void main() {',
                '    float rim = clamp(-vNormalView.z * 1.85, 0.0, 1.0);',
                '    float alpha = pow(rim, 3.0) * uOpacity;',
                '    gl_FragColor = vec4(uColor, alpha);',
                '}'
            ].join('\n'),
            transparent: true,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
    }

    /**
     * Initialize Fullscreen 3D Scene
     */
    function initSpaceScene() {
        const canvas = elements.spaceCanvas;
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0);
        renderer.autoClear = false; // two passes: planets, then the showcase overlay

        // Photorealistic ACES Filmic Tone Mapping to prevent overexposed whites
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE;

        // Configure renderer output color space for true color reproduction
        if (typeof THREE.sRGBEncoding !== 'undefined') {
            renderer.outputEncoding = THREE.sRGBEncoding;
        } else if (typeof THREE.SRGBColorSpace !== 'undefined') {
            renderer.outputColorSpace = THREE.SRGBColorSpace;
        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100);
        camera.position.set(0, 0, 4.4);
        scene.add(camera);

        // Constant, balanced planetary lighting across both overview and explore modes
        const ambientLight = new THREE.AmbientLight(0xffffff, AMBIENT_LIGHT_INTENSITY);
        scene.add(ambientLight);

        // Natural Sun directional light
        const sun = new THREE.DirectionalLight(0xffffff, SUN_LIGHT_INTENSITY);
        sun.position.set(5, 2.5, 5);
        scene.add(sun);

        // Soft celestial fill light
        const fillLight = new THREE.DirectionalLight(0xdde3f5, FILL_LIGHT_INTENSITY);
        fillLight.position.set(-4, 3, 4);
        scene.add(fillLight);

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

        // Outer Atmospheric Hover Glow (Soft feathered shader, leaves map colors natural)
        moonGlowMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1.18, 48, 48),
            createAtmosphereGlowMaterial(0x9ea0d4)
        );
        moonGlowMesh.raycast = () => {};
        moonGroup.add(moonGlowMesh);

        // Moon Landing Markers Group
        moonMarkersGroup = new THREE.Group();
        moonMarkersGroup.visible = false;
        moonGroup.add(moonMarkersGroup);

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

        // Outer Atmospheric Hover Glow (Soft feathered shader)
        marsGlowMesh = new THREE.Mesh(
            new THREE.SphereGeometry(1.18, 48, 48),
            createAtmosphereGlowMaterial(0xff5a36)
        );
        marsGlowMesh.raycast = () => {};
        marsGroup.add(marsGlowMesh);

        // Mars Landing Markers Group
        marsMarkersGroup = new THREE.Group();
        marsMarkersGroup.visible = false;
        marsGroup.add(marsMarkersGroup);

        // 3. Load Astronaut 3D Model
        loadAstronautModel();

        // 4. Overlay pass for the artifact showcase (floating model + astronaut + their lights)
        initShowScene();

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

    let gltfLoaderInstance = null;
    function getGLTFLoader() {
        if (!gltfLoaderInstance) {
            gltfLoaderInstance = new THREE.GLTFLoader();
            if (typeof THREE.DRACOLoader !== 'undefined') {
                const dracoLoader = new THREE.DRACOLoader();
                dracoLoader.setDecoderPath('assets/js/draco/');
                gltfLoaderInstance.setDRACOLoader(dracoLoader);
            }
        }
        return gltfLoaderInstance;
    }

    /**
     * Load, normalize, and cache 3D artifact models with Box3
     * surface: largest side = 1 unit, base flush at y = 0 (placed on the planet and reused by the showcase)
     * info: centre height, bounding-sphere radius and box half-sizes of that template (in its own units)
     */
    function loadModelTemplate(modelPath, artifactId) {
        if (modelTemplateCache[modelPath]) {
            return Promise.resolve(modelTemplateCache[modelPath]);
        }
        if (modelLoadingPromises[modelPath]) {
            return modelLoadingPromises[modelPath];
        }

        const loader = getGLTFLoader();
        const config = MODEL_CONFIGS[artifactId] || { rotX: 0, rotY: 0, rotZ: 0, scaleFactor: 1.0 };

        modelLoadingPromises[modelPath] = new Promise((resolve, reject) => {
            loader.load(
                modelPath,
                gltf => {
                    const rawScene = gltf.scene || (gltf.scenes && gltf.scenes[0]);
                    if (!rawScene) {
                        reject(new Error(`No scene found in ${modelPath}`));
                        return;
                    }

                    const inner = new THREE.Group();
                    inner.add(rawScene.clone(true));
                    inner.rotation.set(config.rotX || 0, config.rotY || 0, config.rotZ || 0);
                    inner.updateMatrixWorld(true);

                    const box = new THREE.Box3().setFromObject(inner);
                    const size = box.getSize(new THREE.Vector3());
                    const center = box.getCenter(new THREE.Vector3());
                    const maxDim = Math.max(size.x, size.y, size.z) || 1.0;

                    inner.position.set(-center.x, -box.min.y, -center.z); // base touching y = 0

                    const normalized = new THREE.Group(); // largest side = 1 unit
                    normalized.add(inner);
                    normalized.scale.setScalar(1.0 / maxDim);
                    const surfaceTemplate = new THREE.Group();
                    surfaceTemplate.add(normalized);

                    surfaceTemplate.traverse(child => {
                        if (child.isMesh && child.material) {
                            child.material.roughness = THREE.MathUtils.clamp(child.material.roughness || 0.45, 0.25, 0.85);
                            child.material.metalness = THREE.MathUtils.clamp(child.material.metalness || 0.15, 0.0, 0.45);
                            if (child.material.map) {
                                configureTexture(child.material.map);
                            }
                        }
                    });

                    const templates = {
                        surface: surfaceTemplate,
                        info: {
                            cy: size.y / 2 / maxDim,                  // centre height
                            radius: size.length() / 2 / maxDim,       // bounding sphere
                            hx: size.x / 2 / maxDim, hy: size.y / 2 / maxDim, hz: size.z / 2 / maxDim // half sizes of the box
                        }
                    };
                    modelTemplateCache[modelPath] = templates;
                    resolve(templates);
                },
                undefined,
                err => {
                    console.error(`Failed to load 3D artifact model: ${modelPath}`, err);
                    reject(err);
                }
            );
        });

        return modelLoadingPromises[modelPath];
    }

    /**
     * Build 3D Landing Markers on Planet Surface
     */
    function buildMarkersForBody(body, group, meshList) {
        while (group.children.length > 0) {
            group.remove(group.children[0]);
        }
        meshList.length = 0;

        const artifacts = spaceArtifacts.filter(item => {
            const loc = (item.location || item.en?.location || '').toLowerCase();
            return loc === body.toLowerCase();
        });

        artifacts.forEach((artifact, idx) => {
            let lat = 0.0, lng = 0.0;
            if (artifact.coordinates && typeof artifact.coordinates.lat === 'number') {
                lat = artifact.coordinates.lat;
                lng = artifact.coordinates.lng;
            } else {
                lat = 0.0;
                lng = 0.0;
            }

            const surfacePos = latLngToVec(lat, lng, 1.002);
            const surfaceNormal = surfacePos.clone().normalize();

            // Marker parent group placed on the surface
            const markerGroup = new THREE.Group();
            markerGroup.position.copy(surfacePos);
            markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), surfaceNormal);

            // Transparent sphere Hitbox sized slightly larger than the model (~0.075 radius) for easy targeting
            const hitboxGeo = new THREE.SphereGeometry(0.075, 16, 16);
            const hitboxMat = new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0.0,
                depthWrite: false
            });
            const hitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
            hitbox.position.copy(surfacePos);

            hitbox.userData = {
                artifact: artifact,
                index: idx,
                markerGroup: markerGroup,
                body: body
            };

            meshList.push(hitbox);
            group.add(hitbox);
            group.add(markerGroup);

            // Load and instantiate the 3D surface model
            const modelPath = artifact.model3d;
            if (modelPath) {
                loadModelTemplate(modelPath, artifact.id).then(templates => {
                    const template = templates.surface || templates;
                    const instance = template.clone(true);
                    const config = MODEL_CONFIGS[artifact.id] || { scaleFactor: 1.0 };
                    const planetDiameter = 2.0; // Planet sphere geometry radius is 1.0 -> diameter 2.0
                    const scaleRatio = (body === 'Moon') ? MOON_SURFACE_SCALE_RATIO : MARS_SURFACE_SCALE_RATIO;
                    const finalScale = planetDiameter * scaleRatio * (config.scaleFactor || 1.0);
                    instance.scale.setScalar(finalScale);
                    markerGroup.add(instance);
                    hitbox.userData.instance = instance;
                }).catch(err => {
                    console.warn(`Falling back for artifact ${artifact.id}:`, err);
                });
            }
        });

        // Separation pass: Ensure minimum clearance between markers on the planetary surface
        const MIN_MARKER_CLEARANCE = 0.16;
        for (let i = 0; i < meshList.length; i++) {
            for (let j = i + 1; j < meshList.length; j++) {
                const p1 = meshList[i].position;
                const p2 = meshList[j].position;
                const d = p1.distanceTo(p2);
                if (d < MIN_MARKER_CLEARANCE && d > 0.0001) {
                    const diff = p2.clone().sub(p1);
                    const normal = p2.clone().normalize();
                    diff.projectOnPlane(normal).normalize();
                    p2.addScaledVector(diff, MIN_MARKER_CLEARANCE - d);
                    p2.normalize().multiplyScalar(1.002);
                    if (meshList[j].userData.markerGroup) {
                        meshList[j].userData.markerGroup.position.copy(p2);
                        meshList[j].userData.markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().normalize());
                    }
                }
            }
        }

        updateA11yArtifactsNav();
    }

    function ensureMarkersBuilt(body) {
        if (markersBuiltStatus[body]) return;
        markersBuiltStatus[body] = true;
        if (body === 'Moon') {
            buildMarkersForBody('Moon', moonMarkersGroup, moonMarkerMeshes);
        } else {
            buildMarkersForBody('Mars', marsMarkersGroup, marsMarkerMeshes);
        }
    }

    /**
     * Accessible Screen-Reader Navigation for Surface Artifacts
     */
    function updateA11yArtifactsNav() {
        if (!elements.a11yArtifactsNav) return;
        elements.a11yArtifactsNav.innerHTML = '';
        const artifacts = spaceArtifacts.filter(item => {
            const loc = (item.location || item.en?.location || '').toLowerCase();
            return loc === currentBody.toLowerCase();
        });

        artifacts.forEach(artifact => {
            const langData = artifact[currentLang] || artifact.en;
            const btn = document.createElement('button');
            btn.textContent = `${langData.name || artifact.id} (${langData.location || currentBody})`;
            btn.setAttribute('aria-label', `${langData.name || artifact.id} - ${langData.year || ''}`);
            btn.addEventListener('click', () => {
                openArtifactCard(artifact);
            });
            elements.a11yArtifactsNav.appendChild(btn);
        });
    }

    /**
     * Update Floating Planet Caption Text & Theme on Hover
     */
    function updateAstronautCaption() {
        if (!elements.astronautCaption || !elements.astronautCaptionText) return;
        const strings = uiText[currentLang];

        // The quote appears ONLY when hovering over the planet that is currently in the foreground
        if (viewMode === 'explore' || planetEntrance < 0.25 || !hoveredPlanet || hoveredPlanet !== activeForeground) {
            elements.astronautCaption.classList.add('hidden-caption');
            return;
        }

        elements.astronautCaption.classList.remove('hidden-caption');

        if (activeForeground === 'Moon') {
            elements.astronautCaption.classList.add('moon-theme');
            elements.astronautCaption.classList.remove('mars-theme');
            elements.astronautCaptionText.textContent = strings.moonQuote;
        } else {
            elements.astronautCaption.classList.add('mars-theme');
            elements.astronautCaption.classList.remove('moon-theme');
            elements.astronautCaptionText.textContent = strings.marsQuote;
        }
    }

    /**
     * Load Astronaut 3D Model (GLTF with Draco compression support)
     */
    function loadAstronautModel() {
        astronautGroup = new THREE.Group();
        astronautGroup.position.copy(targets.astronautPos);
        astronautGroup.scale.set(0, 0, 0);
        astronautGroup.visible = false;
        scene.add(astronautGroup);

        if (typeof THREE.GLTFLoader === 'undefined') {
            console.warn('THREE.GLTFLoader is not available');
            return;
        }

        const loader = new THREE.GLTFLoader();

        // Configure DRACOLoader for Draco compressed meshes
        if (typeof THREE.DRACOLoader !== 'undefined') {
            const dracoLoader = new THREE.DRACOLoader();
            dracoLoader.setDecoderPath('assets/js/draco/');
            dracoLoader.setDecoderConfig({ type: 'wasm' });
            loader.setDRACOLoader(dracoLoader);
        }

        loader.load(
            ASTRONAUT_MODEL_PATH,
            gltf => {
                const model = gltf.scene || (gltf.scenes && gltf.scenes[0]);
                if (!model) return;

                // Normalize size: height calibrated to exactly 40% of the Moon's diameter
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const height = size.y || 1;
                const moonDiameter = targets.moonScale * 2; // 2.6 units
                const targetHeight = moonDiameter * 0.40;   // 1.04 units
                const normScale = targetHeight / height;
                astronautBaseHeight = targetHeight;

                model.position.x = -center.x * normScale;
                model.position.y = -center.y * normScale;
                model.position.z = -center.z * normScale;
                model.scale.set(normScale, normScale, normScale);

                model.traverse(node => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                        // Prevent astronaut mesh from intercepting raycasts or blocking planet clicks
                        node.raycast = () => {};
                        if (node.material) {
                            node.material.roughness = 0.45;
                            node.material.metalness = 0.15;
                            if (node.material.map) {
                                node.material.map.encoding = THREE.sRGBEncoding;
                            }
                        }
                    }
                });

                astronautGroup.add(model);
            },
            undefined,
            err => {
                console.error(`Failed to load astronaut 3D model from path: ${ASTRONAUT_MODEL_PATH}`, err);
            }
        );
    }

    /**
     * Update Astronaut target position (desktop: side, mobile: below)
     */
    function updateAstronautTarget(foreground) {
        const isMobile = window.innerWidth < 768;
        if (foreground === 'Moon') {
            if (isMobile) {
                targets.astronautPos.set(0.0, -1.05, 0.8);
                targets.astronautRotY = 0.0;
            } else {
                targets.astronautPos.set(1.10, 0.0, 0.6);
                targets.astronautRotY = -0.35;
            }
        } else {
            if (isMobile) {
                targets.astronautPos.set(0.0, -1.05, 0.8);
                targets.astronautRotY = 0.0;
            } else {
                targets.astronautPos.set(-1.10, 0.0, 0.6);
                targets.astronautRotY = 0.35;
            }
        }
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

        updateAstronautTarget(newForeground);
        updateAstronautCaption();
    }

    /**
     * Enter Explore Mode: Expands the planet to full screen
     */
    function enterExploreMode(body) {
        viewMode = 'explore';
        currentBody = body;
        currentSelectedMarkerIndex = 0;
        planetEntrance = 1.0;
        scrollProgress = 1.0;

        if (body === 'Moon') {
            targets.moonPos.set(0, 0, 0);
            targets.moonScale = 1.18;
            if (moonGroup) {
                moonGroup.position.set(0, 0, 0);
                moonGroup.scale.setScalar(1.18);
                moonGroup.visible = true;
            }
            moonMarkersGroup.visible = true;
            ensureMarkersBuilt('Moon');

            targets.marsPos.set(0, 0, -35);
            targets.marsScale = 0.05;
            if (marsGroup) {
                marsGroup.position.set(0, 0, -35);
                marsGroup.scale.setScalar(0.05);
                marsGroup.visible = false;
            }
            marsMarkersGroup.visible = false;
        } else {
            targets.marsPos.set(0, 0, 0);
            targets.marsScale = 1.18;
            if (marsGroup) {
                marsGroup.position.set(0, 0, 0);
                marsGroup.scale.setScalar(1.18);
                marsGroup.visible = true;
            }
            marsMarkersGroup.visible = true;
            ensureMarkersBuilt('Mars');

            targets.moonPos.set(0, 0, -35);
            targets.moonScale = 0.05;
            if (moonGroup) {
                moonGroup.position.set(0, 0, -35);
                moonGroup.scale.setScalar(0.05);
                moonGroup.visible = false;
            }
            moonMarkersGroup.visible = false;
        }

        targets.cameraPos.set(0, 0, 3.2);
        targets.moonGlow = 0.0;
        targets.marsGlow = 0.0;
        if (moonGlowMesh) moonGlowMesh.visible = false; // no halo around the planet while exploring
        if (marsGlowMesh) marsGlowMesh.visible = false;

        // UI transitions
        if (elements.heroTitleSection) {
            elements.heroTitleSection.style.display = 'none';
        }
        if (elements.btnBackToOverview) {
            elements.btnBackToOverview.classList.remove('hidden');
        }
        document.body.style.overflow = 'hidden';

        const strings = uiText[currentLang];
        elements.spaceCanvas.setAttribute('aria-label', body === 'Moon' ? strings.moonSphereAria : strings.marsSphereAria);

        updateAstronautCaption();
        elements.spaceCanvas.focus();
    }

    /**
     * Exit Explore Mode
     */
    function exitExploreMode() {
        if (showStage !== 'off') {
            closeShowcase(true);
        }
        viewMode = 'overview';
        if (moonGlowMesh) moonGlowMesh.visible = true;
        if (marsGlowMesh) marsGlowMesh.visible = true;
        moonMarkersGroup.visible = false;
        marsMarkersGroup.visible = false;
        document.body.style.overflow = '';

        swapForeground(activeForeground);
        targets.cameraPos.set(0, 0, 4.4);

        if (elements.heroTitleSection) {
            elements.heroTitleSection.style.display = '';
        }
        if (elements.btnBackToOverview) {
            elements.btnBackToOverview.classList.add('hidden');
        }
        const strings = uiText[currentLang];
        elements.spaceCanvas.setAttribute('aria-label', strings.overviewSphereAria);

        onWindowScroll();
        updateAstronautCaption();
        elements.spaceCanvas.focus();
    }

    function rotateActivePlanetToMarker(mesh) {
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
        if (viewMode === 'explore' && showStage === 'off') {
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
            }
        });

        canvas.addEventListener('pointermove', e => {
            const rect = canvas.getBoundingClientRect();
            mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            lastClientX = e.clientX;
            lastClientY = e.clientY;

            if (isDragging) {
                const deltaX = e.clientX - lastPointerPos.x;
                const deltaY = e.clientY - lastPointerPos.y;

                if (showStage === 'off' && viewMode === 'explore') {
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

        canvas.addEventListener('pointerleave', () => {
            if (viewMode === 'overview') {
                targets.moonGlow = 0.0;
                targets.marsGlow = 0.0;
                if (hoveredPlanet !== null) {
                    hoveredPlanet = null;
                    updateAstronautCaption();
                }
            }
        });

        canvas.addEventListener('wheel', e => {
            if (viewMode === 'explore') {
                e.preventDefault();
                zoom(e.deltaY * 0.002);
            }
        }, { passive: false });

        canvas.addEventListener('keydown', e => {
            if (showStage !== 'off') return;
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
                        openArtifactCard(hoveredMarker.userData.artifact, hoveredMarker);
                    } else {
                        const meshes = currentBody === 'Moon' ? moonMarkerMeshes : marsMarkerMeshes;
                        if (meshes.length > 0) {
                            const target = meshes[currentSelectedMarkerIndex] || meshes[0];
                            rotateActivePlanetToMarker(target);
                            openArtifactCard(target.userData.artifact, target);
                        }
                    }
                    return;
                } else {
                    return;
                }

                e.preventDefault();
                clampX(activeGroup);
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
        if (!camera || showStage !== 'off') return;
        raycaster.setFromCamera(mouseVector, camera);

        if (viewMode === 'overview') {
            if (planetEntrance < 0.6) {
                targets.moonGlow = 0.0;
                targets.marsGlow = 0.0;
                elements.spaceCanvas.style.cursor = 'default';
                if (hoveredPlanet !== null) {
                    hoveredPlanet = null;
                    updateAstronautCaption();
                }
                return;
            }

            const intersects = raycaster.intersectObjects([moonMesh, marsMesh], false);

            if (intersects.length > 0) {
                const hit = intersects[0].object;
                elements.spaceCanvas.style.cursor = 'pointer';

                let newHovered = null;
                if (hit === moonMesh) {
                    targets.moonGlow = 1.0;
                    targets.marsGlow = 0.0;
                    newHovered = 'Moon';
                } else if (hit === marsMesh) {
                    targets.marsGlow = 1.0;
                    targets.moonGlow = 0.0;
                    newHovered = 'Mars';
                }

                if (hoveredPlanet !== newHovered) {
                    hoveredPlanet = newHovered;
                    updateAstronautCaption();
                }
            } else {
                targets.moonGlow = 0.0;
                targets.marsGlow = 0.0;
                elements.spaceCanvas.style.cursor = 'grab';

                if (hoveredPlanet !== null) {
                    hoveredPlanet = null;
                    updateAstronautCaption();
                }
            }
        } else {
            if (hoveredPlanet !== null) {
                hoveredPlanet = null;
                updateAstronautCaption();
            }
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
                        if (hoveredMarker && hoveredMarker.userData.markerGroup) {
                            hoveredMarker.userData.markerGroup.scale.set(1, 1, 1);
                        }
                        hoveredMarker = hit;
                        if (hoveredMarker.userData.markerGroup) {
                            hoveredMarker.userData.markerGroup.scale.set(1.15, 1.15, 1.15);
                        }
                    }

                    // Display name tooltip near mouse cursor
                    if (elements.markerTooltip) {
                        const artifact = hit.userData.artifact;
                        const langData = artifact[currentLang] || artifact.en;
                        elements.markerTooltip.textContent = langData.name || artifact.id;
                        elements.markerTooltip.style.left = `${lastClientX}px`;
                        elements.markerTooltip.style.top = `${lastClientY}px`;
                        elements.markerTooltip.classList.remove('hidden');
                    }
                    return;
                }
            }

            if (hoveredMarker) {
                if (hoveredMarker.userData.markerGroup) {
                    hoveredMarker.userData.markerGroup.scale.set(1, 1, 1);
                }
                hoveredMarker = null;
            }
            if (elements.markerTooltip) {
                elements.markerTooltip.classList.add('hidden');
            }
            elements.spaceCanvas.style.cursor = 'grab';
        }
    }

    /**
     * Click Raycast for Swap / Explore
     */
    function handlePointerClick() {
        if (!camera || showStage !== 'off') return;
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
                    openArtifactCard(hit.userData.artifact, hit);
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

        updateAstronautCaption();
    }

    /**
     * Animation Loop
     */
    function animateStage() {
        requestAnimationFrame(animateStage);

        const now = performance.now() / 1000;
        const dt = Math.min(0.05, now - showLastTime);
        showLastTime = now;

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
            if (moonGroup) moonGroup.visible = (currentBody === 'Moon');
            if (marsGroup) marsGroup.visible = (currentBody === 'Mars');

            moonGroup.position.lerp(targets.moonPos, 0.08);
            marsGroup.position.lerp(targets.marsPos, 0.08);
            if (showStage === 'off') camera.position.lerp(targets.cameraPos, 0.08);

            const currentMoonScale = moonGroup.scale.x + (targets.moonScale - moonGroup.scale.x) * 0.08;
            moonGroup.scale.set(currentMoonScale, currentMoonScale, currentMoonScale);

            const currentMarsScale = marsGroup.scale.x + (targets.marsScale - marsGroup.scale.x) * 0.08;
            marsGroup.scale.set(currentMarsScale, currentMarsScale, currentMarsScale);
        }

        // 2. Atmospheric Outer Glow Shell Opacity Lerping (Surface texture remains natural)
        if (moonGlowMesh) {
            const u = moonGlowMesh.material.uniforms.uOpacity;
            u.value += (targets.moonGlow * 0.65 - u.value) * 0.1;
        }

        if (marsGlowMesh) {
            const u = marsGlowMesh.material.uniforms.uOpacity;
            u.value += (targets.marsGlow * 0.65 - u.value) * 0.1;
        }

        // 3. Natural Planetary Rotation
        if (autoRotate && !isDragging && showStage === 'off') {
            if (viewMode === 'overview') {
                moonGroup.rotation.y += 0.002;
                marsGroup.rotation.y += 0.0022;
            } else {
                const activeGroup = currentBody === 'Moon' ? moonGroup : marsGroup;
                activeGroup.rotation.y += 0.002;
            }
        }

        // 4. Artifact showcase: camera flight, floating model, narrator astronaut
        if (showStage !== 'off') updateShowcase(dt, now);

        // Planet material remains pure white (1.0) so natural texture colors are preserved
        if (moonMesh && moonMesh.material.color.r !== 1.0) moonMesh.material.color.setRGB(1, 1, 1);
        if (marsMesh && marsMesh.material.color.r !== 1.0) marsMesh.material.color.setRGB(1, 1, 1);

        // 5. Astronaut Zero-Gravity Floating & Dynamic Lerping (the showcase moves him itself)
        if (astronautGroup && astronautGroup.parent !== showScene) {
            const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const time = Date.now() * 0.0016;

            // Tranquil floating sine oscillations - disabled if user prefers reduced motion
            const floatY = isReducedMotion ? 0 : Math.sin(time) * 0.045;
            const floatZ = isReducedMotion ? 0 : Math.cos(time * 0.7) * 0.025;
            const tiltX  = isReducedMotion ? 0 : Math.sin(time * 0.5) * 0.035;
            const tiltZ  = isReducedMotion ? 0 : Math.cos(time * 0.7) * 0.03;
            const rotYOffset = isReducedMotion ? 0 : Math.sin(time * 0.5) * 0.04;

            const yScrollOffset = (viewMode === 'overview') ? (1 - planetEntrance) * -2.2 : 0;
            const targetX = targets.astronautPos.x;
            const targetY = targets.astronautPos.y + floatY + yScrollOffset;
            const targetZ = targets.astronautPos.z + floatZ;

            astronautGroup.position.x += (targetX - astronautGroup.position.x) * 0.055;
            astronautGroup.position.y += (targetY - astronautGroup.position.y) * 0.055;
            astronautGroup.position.z += (targetZ - astronautGroup.position.z) * 0.055;

            const targetRotY = targets.astronautRotY + rotYOffset;
            astronautGroup.rotation.y += (targetRotY - astronautGroup.rotation.y) * 0.055;
            astronautGroup.rotation.x = tiltX;
            astronautGroup.rotation.z = tiltZ;

            const targetScale = (viewMode === 'overview' ? planetEntrance : 0.0) * targets.astronautScale;
            const curScale = astronautGroup.scale.x + (targetScale - astronautGroup.scale.x) * 0.08;
            astronautGroup.scale.set(curScale, curScale, curScale);
            astronautGroup.visible = curScale > 0.01;
        }

        renderer.clear();
        renderer.render(scene, camera);
        if (showStage !== 'off') {
            renderer.clearDepth(); // the model / astronaut are never hidden by the planet
            renderer.render(showScene, camera);
        }
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

        updateAstronautTarget(activeForeground);

        if (showStage === 'story') {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(refreshShowcaseText, 150); // re-paginate for the new size
        }
    }

    // ------------------------------------------------------------------------
    // Artifact showcase
    //   1. focus : the camera flies to the tapped marker (the model stays on the surface)
    //   2. story : the model floats to the right, the astronaut enters in the middle
    //   3. text  : paged story on the left (no scrolling)
    // The model and the astronaut are drawn in a second pass (showScene) with their own lights,
    // so they are never occluded by, or lit like, the planet behind them.
    // ------------------------------------------------------------------------
    const _v1 = new THREE.Vector3();
    const _v2 = new THREE.Vector3();
    const _q1 = new THREE.Quaternion();
    const _q2 = new THREE.Quaternion();
    const _q3 = new THREE.Quaternion();
    const _e1 = new THREE.Euler();
    const _m1 = new THREE.Matrix4();
    const IDENTITY_Q = new THREE.Quaternion();
    const _dir = new THREE.Vector3();
    const AXIS_Y = new THREE.Vector3(0, 1, 0);
    const markerPose = { center: new THREE.Vector3(), quat: new THREE.Quaternion(), up: new THREE.Vector3(), unit: 1, radius: 0.05 };
    const focusGoal = { pos: new THREE.Vector3(), quat: new THREE.Quaternion(), ox: 0, oy: 0 };

    const STORY_UI_TEXT = {
        ar: { next: 'التالي', done: 'إنهاء' },
        en: { next: 'Next', done: 'Done' }
    };
    const STORY_FADE_MS = 125; // out + in = 250ms
    const MOBILE_MAX_WIDTH = 768;

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function easeInOut(t) {
        return t * t * (3 - 2 * t);
    }

    function storyLabels() {
        const strings = uiText[currentLang];
        const fallback = STORY_UI_TEXT[currentLang];
        return { next: strings.next || fallback.next, done: strings.done || fallback.done };
    }

    function initShowScene() {
        showScene = new THREE.Scene();

        showKeyLight = new THREE.DirectionalLight(0xffffff, 1.6);   // main light, top right
        showFillLight = new THREE.DirectionalLight(0xdde3f5, 0.75); // soft fill, opposite side
        showAmbientLight = new THREE.AmbientLight(0xffffff, 0.45);
        showScene.add(showKeyLight, showKeyLight.target, showFillLight, showFillLight.target, showAmbientLight);

        showPivot = new THREE.Group(); // the artifact model, pivoting around its own centre
        showPivot.visible = false;
        showScene.add(showPivot);
    }

    /** Lights stay fixed relative to the camera (top-right key, opposite fill). */
    function updateShowLights() {
        const p = camera.position;
        showKeyLight.position.copy(_v1.set(3, 4, 3).applyQuaternion(camera.quaternion).add(p));
        showKeyLight.target.position.copy(p);
        showFillLight.position.copy(_v1.set(-3, -1, 2).applyQuaternion(camera.quaternion).add(p));
        showFillLight.target.position.copy(p);
    }

    /** Screen area that is not covered by the text card (px). */
    function getFreeRect() {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const card = elements.artifactCard.getBoundingClientRect();
        if (W <= MOBILE_MAX_WIDTH) {
            const top = 72;
            return { l: 16, r: W - 16, t: top, b: Math.max(top + 80, card.top - 8) };
        }
        return { l: card.right + 24, r: W - 24, t: 24, b: H - 24 };
    }

    /** Where the astronaut and the model go while the story is told (px). */
    function getStoryLayout() {
        const W = window.innerWidth;
        const H = window.innerHeight;
        if (W <= MOBILE_MAX_WIDTH) {
            const top = 72;
            const bottom = Math.max(top + 80, elements.storyPanel.getBoundingClientRect().top - 8);
            const h = bottom - top;
            return {
                astro: { x: 0.30 * W, y: (top + bottom) / 2, h: 0.95 * h },
                model: { x: 0.72 * W, y: (top + bottom) / 2, h: 0.8 * h, w: 0.4 * W }
            };
        }
        const modelX = STORY_MODEL_X * W;
        return {
            astro: { x: STORY_ASTRONAUT_X * W, y: 0.5 * H, h: STORY_ASTRONAUT_HEIGHT * H },
            model: { x: modelX, y: 0.5 * H, h: STORY_MODEL_FILL * H, w: 1.6 * (W - modelX) }
        };
    }

    /** World position of a screen pixel at a fixed distance in front of the camera. */
    function overlayPoint(px, py, dist, out) {
        const k = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * dist / window.innerHeight;
        out.set(
            (px - window.innerWidth / 2 - showViewOffset.x) * k,
            -(py - window.innerHeight / 2 - showViewOffset.y) * k,
            -dist
        );
        return camera.localToWorld(out);
    }

    /** World units per screen pixel at a distance in front of the camera. */
    function pixelSize(dist) {
        return 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * dist / window.innerHeight;
    }

    /** Live world pose of the clicked marker model (centre, orientation, size). */
    function updateMarkerPose() {
        const m = showMarker;
        m.markerGroup.updateWorldMatrix(true, false);
        const world = m.markerGroup.matrixWorld;
        world.decompose(_v1, markerPose.quat, _v2);
        markerPose.unit = _v2.x * m.surfaceScale; // world units per template unit
        markerPose.center.set(0, m.info.cy * m.surfaceScale, 0).applyMatrix4(world);
        markerPose.radius = m.info.radius * markerPose.unit;
        markerPose.up.copy(AXIS_Y).applyQuaternion(markerPose.quat);
        return markerPose;
    }

    /**
     * Screen size of the model's bounding box, as fractions of the screen height / width, when its centre
     * is `dist` in front of the camera and `relQuat` is the model's orientation in camera space.
     */
    function projectBox(unit, info, relQuat, dist) {
        const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        for (let i = 0; i < 8; i++) {
            _v1.set((i & 1 ? 1 : -1) * info.hx, (i & 2 ? 1 : -1) * info.hy, (i & 4 ? 1 : -1) * info.hz)
                .multiplyScalar(unit).applyQuaternion(relQuat);
            const depth = dist - _v1.z;
            const x = _v1.x / (depth * tanHalf * camera.aspect);
            const y = _v1.y / (depth * tanHalf);
            minX = Math.min(minX, x); maxX = Math.max(maxX, x);
            minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        }
        return { w: (maxX - minX) / 2, h: (maxY - minY) / 2 };
    }

    /**
     * Camera pose that frames the marker model: three-quarter view from the front and slightly above,
     * the whole model filling FOCUS_MODEL_FILL of the screen height (never more than FOCUS_FREE_FILL_MAX
     * of the free area), centred in the area not covered by the text card.
     */
    function updateFocusGoal() {
        const W = window.innerWidth;
        const H = window.innerHeight;
        const pose = updateMarkerPose();
        const free = getFreeRect();
        const cfg = showMarker.config;

        const azimuth = -(cfg.initRotY !== undefined ? cfg.initRotY : -0.4);
        const elevation = THREE.MathUtils.degToRad(FOCUS_ELEVATION_DEG);
        _v1.set(Math.sin(azimuth) * Math.cos(elevation), Math.sin(elevation), Math.cos(azimuth) * Math.cos(elevation))
            .applyQuaternion(pose.quat);

        // The orientation only depends on the viewing direction; the distance is solved below
        _dir.copy(_v1);
        _m1.lookAt(_v2.copy(pose.center).add(_dir), pose.center, pose.up);
        focusGoal.quat.setFromRotationMatrix(_m1);
        _q1.copy(focusGoal.quat).invert().multiply(pose.quat); // model orientation in camera space

        const wantH = Math.min(FOCUS_MODEL_FILL, FOCUS_FREE_FILL_MAX * (free.b - free.t) / H);
        const wantW = FOCUS_FREE_FILL_MAX * (free.r - free.l) / W;
        let dist = pose.radius * 4;
        for (let i = 0; i < 4; i++) { // box size is ~1/distance: a few steps converge
            const ext = projectBox(pose.unit, showMarker.info, _q1, dist);
            dist = Math.max(pose.radius * 1.2, dist * Math.max(ext.h / wantH, ext.w / wantW));
        }

        focusGoal.pos.copy(pose.center).addScaledVector(_dir, dist);
        focusGoal.ox = (free.l + free.r) / 2 - W / 2;
        focusGoal.oy = (free.t + free.b) / 2 - H / 2;
        return focusGoal;
    }

    function applyViewOffset() {
        const W = window.innerWidth;
        const H = window.innerHeight;
        if (Math.abs(showViewOffset.x) + Math.abs(showViewOffset.y) > 0.01) {
            camera.setViewOffset(W, H, -showViewOffset.x, -showViewOffset.y, W, H);
        } else if (camera.view && camera.view.enabled) {
            camera.clearViewOffset();
        }
    }

    function updateShowcaseCamera() {
        const e = easeInOut(showCamBlend);
        const goal = updateFocusGoal();

        camera.position.lerpVectors(showBasePos, goal.pos, e);
        // Never dip inside the planet while flying
        const planet = currentBody === 'Moon' ? moonGroup : marsGroup;
        _v1.copy(camera.position).sub(planet.position);
        const minDist = planet.scale.x * 1.03;
        if (_v1.length() < minDist) {
            camera.position.copy(planet.position).add(_v1.setLength(minDist));
        }
        camera.quaternion.copy(IDENTITY_Q).slerp(goal.quat, e);

        showViewOffset.x = goal.ox * e;
        showViewOffset.y = goal.oy * e;
        applyViewOffset();
        camera.updateMatrixWorld(true);
    }

    /** The artifact model: on the surface (story 0) -> floating at the right of the screen (story 1). */
    function updateShowPivot(time) {
        if (!showPivot.visible) return;
        const pose = markerPose;
        const e = easeInOut(showStoryBlend);

        showPivot.position.copy(pose.center);
        showPivot.quaternion.copy(pose.quat);
        showPivot.scale.setScalar(pose.unit);
        if (e <= 0) return;

        const reduced = prefersReducedMotion();
        const layout = getStoryLayout().model;
        const k = pixelSize(STORY_OVERLAY_DISTANCE);
        overlayPoint(layout.x, layout.y, STORY_OVERLAY_DISTANCE, _v2);
        if (!reduced) {
            const bob = Math.sin(time * 1.4) * STORY_FLOAT_AMPLITUDE * k * window.innerHeight;
            _v2.addScaledVector(_v1.copy(AXIS_Y).applyQuaternion(camera.quaternion), bob);
        }

        const cfg = showMarker.config;
        _e1.set(cfg.initRotX !== undefined ? cfg.initRotX : 0.22, cfg.initRotY !== undefined ? cfg.initRotY : -0.4, 0);
        _q1.copy(camera.quaternion).multiply(_q2.setFromEuler(_e1));
        if (!reduced) {
            _q1.multiply(_q2.setFromAxisAngle(AXIS_Y, Math.sin(time * 0.6) * 0.2));
        }
        // Size the model by its bounding box so it fills STORY_MODEL_FILL of the height and never clips sideways
        const ext = projectBox(1, showMarker.info, _q2.copy(_q1).premultiply(_q3.copy(camera.quaternion).invert()), STORY_OVERLAY_DISTANCE);
        const storyScale = Math.min((layout.h / window.innerHeight) / ext.h, (layout.w / window.innerWidth) / ext.w);

        showPivot.position.lerp(_v2, e);
        showPivot.quaternion.slerp(_q1, e);
        showPivot.scale.setScalar(pose.unit + (storyScale - pose.unit) * e);
    }

    /** The narrator astronaut (the same model, moved into the overlay scene while the story runs). */
    function updateShowAstronaut(time) {
        const a = astronautGroup;
        if (!a || a.parent !== showScene) return;
        const e = easeInOut(showAstronautBlend);
        a.visible = e > 0.001;
        if (!a.visible) return;

        const reduced = prefersReducedMotion();
        const layout = getStoryLayout().astro;
        const k = pixelSize(STORY_OVERLAY_DISTANCE);
        overlayPoint(layout.x, layout.y, STORY_OVERLAY_DISTANCE, _v2);

        const camUp = _v1.copy(AXIS_Y).applyQuaternion(camera.quaternion);
        const bob = reduced ? 0 : Math.sin(time * 1.6) * 0.03 * layout.h * k;
        const rise = (1 - e) * -0.35 * layout.h * k; // glides in from below
        _v2.addScaledVector(camUp, bob + rise);
        a.position.copy(_v2);

        _e1.set(
            reduced ? 0 : Math.sin(time * 0.8) * 0.035,
            STORY_ASTRONAUT_TURN + (reduced ? 0 : Math.sin(time * 0.8) * 0.05),
            reduced ? 0 : Math.cos(time * 1.1) * 0.03
        );
        a.quaternion.copy(camera.quaternion).multiply(_q2.setFromEuler(_e1));
        a.scale.setScalar(Math.max(0.0001, (layout.h * k / astronautBaseHeight) * e));
    }

    function updateShowcase(dt, time) {
        const reduced = prefersReducedMotion();
        const toward = (value, target, seconds) => {
            if (reduced) return target;
            const step = dt / seconds;
            return value < target ? Math.min(target, value + step) : Math.max(target, value - step);
        };
        const open = showStage === 'focus' || showStage === 'story';
        showCamBlend = toward(showCamBlend, open ? 1 : 0, FOCUS_CAMERA_SECONDS);
        showStoryBlend = toward(showStoryBlend, showStage === 'story' ? 1 : 0, STORY_MOVE_SECONDS);
        showAstronautBlend = toward(showAstronautBlend, showStage === 'story' ? 1 : 0, STORY_ASTRONAUT_SECONDS);

        updateShowcaseCamera();
        updateShowPivot(time);
        updateShowAstronaut(time);
        updateShowLights();

        if (showStage === 'closing' && showCamBlend === 0 && showStoryBlend === 0 && showAstronautBlend === 0) {
            finalizeShowcase();
        }
    }

    function findMarker(artifact) {
        const meshes = currentBody === 'Moon' ? moonMarkerMeshes : marsMarkerMeshes;
        return meshes.find(m => m.userData.artifact === artifact) || null;
    }

    function setMarkersVisible(visible) {
        moonMarkersGroup.visible = visible && currentBody === 'Moon';
        marsMarkersGroup.visible = visible && currentBody === 'Mars';
    }

    /**
     * Tap on a marker: the camera flies to it (the model stays where it stands on the surface)
     * and the summary card appears on the left.
     */
    function openArtifactCard(artifact, marker) {
        if (showStage !== 'off') return;

        const body = artifact.location || (artifact.en && artifact.en.location) || currentBody;
        if (viewMode !== 'explore' || currentBody !== body) enterExploreMode(body);

        if (!marker) {
            marker = findMarker(artifact);
            if (marker) rotateActivePlanetToMarker(marker); // opened from the keyboard / screen-reader list
        }
        if (!marker) return;

        const token = ++showToken;
        const begin = templates => {
            if (token === showToken && showStage === 'off') beginShowcase(artifact, marker, templates);
        };
        if (artifact.model3d) {
            loadModelTemplate(artifact.model3d, artifact.id).then(begin).catch(() => begin(null));
        } else {
            begin(null);
        }
    }

    function beginShowcase(artifact, marker, templates) {
        const body = marker.userData.body;
        const config = MODEL_CONFIGS[artifact.id] || {};
        const ratio = body === 'Moon' ? MOON_SURFACE_SCALE_RATIO : MARS_SURFACE_SCALE_RATIO;

        currentArtifact = artifact;
        showMarker = {
            markerGroup: marker.userData.markerGroup,
            instance: marker.userData.instance || null,
            surfaceScale: 2.0 * ratio * (config.scaleFactor || 1.0),
            info: templates ? templates.info : { cy: 0.5, radius: 0.6, hx: 0.5, hy: 0.5, hz: 0.5 },
            config
        };
        showMarker.markerGroup.scale.setScalar(1); // drop the hover enlargement
        hoveredMarker = null;
        if (elements.markerTooltip) elements.markerTooltip.classList.add('hidden');

        // The other markers disappear; the clicked model continues in the overlay scene, in place.
        setMarkersVisible(false);
        while (showPivot.children.length > 0) showPivot.remove(showPivot.children[0]);
        if (templates) {
            const model = templates.surface.clone(true);
            model.position.set(0, -templates.info.cy, 0); // pivot = centre of the model
            showPivot.add(model);
        }
        showPivot.visible = true;
        showBasePos.copy(camera.position);
        showViewOffset.x = 0;
        showViewOffset.y = 0;

        fillIntroCard(artifact);
        elements.artifactDrawer.classList.remove('hidden');
        elements.artifactCard.classList.remove('is-off');
        elements.storyPanel.classList.add('is-off');
        showStage = 'focus';

        elements.artifactTitle.setAttribute('tabindex', '-1');
        setTimeout(() => { if (showStage === 'focus') elements.artifactTitle.focus(); }, 60);
    }

    function fillIntroCard(artifact) {
        const langData = artifact[currentLang] || artifact.en;
        const strings = uiText[currentLang];

        elements.artifactTag.textContent = langData.location || (currentBody === 'Moon' ? strings.planetMoon : strings.planetMars);
        elements.artifactTitle.textContent = langData.name || artifact.id;
        elements.artifactYear.textContent = `${strings.year}: ${langData.year || ''}`;
        if (elements.artifactScaleNote) {
            elements.artifactScaleNote.textContent = SCALE_NOTE_TEXT[currentLang];
        }

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
    }

    /** "Discover the story": the card fades, the model floats right, the astronaut enters, the text appears. */
    function startStory() {
        if (showStage !== 'focus') return;
        buildStoryPages();
        storyPageIndex = 0;
        renderStoryPage();

        showStage = 'story';
        showScene.add(astronautGroup); // same astronaut instance, drawn in the overlay pass
        astronautGroup.visible = false;
        if (astronautGroup && typeof astronautGroup.setSpeaking === 'function') {
            astronautGroup.setSpeaking(true);
        }
        elements.artifactCard.classList.add('is-off');

        const reveal = () => {
            if (showStage !== 'story') return;
            elements.storyPanel.classList.remove('is-off');
            elements.storyScrim.classList.add('is-on');
            setTimeout(() => {
                if (showStage === 'story') elements.btnStoryNext.focus({ preventScroll: true });
            }, 60);
        };
        storyTimer = setTimeout(reveal, prefersReducedMotion() ? 0 : 450);
    }

    /** Close button / Esc / last page: everything returns to how it was. */
    function closeShowcase(immediate) {
        if (showStage === 'off') return;
        if (showStage !== 'closing') {
            clearTimeout(storyTimer);
            storyBusy = false;
            showStage = 'closing';
            if (astronautGroup && typeof astronautGroup.setSpeaking === 'function') {
                astronautGroup.setSpeaking(false);
            }
            elements.artifactCard.classList.add('is-off');
            elements.storyPanel.classList.add('is-off');
            elements.storyScrim.classList.remove('is-on');
            // Other markers return now; the clicked one when its model has landed (see finalizeShowcase)
            if (showMarker && showMarker.instance) showMarker.instance.visible = false;
            setMarkersVisible(true);
        }
        if (immediate) {
            showCamBlend = 0;
            showStoryBlend = 0;
            showAstronautBlend = 0;
            finalizeShowcase();
        }
    }

    function finalizeShowcase() {
        showStage = 'off';
        showCamBlend = 0;
        showStoryBlend = 0;
        showAstronautBlend = 0;

        showPivot.visible = false;
        while (showPivot.children.length > 0) showPivot.remove(showPivot.children[0]);
        if (showMarker && showMarker.instance) showMarker.instance.visible = true;

        // Astronaut goes back to the main scene, hidden (explore mode keeps him away)
        scene.add(astronautGroup);
        astronautGroup.scale.set(0, 0, 0);
        astronautGroup.visible = false;

        camera.position.copy(showBasePos);
        camera.quaternion.copy(IDENTITY_Q);
        showViewOffset.x = 0;
        showViewOffset.y = 0;
        applyViewOffset();

        showMarker = null;
        currentArtifact = null;
        elements.artifactDrawer.classList.add('hidden');
        if (viewMode === 'explore') elements.spaceCanvas.focus();
    }

    // ------------------------------------------------------------------------
    // Story text: split into small pages that always fit the screen
    // ------------------------------------------------------------------------
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

    function splitSentences(text) {
        return text.split(/(?<=[.!?؟…])\s+/).map(s => s.trim()).filter(Boolean);
    }

    /** Group sentences into chunks of at most `maxChars`, as evenly as possible. */
    function chunkSentences(sentences, maxChars) {
        const total = sentences.join(' ').length;
        if (total <= maxChars) return [sentences];
        const target = total / Math.ceil(total / maxChars);
        const chunks = [];
        let current = [];
        let length = 0;
        sentences.forEach(sentence => {
            if (current.length > 0 && (length + sentence.length > maxChars || length >= target)) {
                chunks.push(current);
                current = [];
                length = 0;
            }
            current.push(sentence);
            length += sentence.length + 1;
        });
        if (current.length > 0) chunks.push(current);
        return chunks;
    }

    function makeNode(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function buildPageBody(page) {
        const frag = document.createDocumentFragment();
        switch (page.kind) {
            case 'facts': {
                const list = makeNode('ul', 'story-facts');
                page.atoms.forEach(item => {
                    const li = makeNode('li', 'story-fact');
                    if (item && typeof item === 'object' && item.label && item.value) {
                        li.append(makeNode('span', 'story-fact-label', item.label), makeNode('span', 'story-fact-value', item.value));
                    } else {
                        const text = typeof item === 'string' ? item : (item.text || item.label || item.value || '');
                        li.append(makeNode('span', 'story-fact-value', text));
                    }
                    list.appendChild(li);
                });
                frag.appendChild(list);
                break;
            }
            case 'timeline': {
                const list = makeNode('div', 'story-events');
                page.atoms.forEach(ev => {
                    const row = makeNode('div', 'story-event');
                    const text = makeNode('span', 'story-event-text');
                    text.append(makeNode('strong', '', ev.title || ''), document.createTextNode(ev.description ? ` ${ev.description}` : ''));
                    row.append(makeNode('span', 'story-event-date', ev.year || ''), text);
                    list.appendChild(row);
                });
                frag.appendChild(list);
                break;
            }
            case 'numbers': {
                const grid = makeNode('div', 'story-stats');
                page.atoms.forEach(st => {
                    const cell = makeNode('div', 'story-stat');
                    cell.append(makeNode('span', 'story-stat-value', st.value || ''), makeNode('span', 'story-stat-label', st.label || ''));
                    grid.appendChild(cell);
                });
                frag.appendChild(grid);
                break;
            }
            default:
                frag.appendChild(makeNode('p', 'story-text', page.atoms.join(' ')));
        }
        return frag;
    }

    function renderPageInto(root, page, index, total) {
        const labels = storyLabels();
        const strings = uiText[currentLang];
        root.querySelector('.story-kicker').textContent = `${strings.chapter} ${page.chapter + 1} / ${page.total}`;
        root.querySelector('.story-title').textContent = page.title;
        const body = root.querySelector('.story-body');
        body.replaceChildren(buildPageBody(page));
        body.style.fontSize = page.scale < 1 ? `${page.scale}em` : '';
        root.querySelector('.story-progress-text').textContent = `${index + 1} / ${total}`;
        root.querySelector('.story-progress-fill').style.width = `${((index + 1) / total) * 100}%`;
        root.querySelector('.story-next-btn').textContent = index === total - 1 ? labels.done : labels.next;
    }

    function renderStoryPage() {
        const page = storyPages[storyPageIndex];
        if (!page) return;
        renderPageInto(elements.storyPanel, page, storyPageIndex, storyPages.length);
    }

    /** Pagination is measured on an invisible copy of the panel (same CSS, same size). */
    function buildStoryPages() {
        const chapters = getArtifactChapters();
        const probe = elements.storyPanel.cloneNode(true);
        probe.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
        probe.removeAttribute('id');
        probe.setAttribute('aria-hidden', 'true');
        probe.classList.add('is-measure');
        document.body.appendChild(probe);

        const fits = page => {
            renderPageInto(probe, page, 98, 99);
            const body = probe.querySelector('.story-body');
            return body.scrollHeight <= body.clientHeight + 1 && body.scrollWidth <= body.clientWidth + 1;
        };
        const shrinkToFit = page => {
            for (const scale of [1, 0.92, 0.85, 0.78, 0.7]) {
                page.scale = scale;
                if (fits(page)) return;
            }
        };
        // Lists: at most `maxPer` items per page, fewer when they do not fit
        const addItems = (pages, base, kind, atoms) => {
            if (atoms.length === 0) return;
            const per = Math.ceil(atoms.length / Math.ceil(atoms.length / STORY_MAX_ITEMS));
            let i = 0;
            while (i < atoms.length) {
                let take = Math.min(per, atoms.length - i);
                let page = { ...base, kind, atoms: atoms.slice(i, i + take), scale: 1 };
                while (take > 1 && !fits(page)) {
                    take--;
                    page = { ...base, kind, atoms: atoms.slice(i, i + take), scale: 1 };
                }
                shrinkToFit(page);
                pages.push(page);
                i += take;
            }
        };
        // Text: one page per paragraph; long paragraphs are split at sentence boundaries
        const addText = (pages, base, paragraph) => {
            const place = chunk => {
                const page = { ...base, kind: 'text', atoms: chunk, scale: 1 };
                if (chunk.length > 1 && !fits(page)) {
                    const mid = Math.ceil(chunk.length / 2);
                    place(chunk.slice(0, mid));
                    place(chunk.slice(mid));
                    return;
                }
                shrinkToFit(page);
                pages.push(page);
            };
            chunkSentences(splitSentences(paragraph), STORY_MAX_CHARS).forEach(place);
        };
        const paragraphsOf = value => (Array.isArray(value) ? value : String(value || '').split(/\n+/))
            .map(p => String(p).trim()).filter(Boolean);

        const pages = [];
        chapters.forEach((chapter, ci) => {
            const base = { chapter: ci, total: chapters.length, title: chapter.title || '' };
            switch (chapter.type) {
                case 'facts':
                    addItems(pages, base, 'facts', chapter.items || []);
                    break;
                case 'timeline':
                    addItems(pages, base, 'timeline', chapter.events || []);
                    break;
                case 'numbers':
                    addItems(pages, base, 'numbers', chapter.stats || []);
                    paragraphsOf(chapter.paragraphs).forEach(p => addText(pages, base, p));
                    break;
                default:
                    paragraphsOf(chapter.content).forEach(p => addText(pages, base, p));
            }
        });

        probe.remove();
        storyPages = pages;
    }

    function goToStoryPage(index) {
        if (storyBusy) return;
        storyBusy = true;
        elements.storyLive.classList.add('is-fading');
        storyTimer = setTimeout(() => {
            storyPageIndex = index;
            renderStoryPage();
            elements.storyLive.classList.remove('is-fading');
            elements.storyTitle.focus({ preventScroll: true });
            storyBusy = false;
        }, STORY_FADE_MS);
    }

    function handleStoryNext() {
        if (showStage !== 'story' || storyBusy) return;
        if (storyPageIndex < storyPages.length - 1) {
            goToStoryPage(storyPageIndex + 1);
        } else {
            closeShowcase();
        }
    }

    /** Language change or window resize while the showcase is open: re-fill and re-paginate. */
    function refreshShowcaseText() {
        if (showStage !== 'focus' && showStage !== 'story') return;
        elements.btnCloseDrawer.setAttribute('aria-label', uiText[currentLang].closeStory);
        fillIntroCard(currentArtifact);
        if (showStage === 'story' && storyPages.length > 0) {
            const chapter = storyPages[storyPageIndex] ? storyPages[storyPageIndex].chapter : 0;
            buildStoryPages();
            storyPageIndex = Math.max(0, storyPages.findIndex(p => p.chapter === chapter));
            renderStoryPage();
        }
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

        if (elements.btnBackToOverview) {
            elements.btnBackToOverview.textContent = strings.backToPlanets;
        }

        if (viewMode === 'overview') {
            elements.spaceCanvas.setAttribute('aria-label', strings.overviewSphereAria);
        } else {
            elements.spaceCanvas.setAttribute('aria-label', currentBody === 'Moon' ? strings.moonSphereAria : strings.marsSphereAria);
        }

        elements.btnDiscoverStory.textContent = strings.discoverStory;
        elements.btnCloseDrawer.setAttribute('aria-label', strings.closeStory);

        if (elements.scrollPrompt && strings.scrollPrompt) {
            elements.scrollPrompt.textContent = strings.scrollPrompt;
        }

        const a11yAstronaut = document.getElementById('astronaut-a11y');
        if (a11yAstronaut) {
            a11yAstronaut.setAttribute('aria-label', lang === 'ar' ? 'رائد فضاء ناسا يطفو في الفضاء بجانب الكوكب' : 'NASA astronaut floating in space beside the planet');
        }

        if (elements.artifactScaleNote) {
            elements.artifactScaleNote.textContent = SCALE_NOTE_TEXT[lang];
        }
        updateA11yArtifactsNav();

        updateAstronautCaption();
        refreshShowcaseText();
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

        if (elements.btnBackToOverview) {
            elements.btnBackToOverview.addEventListener('click', exitExploreMode);
        }

        // Story Drawer controls
        elements.btnDiscoverStory.addEventListener('click', startStory);
        elements.btnStoryNext.addEventListener('click', handleStoryNext);
        elements.btnCloseDrawer.addEventListener('click', () => closeShowcase());

        // Accessibility: Trap focus inside modal drawer while open
        if (elements.artifactDrawer) {
            elements.artifactDrawer.addEventListener('keydown', e => {
                if (e.key === 'Tab') {
                    const focusables = Array.from(elements.artifactDrawer.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
                        .filter(n => getComputedStyle(n).visibility !== 'hidden' && n.offsetParent !== null);
                    if (focusables.length === 0) return;
                    const first = focusables[0];
                    const last = focusables[focusables.length - 1];
                    if (e.shiftKey && document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    } else if (!e.shiftKey && document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            });
        }

        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (showStage !== 'off') {
                    closeShowcase();
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

        // Optional URL query params (?artifact=lrv&lang=ar) for direct showcase & testing
        const urlParams = new URLSearchParams(window.location.search);
        const queryLang = urlParams.get('lang');
        if (queryLang === 'en' || queryLang === 'ar') {
            setLanguage(queryLang);
        }
        const queryArtifactId = urlParams.get('artifact');
        if (queryArtifactId) {
            const targetArt = spaceArtifacts.find(a => a.id === queryArtifactId);
            if (targetArt) {
                const targetBody = (targetArt.location || (targetArt.en && targetArt.en.location) || 'Moon');
                enterExploreMode(targetBody);
                openArtifactCard(targetArt);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
