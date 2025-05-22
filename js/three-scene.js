// Three.js Scene Implementation
let scene, camera, renderer, model;
let controls;

function init() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 8);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    document.querySelector('.hero-section').appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add point lights for better illumination
    const pointLight1 = new THREE.PointLight(0x1E3A8A, 1, 100);
    pointLight1.position.set(-5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x166534, 1, 100);
    pointLight2.position.set(5, 5, -5);
    scene.add(pointLight2);
    
    // Create a more detailed RV model
    createRVModel();
    
    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1E3A8A,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add animation
    animate();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Add mouse interaction
    document.addEventListener('mousemove', onMouseMove);
}

function createRVModel() {
    // Create RV body
    const bodyGeometry = new THREE.BoxGeometry(3, 1.5, 6);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1E3A8A,
        shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    scene.add(body);
    
    // Create RV roof
    const roofGeometry = new THREE.BoxGeometry(2.5, 0.5, 4);
    const roofMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x166534,
        shininess: 100
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1;
    roof.position.z = -0.5;
    roof.castShadow = true;
    scene.add(roof);
    
    // Create wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32);
    const wheelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x333333,
        shininess: 30
    });
    
    const wheelPositions = [
        { x: -1.5, y: -0.4, z: 1.5 },
        { x: 1.5, y: -0.4, z: 1.5 },
        { x: -1.5, y: -0.4, z: -1.5 },
        { x: 1.5, y: -0.4, z: -1.5 }
    ];
    
    wheelPositions.forEach(pos => {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.position.set(pos.x, pos.y, pos.z);
        wheel.rotation.z = Math.PI / 2;
        wheel.castShadow = true;
        scene.add(wheel);
    });
    
    model = body; // Set the main model for rotation
}

function animate() {
    requestAnimationFrame(animate);
    
    // Smooth rotation based on mouse position
    if (model) {
        model.rotation.y += 0.005;
    }
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    if (model) {
        model.rotation.y = mouseX * 0.5;
        model.rotation.x = mouseY * 0.2;
    }
}

// Initialize the scene when the page loads
window.addEventListener('load', init); 