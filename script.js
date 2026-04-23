let scene, camera, renderer, controls, canopyGroup;

function init() {
    // Сцена
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);

    // Камера
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(7, 5, 7);

    // Рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('render-canvas').appendChild(renderer.domElement);

    // Світло
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(10, 20, 10);
    scene.add(sunLight);

    // Сітка підлоги
    const grid = new THREE.GridHelper(20, 20, 0x00ff88, 0x333333);
    scene.add(grid);

    // Контроль мишкою
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    canopyGroup = new THREE.Group();
    scene.add(canopyGroup);

    updateModel();
    animate();
}

function updateModel() {
    while(canopyGroup.children.length > 0) canopyGroup.remove(canopyGroup.children[0]);

    const w = parseFloat(document.getElementById('width-range').value);
    const l = parseFloat(document.getElementById('length-range').value);

    document.getElementById('w-text').innerText = w;
    document.getElementById('l-text').innerText = l;
    document.getElementById('area').innerText = (w * l).toFixed(1);
    document.getElementById('metal').innerText = Math.round(w * l * 8.5);

    // Дах
    const roofGeo = new THREE.BoxGeometry(w, 0.1, l);
    const roofMat = new THREE.MeshPhongMaterial({ color: 0x00ff88, transparent: true, opacity: 0.6 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.5;
    canopyGroup.add(roof);

    // Стовпи (4 шт)
    const legGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5);
    const legMat = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });

    const pos = [
        [w/2 - 0.1, 1.25, l/2 - 0.1], [-w/2 + 0.1, 1.25, l/2 - 0.1],
        [w/2 - 0.1, 1.25, -l/2 + 0.1], [-w/2 + 0.1, 1.25, -l/2 + 0.1]
    ];

    pos.forEach(p => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(p[0], p[1], p[2]);
        canopyGroup.add(leg);
    });
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function resetCamera() { controls.reset(); }

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.getElementById('width-range').addEventListener('input', updateModel);
document.getElementById('length-range').addEventListener('input', updateModel);

init();
