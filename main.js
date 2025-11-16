import * as THREE from './libs/CS559-Three/build/three.module.js';

// Scene setup
let scene, camera, renderer, controls;
let meshes = [];
let animationId;

// Animation parameters
let rotationSpeed = 1;
let lightIntensity = 1;
let colorHue = 120;

// Initialize the scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('container').appendChild(renderer.domElement);

    // Add orbit controls (simple mouse controls)
    addMouseControls();

    // Create lights
    createLights();

    // Create objects
    createObjects();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);

    // Start animation loop
    animate();
}

// Simple mouse controls for camera
function addMouseControls() {
    let mouseX = 0, mouseY = 0;
    let isMouseDown = false;
    let mouseButton = 0;

    renderer.domElement.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        mouseButton = event.button;
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    renderer.domElement.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    renderer.domElement.addEventListener('mousemove', (event) => {
        if (!isMouseDown) return;

        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;

        if (mouseButton === 0) { // Left button - rotate
            const spherical = new THREE.Spherical();
            spherical.setFromVector3(camera.position);
            spherical.theta -= deltaX * 0.01;
            spherical.phi += deltaY * 0.01;
            spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
            camera.position.setFromSpherical(spherical);
            camera.lookAt(0, 0, 0);
        }

        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    // Zoom with mouse wheel
    renderer.domElement.addEventListener('wheel', (event) => {
        const distance = camera.position.length();
        const newDistance = distance + event.deltaY * 0.01;
        camera.position.normalize().multiplyScalar(Math.max(2, Math.min(20, newDistance)));
    });
}

// Create lighting
function createLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, lightIntensity);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Store reference for updates
    window.directionalLight = directionalLight;
}

// Create 3D objects
function createObjects() {
    // Add a simple plane
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to lay flat
    plane.receiveShadow = true;
    scene.add(plane);
}



// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);

    // Animation code for your objects goes here
    // const time = Date.now() * 0.001 * rotationSpeed;

    // Render the scene
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the application
init();

// Export for debugging (optional)
window.scene = scene;
window.camera = camera;
window.renderer = renderer;
