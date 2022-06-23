  import gsap from 'gsap'
  import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
  import vertexShader from './shaders/vertex.glsl'
  import fragmentShader from './shaders/fragment.glsl'

  import atmosphereVertexShader from './shaders/atmosphereVertex.glsl'
  import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl'

  const canvasContainer = document.querySelector('#canvasContainer');

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer(
  {
     antialias: true,  // takes away jagged edges and makes smooth effect
     canvas: document.querySelector('canvas')

  }
    );
  // PerspectiveCamera(fieldOfView Degree, aspectRatio, nearClippingPlane - how close an object needs to be to camera to be in the scene, farClippingPlane)

  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50), 
    new THREE.ShaderMaterial({
    vertexShader,
    // vertexShader: vertexShader is equivalent
    fragmentShader,
    // works in tandem with vertexShader
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load('./globe/globe.jpeg')
      }
    }
  }));

  // create atmosphere
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5, 50, 50), 
    new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    // vertexShader: vertexShader is equivalent
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide
    // works in tandem with vertexShader
  }));

  atmosphere.scale.set(1.1, 1.1, 1.1);

  scene.add(atmosphere);

  const group = new THREE.Group();
  group.add(sphere);
  scene.add(group);

  const starGeometry = new THREE.BufferGeometry()
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
  })

  const starVertices = [];
  for (let i = 0; i < 7000; i++) {
    const x = (Math.random() - 0.5) * 5000 
    const y = (Math.random() - 0.5) * 5000 
    const z = -Math.random() * 2000
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);


  // the camera is originally inside of the sphere which is mesh so the outlines are just fully black and blends into background 
  //  (a.k.a we can't see our sphere unless we change z position of camera) 
  camera.position.z = 15; 

  const mouse = {
    x: undefined,
    y: undefined
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sphere.rotation.y += 0.003
    gsap.to(group.rotation, {
      x: -mouse.y * 0.5,
      y: mouse.x * 0.5,
      duration: 1
    })
  }
  animate();


  addEventListener('mousemove', () => {
    mouse.x = (event.clientX / innerWidth) * 2 - 1
    mouse.y = -(event.clientY / innerHeight) * 2 + 1
  })






