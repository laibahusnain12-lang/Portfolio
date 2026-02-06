const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

const counters = document.querySelectorAll('.count');
if (counters.length) {
  const countObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        if (prefersReducedMotion) {
          el.textContent = target;
          obs.unobserve(el);
          return;
        }
        if (el.dataset.counted === 'true') return;
        el.dataset.counted = 'true';
        const duration = 1200;
        const startTime = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const value = Math.floor(progress * target);
          el.textContent = value;
          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target;
            obs.unobserve(el);
          }
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => countObserver.observe(el));
}

const hero = document.querySelector('.hero');
if (hero && !prefersReducedMotion && !window.matchMedia('(pointer: coarse)').matches) {
  let rafId = null;
  const onMove = (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      hero.style.setProperty('--px', `${x * 18}px`);
      hero.style.setProperty('--py', `${y * 18}px`);
    });
  };
  hero.addEventListener('mousemove', onMove);
  hero.addEventListener('mouseleave', () => {
    hero.style.setProperty('--px', '0px');
    hero.style.setProperty('--py', '0px');
  });
}

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
