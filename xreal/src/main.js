import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { StereoEffect } from "three/addons/effects/StereoEffect.js";
import { buildGraph } from "./graph.js";
import { speak, setVoiceEnabled, voiceEnabled } from "./voice.js";

const app = document.getElementById("app");
const panel = document.getElementById("panel");
const meta = document.getElementById("meta");

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070910);
scene.fog = new THREE.FogExp2(0x070910, 0.012);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 4, 34);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotateSpeed = 0.6;

scene.add(new THREE.AmbientLight(0xffffff, 0.55));
const key = new THREE.PointLight(0xffe0a0, 1.2, 0, 1.5); key.position.set(20, 30, 20); scene.add(key);
const rim = new THREE.PointLight(0x7df9ff, 0.5, 0, 1.5); rim.position.set(-25, -10, -15); scene.add(rim);

const stereo = new StereoEffect(renderer);
stereo.setSize(window.innerWidth, window.innerHeight);
stereo.setEyeSeparation(0.05);
let stereoOn = false;

let graphApi = null;
let selected = null;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

async function load() {
  const [graph, labels] = await Promise.all([
    fetch("graph.json").then((r) => r.json()),
    fetch("labels.json").then((r) => r.json()).catch(() => ({})),
  ]);
  graphApi = buildGraph(graph, labels);
  scene.add(graphApi.group);
  const communities = new Set(graph.nodes.map((n) => n.community ?? 0)).size;
  meta.textContent = `${graph.nodes.length} notes · ${graph.links.length} links · ${communities} communities`;
}

function showPanel(mesh) {
  const u = mesh.userData;
  const nb = (graphApi.neighbours.get(u.id) ?? []).slice(0, 8)
    .map((id) => graphApi.byId.get(id)?.userData.label).filter(Boolean);
  panel.style.display = "block";
  panel.innerHTML =
    `<h2>${u.label}</h2>` +
    `<div class="src">${u.source || u.id}</div>` +
    `<div class="links"><b>${u.communityLabel}</b> · degree ${u.degree}</div>` +
    (nb.length ? `<div class="links" style="margin-top:8px">Linked to:<br>• ${nb.join("<br>• ")}</div>` : "");
  if (voiceEnabled()) {
    speak(`${u.label}. ${u.communityLabel}. Connected to ${nb.length} notes.`);
  }
}

function onClick(ev) {
  if (!graphApi) return;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(graphApi.pickables, false);
  if (selected) selected.material.emissiveIntensity = 0.35;
  if (hits.length) {
    selected = hits[0].object;
    selected.material.emissiveIntensity = 1.2;
    showPanel(selected);
  } else {
    panel.style.display = "none";
  }
}
renderer.domElement.addEventListener("click", onClick);

// Controls bar
const btnStereo = document.getElementById("btn-stereo");
const btnNarrate = document.getElementById("btn-narrate");
const btnSpin = document.getElementById("btn-spin");
const btnXr = document.getElementById("btn-xr");

btnStereo.onclick = () => { stereoOn = !stereoOn; btnStereo.classList.toggle("on", stereoOn); };
btnNarrate.onclick = () => { const v = !voiceEnabled(); setVoiceEnabled(v); btnNarrate.classList.toggle("on", v); };
btnSpin.onclick = () => { controls.autoRotate = !controls.autoRotate; btnSpin.classList.toggle("on", controls.autoRotate); };

(async () => {
  if (navigator.xr && (await navigator.xr.isSessionSupported?.("immersive-vr").catch(() => false))) {
    btnXr.onclick = async () => {
      const session = await navigator.xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor"] });
      renderer.xr.setSession(session);
    };
  } else {
    btnXr.textContent = "XR n/a";
    btnXr.style.opacity = 0.5;
    btnXr.title = "WebXR immersive not supported on this device — use SBS 3D for XREAL";
  }
})();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  stereo.setSize(window.innerWidth, window.innerHeight);
});

renderer.setAnimationLoop(() => {
  controls.update();
  if (renderer.xr.isPresenting) renderer.render(scene, camera);
  else if (stereoOn) stereo.render(scene, camera);
  else renderer.render(scene, camera);
});

load().catch((e) => { meta.textContent = "ERROR: " + e.message; });
