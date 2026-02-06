const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((el) => observer.observe(el));

const canvas = document.getElementById('heroCanvas');
if (canvas && window.THREE) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 6);

  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);
  const point = new THREE.PointLight(0xbca37a, 1.2, 20);
  point.position.set(4, 4, 6);
  scene.add(point);

  const geometry = new THREE.TorusKnotGeometry(1.3, 0.45, 140, 18);
  const material = new THREE.MeshStandardMaterial({
    color: 0xbca37a,
    metalness: 0.65,
    roughness: 0.25,
    emissive: 0x2b0a44,
    emissiveIntensity: 0.35
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const resize = () => {
    const { clientWidth, clientHeight } = canvas.parentElement;
    renderer.setSize(clientWidth, clientHeight, false);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  };

  window.addEventListener('resize', resize);
  resize();

  const animate = () => {
    mesh.rotation.x += 0.003;
    mesh.rotation.y += 0.004;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();
}
