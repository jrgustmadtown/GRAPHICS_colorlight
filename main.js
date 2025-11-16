import * as THREE from './libs/CS559-Three/build/three.module.js';
import { CriticalPointSystem, CP_COLORS } from './critical-point-system.js';

// Scene setup
let scene, camera, renderer, controls;
let meshes = [];
let animationId;

// Animation parameters
let lightIntensity = 1;

// Critical Point System
let criticalPointSystem;

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

    // Initialize Critical Point System
    criticalPointSystem = new CriticalPointSystem(scene);

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
    // Very dim ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.05);
    scene.add(ambientLight);

    // Much dimmer directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Store reference for updates
    window.directionalLight = directionalLight;
}

// Create a wireframe cone helper to visualize spotlight dimensions
function createLightConeHelper(spotlight, color) {
    const distance = spotlight.distance || 15;
    const angle = spotlight.angle;
    const radius = Math.tan(angle) * distance;
    
    // Create a group to hold all helper elements
    const helperGroup = new THREE.Group();
    
    // Get light and target positions
    const lightPos = spotlight.position.clone();
    const targetPos = spotlight.target.position.clone();
    
    // Add a direct line from light to target for clarity
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        lightPos,
        targetPos
    ]);
    const lineMaterial = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.7
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    helperGroup.add(line);
    
    // Add a small sphere at the light position
    const lightMarkerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const lightMarkerMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
    });
    const lightMarker = new THREE.Mesh(lightMarkerGeometry, lightMarkerMaterial);
    lightMarker.position.copy(lightPos);
    helperGroup.add(lightMarker);
    
    // Store reference to the spotlight for potential updates
    helperGroup.userData.spotlight = spotlight;
    
    return helperGroup;
}

// Create 3D objects
function createObjects() {
    // Create an enclosed room with walls
    const roomSize = 100;
    const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x222222, side: THREE.DoubleSide });

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), wallMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Ceiling 
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, roomSize), wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 20;
    scene.add(ceiling);

    // Back wall (much taller - height 20)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, 20), wallMaterial);
    backWall.position.set(0, 10, -roomSize/2);
    scene.add(backWall);

    // Front wall (much taller - height 20)
    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, 20), wallMaterial);
    frontWall.position.set(0, 10, roomSize/2);
    scene.add(frontWall);

    // Left wall (much taller - height 20)
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, 20), wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomSize/2, 10, 0);
    scene.add(leftWall);

    // Right wall (much taller - height 20)
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomSize, 20), wallMaterial);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomSize/2, 10, 0);
    scene.add(rightWall);

    // EXAMPLE: Add test objects with critical points
    const testCube = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshLambertMaterial({ color: 0x4488ff })
    );
    testCube.position.set(3, 1, 3);
    testCube.castShadow = true;
    scene.add(testCube);
    meshes.push(testCube);

    // Add critical points to the test cube
    criticalPointSystem.addCriticalPoints(testCube, 4, CP_COLORS.WHITE);

     // EXAMPLE: Add test objects with critical points
    const testCube2 = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshLambertMaterial({ color: 0x4488ff })
    );
    testCube2.position.set(0, 1, 0);
    testCube2.castShadow = true;
    scene.add(testCube2);
    meshes.push(testCube2);

    // Add critical points to the test cube
    criticalPointSystem.addCriticalPoints(testCube2, 4, CP_COLORS.WHITE);

    // EXAMPLE: Add sphere with different colored CPs
    const testSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32),
        new THREE.MeshLambertMaterial({ color: 0x44ff88 })
    );
    testSphere.position.set(-3, 1, -3);
    testSphere.castShadow = true;
    scene.add(testSphere);
    meshes.push(testSphere);

    // Add critical points to the sphere
    criticalPointSystem.addCriticalPoints(testSphere, 3, CP_COLORS.WHITE);

    // EXAMPLE: Add extremely bright laser-like spotlight beams that can destroy CPs
    const redLight = new THREE.SpotLight(0xff0000, 100, 15, Math.PI / 12, 0.1);
    redLight.position.set(-1, 4, 0);
    redLight.target.position.set(0, 1, 0);
    redLight.castShadow = true;
    scene.add(redLight);
    scene.add(redLight.target);
    criticalPointSystem.addColoredLight(redLight, 0xff0000, 3.0); // Increased range

    // Add visual wireframe cone for red light
    const redLightHelper = createLightConeHelper(redLight, 0xff0000);
    scene.add(redLightHelper);

    const blueLight = new THREE.SpotLight(0x0099ff, 100, 15, Math.PI / 12, 0.1);
    blueLight.position.set(1, 4, 0);
    blueLight.target.position.set(0, 1, 0);
    blueLight.castShadow = true;
    scene.add(blueLight);
    scene.add(blueLight.target);
    criticalPointSystem.addColoredLight(blueLight, 0x0099ff, 3.0); // Increased range

    // Add visual wireframe cone for blue light
    const blueLightHelper = createLightConeHelper(blueLight, 0x0099ff);
    scene.add(blueLightHelper);

    // Store light helpers for potential updates
    window.redLightHelper = redLightHelper;
    window.blueLightHelper = blueLightHelper;
}



// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);

    // Update critical points (pulsing glow effect and light interactions)
    if (criticalPointSystem) {
        criticalPointSystem.updateCriticalPoints();
    }

    // Animation code for your objects goes here
    // const time = Date.now() * 0.001;

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
