// @ts-nocheck -- ported from Ezadin's original vanilla Three.js room portfolio
import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { roomAssets, roomProjects } from "./roomAssets";

export type RoomTheme = "light" | "dark";
export type RoomCallbacks = {
  onLoaded: () => void;
  onFocusChange: (focused: boolean) => void;
  onThemeChange: (theme: RoomTheme) => void;
  onChooseProject: (urls: { url: string; mobileUrl: string }) => void;
};
export type RoomApi = {
  showAbout: () => void;
  showProjects: () => void;
  reset: () => void;
  dispose: () => void;
};

export function createRoom(container: HTMLElement, canvas: HTMLCanvasElement, cb: RoomCallbacks): RoomApi {
  let theme: RoomTheme = "light";
  let bookCover = null, lightSwitch = null, titleText = null, subtitleText = null, mixer = null;
  let disposed = false;
  const isMobile = window.matchMedia("(max-width: 992px)").matches;
  const clipNames = ["fan_rotation", "fan_rotation.001", "fan_rotation.002", "fan_rotation.003", "fan_rotation.004"];
  const projects = roomProjects.map((p) => ({ ...p }));

  let aboutCameraPos = { x: 0.12, y: 0.2, z: 0.55 };
  let aboutCameraRot = { x: -1.54, y: 0.13, z: 1.41 };
  let projectsCameraPos = { x: 1, y: 0.45, z: 0.01 };
  let projectsCameraRot = { x: 0.05, y: 0.05, z: 0 };
  const defaultCameraPos = { x: 1.009028643133046, y: 0.5463638814987481, z: 0.4983449671971262 };
  const defaultCamerRot = { x: -0.8313297556598935, y: 0.9383399492446749, z: 0.7240714481613063 };

  const size = () => ({ w: container.clientWidth || window.innerWidth, h: container.clientHeight || window.innerHeight });
  const scene = new THREE.Scene();
  const { w, h } = size();
  const camera = new THREE.PerspectiveCamera(75, w / h, 0.01, 1000);
  camera.position.set(defaultCameraPos.x, defaultCameraPos.y, defaultCameraPos.z);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(w, h, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableZoom = false; // keep the mouse wheel for scrolling the page
  controls.minDistance = 0.9;
  controls.maxDistance = 1.6;
  controls.minAzimuthAngle = 0.2;
  controls.maxAzimuthAngle = Math.PI * 0.78;
  controls.minPolarAngle = 0.3;
  controls.maxPolarAngle = Math.PI / 2;
  controls.update();

  // Lights (decay 0 keeps the look of the original legacy lighting)
  const point = (color, intensity, distance) => { const l = new THREE.PointLight(color, intensity, distance, 0); scene.add(l); return l; };
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6 * Math.PI);
  scene.add(ambientLight);
  const roomLight = point(0xffffff, 2.5, 10);
  roomLight.position.set(0.3, 2, 0.5);
  roomLight.castShadow = true;
  roomLight.shadow.radius = 5;
  roomLight.shadow.mapSize.set(2048, 2048);
  roomLight.shadow.camera.far = 2.5;
  roomLight.shadow.bias = -0.002;
  const fanLight1 = point(0xff0000, 30, 0.2); fanLight1.position.set(0, 0.29, -0.29);
  const fanLight2 = point(0x00ff00, 30, 0.12); fanLight2.position.set(-0.15, 0.29, -0.29);
  const fanLight3 = point(0x00ff00, 30, 0.2); fanLight3.position.set(0.21, 0.29, -0.29);
  const fanLight4 = point(0x00ff00, 30, 0.2); fanLight4.position.set(0.21, 0.19, -0.29);
  const fanLight5 = point(0x00ff00, 30, 0.05); fanLight5.position.set(0.21, 0.08, -0.29);
  const textLights = [[-0.2, 0.6, 0.24], [-0.2, 0.6, 0.42], [-0.2, 0.6, 0.01], [-0.2, 0.6, -0.14]].map((p) => {
    const l = point(0xff0000, 0, 1.1); l.position.set(p[0], p[1], p[2]); return l;
  });

  const video = document.createElement("video");
  video.src = roomAssets.screenVideo;
  video.muted = true; video.playsInline = true; video.autoplay = true; video.loop = true; video.crossOrigin = "anonymous";

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco-room/");
  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  const textureLoader = new THREE.TextureLoader();

  gltfLoader.load(roomAssets.model, (room) => {
    if (disposed) return;
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.NearestFilter;
    videoTexture.magFilter = THREE.NearestFilter;
    videoTexture.generateMipmaps = false;
    videoTexture.colorSpace = THREE.SRGBColorSpace;

    room.scene.children.forEach((child) => {
      if (child.name !== "Wall") child.castShadow = true;
      child.receiveShadow = true;
      child.children?.forEach((inner) => {
        if (inner.name !== "Book001" && inner.name !== "Switch") inner.castShadow = true;
        inner.receiveShadow = true;
      });
      if (child.name === "Stand") {
        child.children[0].material = new THREE.MeshBasicMaterial({ map: videoTexture });
        video.play().catch(() => {});
      }
      if (child.name === "CPU") {
        [2, 1].forEach((transmission, i) => {
          const m = new THREE.MeshPhysicalMaterial({ roughness: 0, color: 0x999999, ior: 2.333, transmission, opacity: 0.8, depthWrite: false, depthTest: false });
          child.children[i].material = m;
        });
      }
      if (child.name === "Book") {
        bookCover = child.children[0];
        const bookTexture = textureLoader.load(roomAssets.bookInner);
        bookTexture.flipY = false;
        bookTexture.colorSpace = THREE.SRGBColorSpace;
        child.material = new THREE.MeshStandardMaterial({ color: 0xffffff, map: bookTexture });
      }
      if (child.name === "SwitchBoard") lightSwitch = child.children[0];
    });

    scene.add(room.scene);
    mixer = new THREE.AnimationMixer(room.scene);
    clipNames.forEach((name) => {
      const clip = THREE.AnimationClip.findByName(room.animations, name);
      if (clip) mixer.clipAction(clip).play();
    });
    if (isMobile) {
      room.scene.scale.set(0.95, 0.95, 0.95);
      aboutCameraPos = { x: 0.09, y: 0.23, z: 0.51 };
      aboutCameraRot = { x: -1.57, y: 0, z: 1.57 };
      projectsCameraPos = { x: 1.1, y: 0.82, z: 0.5 };
      projectsCameraRot = { x: 0, y: 0, z: 1.55 };
      projects.forEach((p) => (p.mesh.position.z = -1.13));
      controls.maxAzimuthAngle = Math.PI * 0.75;
    }
    loadIntroText();
    cb.onLoaded();
  }, undefined, (err) => { console.error(err); cb.onLoaded(); });

  function loadIntroText() {
    const loader = new FontLoader();
    const mats = () => [new THREE.MeshPhongMaterial({ color: 0x171f27, flatShading: true }), new THREE.MeshPhongMaterial({ color: 0xffffff })];
    loader.load(roomAssets.titleFont, (font) => {
      if (disposed) return;
      titleText = new THREE.Mesh(new TextGeometry("Ezadin Badiru", { font, size: 0.08, depth: 0.01 }), mats());
      titleText.rotation.y = Math.PI * 0.5;
      titleText.position.set(-0.27, 0.55, 0.5);
      scene.add(titleText);
    });
    loader.load(roomAssets.subtitleFont, (font) => {
      if (disposed) return;
      subtitleText = new THREE.Mesh(new TextGeometry("Full-Stack & Flutter Developer / UI/UX Designer", { font, size: 0.018, depth: 0.0001 }), mats());
      subtitleText.rotation.y = Math.PI * 0.5;
      subtitleText.position.set(-0.255, 0.5, 0.5);
      scene.add(subtitleText);
    });
  }

  // Project planes on the back wall
  projects.forEach((project, i) => {
    const tex = textureLoader.load(project.image);
    tex.colorSpace = THREE.SRGBColorSpace;
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.71, 0.4), new THREE.MeshBasicMaterial({ color: 0xffffff, map: tex, transparent: true, opacity: 0 }));
    plane.name = "project";
    plane.userData = { url: project.url, mobileUrl: project.mobileUrl };
    const y = 1.1 - Math.floor(i / 3) * 0.5;
    plane.position.set(0.3 + (i % 3) * 0.8, y, -1.15);
    plane.scale.set(0, 0, 0);
    project.mesh = plane;
    project.originalY = y;
    scene.add(plane);
  });

  const setTextColor = (dark) => {
    [titleText, subtitleText].forEach((t) => {
      if (!t) return;
      if (dark) { t.material[0].color.setRGB(8, 8, 8); t.material[1].color.setRGB(5, 5, 5); }
      else { t.material[0].color.setRGB(0.0902, 0.1216, 0.153); t.material[1].color.setRGB(1, 1, 1); }
    });
  };
  function switchTheme(next: RoomTheme) {
    theme = next;
    const dark = next === "dark";
    if (lightSwitch) lightSwitch.rotation.z = dark ? Math.PI / 7 : 0;
    gsap.to(roomLight.color, dark ? { r: 0.2725, g: 0.2314, b: 0.6863 } : { r: 1, g: 1, b: 1 });
    gsap.to(ambientLight.color, dark ? { r: 0.1725, g: 0.2314, b: 0.6863 } : { r: 1, g: 1, b: 1 });
    gsap.to(roomLight, { intensity: dark ? 1.5 : 2.5 });
    gsap.to(ambientLight, { intensity: (dark ? 0.3 : 0.6) * Math.PI });
    gsap.to(fanLight5, { distance: dark ? 0.07 : 0.05 });
    setTextColor(dark);
    textLights.forEach((l) => gsap.to(l, { intensity: dark ? 0.6 : 0 }));
    cb.onThemeChange(next);
  }

  const resetBookCover = () => bookCover && gsap.to(bookCover.rotation, { x: 0, duration: 1.5 });
  function resetProjects() {
    projects.forEach((p) => {
      gsap.to(p.mesh.material, { opacity: 0, duration: 1 });
      gsap.to(p.mesh.position, { y: p.originalY, duration: 1 });
      gsap.to(p.mesh.scale, { x: 0, y: 0, z: 0, duration: 0, delay: 1 });
    });
  }
  function reset() {
    resetBookCover(); resetProjects(); cb.onFocusChange(false);
    gsap.to(camera.position, { ...defaultCameraPos, duration: 1.5 });
    gsap.to(camera.rotation, { ...defaultCamerRot, duration: 1.5 });
    gsap.delayedCall(1.5, () => (controls.enabled = true));
    if (theme !== "dark") gsap.to(roomLight, { intensity: 2.5, duration: 1.5 });
  }
  function showAbout() {
    if (!bookCover) return;
    controls.enabled = false; resetProjects();
    gsap.to(camera.position, { ...aboutCameraPos, duration: 1.5 });
    gsap.to(camera.rotation, { ...aboutCameraRot, duration: 1.5 });
    gsap.to(bookCover.rotation, { x: Math.PI, duration: 1.5, delay: 1.5 });
    if (theme !== "dark") gsap.to(roomLight, { intensity: 1, duration: 1.5 });
    gsap.delayedCall(1.5, () => cb.onFocusChange(true));
  }
  function showProjects() {
    controls.enabled = false; resetBookCover();
    gsap.to(camera.position, { ...projectsCameraPos, duration: 1.5 });
    gsap.to(camera.rotation, { ...projectsCameraRot, duration: 1.5 });
    gsap.delayedCall(1.5, () => cb.onFocusChange(true));
    projects.forEach((p, i) => {
      p.mesh.scale.set(1, 1, 1);
      gsap.to(p.mesh.material, { opacity: 1, duration: 1.5, delay: 1.5 + i * 0.1 });
      gsap.to(p.mesh.position, { y: p.originalY, duration: 1, delay: 1.5 + i * 0.1 });
    });
  }

  // Clicking objects inside the room
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  let downAt = null;
  const onDown = (e) => (downAt = { x: e.clientX, y: e.clientY });
  const onClick = (e) => {
    if (downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return; // was a drag
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(scene.children);
    const nextTheme = theme === "light" ? "dark" : "light";
    let themeToggled = false;
    for (const hit of hits) {
      const name = hit.object.name;
      if (name === "project" && hit.object.material.opacity > 0.5) {
        const { url, mobileUrl } = hit.object.userData;
        if (mobileUrl) cb.onChooseProject({ url, mobileUrl });
        else if (url) window.open(url, "_blank", "noopener");
        return;
      }
      if (name === "Book" || name === "Book001") { showAbout(); return; }
      if ((name === "SwitchBoard" || name === "Switch") && !themeToggled) { themeToggled = true; switchTheme(nextTheme); return; }
    }
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("click", onClick);

  const onResize = () => {
    const s = size();
    camera.aspect = s.w / s.h;
    camera.updateProjectionMatrix();
    renderer.setSize(s.w, s.h, false);
  };
  const ro = new ResizeObserver(onResize);
  ro.observe(container);

  // Render only while the room is on screen
  let visible = true;
  const io = new IntersectionObserver(([entry]) => (visible = entry?.isIntersecting ?? true));
  io.observe(container);
  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();
    if (!visible) return;
    mixer?.update(dt);
    renderer.render(scene, camera);
  });

  return {
    showAbout, showProjects, reset,
    dispose() {
      disposed = true;
      renderer.setAnimationLoop(null);
      ro.disconnect(); io.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("click", onClick);
      controls.dispose(); dracoLoader.dispose(); video.pause();
      renderer.dispose();
    },
  };
}
