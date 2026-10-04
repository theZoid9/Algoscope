import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/geometries/RoundedBoxGeometry.js";

const starterValues = [15, 28, 46, 63];
const methods = {
  append: {
    title: "append(value)", complexity: "O(1)", complexityLabel: "at the tail", icon: "↳",
    explanation: "Create a new node, connect the current tail to it, then move the tail reference forward.",
    code: ["<span class='token-key'>append</span>(value) {", "  <span class='token-key'>const</span> node = <span class='token-key'>new</span> <span class='token-method'>Node</span>(value);", "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.head) <span class='token-key'>this</span>.head = node;", "  <span class='token-key'>else</span> <span class='token-key'>this</span>.tail.next = node;", "  <span class='token-key'>this</span>.tail = node;", "}"], active: [1, 3, 4]
  },
  prepend: {
    title: "prepend(value)", complexity: "O(1)", complexityLabel: "at the head", icon: "↰",
    explanation: "Point the new node at the old head, then promote it to become the new first node.",
    code: ["<span class='token-key'>prepend</span>(value) {", "  <span class='token-key'>const</span> node = <span class='token-key'>new</span> <span class='token-method'>Node</span>(value);", "  node.next = <span class='token-key'>this</span>.head;", "  <span class='token-key'>this</span>.head = node;", "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.tail) <span class='token-key'>this</span>.tail = node;", "}"], active: [1, 2, 3]
  },
  insert: {
    title: "insertAfter(node, value)", complexity: "O(1)", complexityLabel: "with a node reference", icon: "⊕",
    explanation: "Keep the selected node’s old next link, connect the new node to it, then point the selected node at the newcomer.",
    code: ["<span class='token-key'>insertAfter</span>(current, value) {", "  <span class='token-key'>const</span> node = <span class='token-key'>new</span> <span class='token-method'>Node</span>(value);", "  node.next = current.next;", "  current.next = node;", "  <span class='token-key'>if</span> (<span class='token-key'>this</span>.tail === current) <span class='token-key'>this</span>.tail = node;", "}"], active: [1, 2, 3, 4]
  },
  delete: {
    title: "delete(value)", complexity: "O(n)", complexityLabel: "to find the target", icon: "⊖",
    explanation: "Walk the list until the selected target is found, then make its predecessor skip directly to the target’s next node.",
    code: ["<span class='token-key'>delete</span>(value) {", "  <span class='token-key'>let</span> previous = <span class='token-key'>null</span>, current = <span class='token-key'>this</span>.head;", "  <span class='token-key'>while</span> (current && current.value !== value) {", "    previous = current; current = current.next;", "  }", "  previous ? previous.next = current.next : <span class='token-key'>this</span>.head = current.next;", "}"], active: [1, 2, 3, 5]
  },
  find: {
    title: "find(value)", complexity: "O(n)", complexityLabel: "linear search", icon: "⌕",
    explanation: "Start at the head and follow each next pointer until you find a matching value or reach null.",
    code: ["<span class='token-key'>find</span>(value) {", "  <span class='token-key'>let</span> current = <span class='token-key'>this</span>.head;", "  <span class='token-key'>while</span> (current) {", "    <span class='token-key'>if</span> (current.value === value) <span class='token-key'>return</span> current;", "    current = current.next;", "  }", "}"], active: [1, 2, 3, 4]
  },
  reverse: {
    title: "reverse()", complexity: "O(n)", complexityLabel: "one pass", icon: "⇄",
    explanation: "Visit each node once, flipping its next pointer backward. The old head becomes the new tail.",
    code: ["<span class='token-key'>reverse</span>() {", "  <span class='token-key'>let</span> previous = <span class='token-key'>null</span>, current = <span class='token-key'>this</span>.head;", "  <span class='token-key'>while</span> (current) {", "    <span class='token-key'>const</span> next = current.next;", "    current.next = previous; previous = current; current = next;", "  }", "  [<span class='token-key'>this</span>.head, <span class='token-key'>this</span>.tail] = [previous, <span class='token-key'>this</span>.head];", "}"], active: [1, 2, 3, 4, 6]
  }
};

const doublyVariants = {
  append: {
    explanation: "A doubly linked append keeps the regular next link, then also gives the new node a prev link back to the old tail.",
    code: ["<span class='token-key'>append</span>(value) {", "  <span class='token-key'>const</span> node = <span class='token-key'>new</span> <span class='token-method'>Node</span>(value);", "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.head) <span class='token-key'>this</span>.head = <span class='token-key'>this</span>.tail = node;", "  <span class='token-key'>else</span> { node.prev = <span class='token-key'>this</span>.tail; <span class='token-key'>this</span>.tail.next = node; }", "  <span class='token-key'>this</span>.tail = node;", "}"], active: [1, 3, 4]
  },
  prepend: {
    explanation: "A doubly linked prepend connects the new node forward to the old head and updates that old head’s prev link back to the newcomer.",
    code: ["<span class='token-key'>prepend</span>(value) {", "  <span class='token-key'>const</span> node = <span class='token-key'>new</span> <span class='token-method'>Node</span>(value);", "  node.next = <span class='token-key'>this</span>.head; <span class='token-key'>if</span> (<span class='token-key'>this</span>.head) <span class='token-key'>this</span>.head.prev = node;", "  <span class='token-key'>this</span>.head = node;", "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.tail) <span class='token-key'>this</span>.tail = node;", "}"], active: [1, 2, 3]
  },
  insert: {
    explanation: "In a doubly linked list, insertion updates both directions: the new node points to its neighbors and each neighbor points back at it.",
    code: ["<span class='token-key'>insertAfter</span>(current, value) {", "  <span class='token-key'>const</span> node = <span class='token-key'>new</span> <span class='token-method'>Node</span>(value);", "  node.next = current.next; node.prev = current;", "  <span class='token-key'>if</span> (current.next) current.next.prev = node;", "  current.next = node; <span class='token-key'>if</span> (<span class='token-key'>this</span>.tail === current) <span class='token-key'>this</span>.tail = node;", "}"], active: [1, 2, 3, 4]
  },
  delete: {
    explanation: "A known node can be unlinked without searching for its predecessor: use its prev and next references to reconnect its neighbors directly.",
    code: ["<span class='token-key'>delete</span>(current) {", "  <span class='token-key'>if</span> (current.prev) current.prev.next = current.next;", "  <span class='token-key'>else</span> <span class='token-key'>this</span>.head = current.next;", "  <span class='token-key'>if</span> (current.next) current.next.prev = current.prev;", "  <span class='token-key'>else</span> <span class='token-key'>this</span>.tail = current.prev;", "  current.next = current.prev = <span class='token-key'>null</span>;", "}"], active: [1, 2, 3, 4, 5]
  },
  find: {
    explanation: "Searching by value remains linear, but a doubly linked list can choose to walk forward from head or backward from tail when that helps.",
    code: ["<span class='token-key'>find</span>(value) {", "  <span class='token-key'>let</span> current = <span class='token-key'>this</span>.head;", "  <span class='token-key'>while</span> (current) {", "    <span class='token-key'>if</span> (current.value === value) <span class='token-key'>return</span> current;", "    current = current.next;", "  }", "}"], active: [1, 2, 3, 4]
  },
  reverse: {
    explanation: "Reversal swaps each node’s next and prev references in one pass, then swaps the list’s head and tail references.",
    code: ["<span class='token-key'>reverse</span>() {", "  <span class='token-key'>let</span> current = <span class='token-key'>this</span>.head;", "  <span class='token-key'>while</span> (current) {", "    [current.next, current.prev] = [current.prev, current.next];", "    current = current.prev;", "  }", "  [<span class='token-key'>this</span>.head, <span class='token-key'>this</span>.tail] = [<span class='token-key'>this</span>.tail, <span class='token-key'>this</span>.head];", "}"], active: [1, 2, 3, 4, 6]
  }
};

function getCollectionVariant(preset, methodName) {
  const keepsPrev = listMode === "doubly";
  const prevOnHead = keepsPrev ? " <span class='token-key'>if</span> (<span class='token-key'>this</span>.head) <span class='token-key'>this</span>.head.prev = node;" : "";
  const clearHeadPrev = keepsPrev ? " <span class='token-key'>if</span> (<span class='token-key'>this</span>.head) <span class='token-key'>this</span>.head.prev = <span class='token-key'>null</span>;" : "";
  const tailLink = keepsPrev ? "node.prev = <span class='token-key'>this</span>.tail; <span class='token-key'>this</span>.tail.next = node;" : "<span class='token-key'>this</span>.tail.next = node;";
  if (preset === "stack" && methodName === "append") return {
    title: "push(value)", complexity: "O(1)", complexityLabel: "at the top", icon: "↑",
    explanation: "A stack uses the head as its top. Push prepends a node, so the newest value is always removed first.",
    code: ["<span class='token-key'>push</span>(value) {", "  <span class='token-key'>const</span> node = <span class='token-key'>new</span> <span class='token-method'>Node</span>(value);", `  node.next = <span class='token-key'>this</span>.head;${prevOnHead}`, "  <span class='token-key'>this</span>.head = node;", "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.tail) <span class='token-key'>this</span>.tail = node;", "}"], active: [1, 2, 3]
  };
  if (preset === "stack" && methodName === "delete") return {
    title: "pop()", complexity: "O(1)", complexityLabel: "at the top", icon: "↑",
    explanation: "Pop removes the current head/top, exposing the value that was pushed immediately before it.",
    code: ["<span class='token-key'>pop</span>() {", "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.head) <span class='token-key'>return</span> <span class='token-key'>null</span>;", "  <span class='token-key'>const</span> top = <span class='token-key'>this</span>.head;", `  <span class='token-key'>this</span>.head = top.next;${clearHeadPrev}`, "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.head) <span class='token-key'>this</span>.tail = <span class='token-key'>null</span>;", "  <span class='token-key'>return</span> top;", "}"], active: [1, 2, 3, 4]
  };
  if (preset === "queue" && methodName === "append") return {
    title: "enqueue(value)", complexity: "O(1)", complexityLabel: "at the rear", icon: "→",
    explanation: "A queue adds new values at its rear/tail, preserving first-in, first-out order.",
    code: ["<span class='token-key'>enqueue</span>(value) {", "  <span class='token-key'>const</span> node = <span class='token-key'>new</span> <span class='token-method'>Node</span>(value);", "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.tail) <span class='token-key'>this</span>.head = <span class='token-key'>this</span>.tail = node;", `  <span class='token-key'>else</span> { ${tailLink} }`, "  <span class='token-key'>this</span>.tail = node;", "}"], active: [1, 2, 3, 4]
  };
  if (preset === "queue" && methodName === "delete") return {
    title: "dequeue()", complexity: "O(1)", complexityLabel: "at the front", icon: "←",
    explanation: "Dequeue removes the oldest value from the front/head, which gives a queue its FIFO behavior.",
    code: ["<span class='token-key'>dequeue</span>() {", "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.head) <span class='token-key'>return</span> <span class='token-key'>null</span>;", "  <span class='token-key'>const</span> front = <span class='token-key'>this</span>.head;", `  <span class='token-key'>this</span>.head = front.next;${clearHeadPrev}`, "  <span class='token-key'>if</span> (!<span class='token-key'>this</span>.head) <span class='token-key'>this</span>.tail = <span class='token-key'>null</span>;", "  <span class='token-key'>return</span> front;", "}"], active: [1, 2, 3, 4]
  };
  return null;
}

const algorithmVariants = {
  twoPointers: {
    title: "twoPointers(target)", complexity: "O(n)", complexityLabel: "after sorting", icon: "↔",
    explanation: "Start one pointer at each end of a sorted sequence. Compare their sum with the target, then move only the pointer that can improve the result.",
    code: ["<span class='token-key'>function</span> <span class='token-method'>twoPointers</span>(values, target) {", "  <span class='token-key'>let</span> left = 0, right = values.length - 1;", "  <span class='token-key'>while</span> (left &lt; right) {", "    <span class='token-key'>const</span> sum = values[left] + values[right];", "    <span class='token-key'>if</span> (sum === target) <span class='token-key'>return</span> [left, right];", "    sum &lt; target ? left++ : right--;", "  }", "}"], active: [1, 2, 3, 4, 5]
  },
  slidingWindow: {
    title: "maxWindowSum(size)", complexity: "O(n)", complexityLabel: "one pass", icon: "▣",
    explanation: "Keep a fixed-width window over contiguous nodes. Slide one position at a time while maintaining the best sum you have seen.",
    code: ["<span class='token-key'>function</span> <span class='token-method'>maxWindowSum</span>(values, size) {", "  <span class='token-key'>let</span> best = -Infinity;", "  <span class='token-key'>for</span> (<span class='token-key'>let</span> start = 0; start + size &lt;= values.length; start++) {", "    <span class='token-key'>const</span> sum = values.slice(start, start + size).reduce((a, b) => a + b);", "    best = Math.max(best, sum);", "  }", "  <span class='token-key'>return</span> best;", "}"], active: [1, 2, 3, 4, 6]
  },
  binarySearch: {
    title: "binarySearch(target)", complexity: "O(log n)", complexityLabel: "sorted values", icon: "⌕",
    explanation: "Repeatedly inspect the midpoint of a sorted sequence, discarding the half that cannot contain the target.",
    code: ["<span class='token-key'>function</span> <span class='token-method'>binarySearch</span>(values, target) {", "  <span class='token-key'>let</span> low = 0, high = values.length - 1;", "  <span class='token-key'>while</span> (low &lt;= high) {", "    <span class='token-key'>const</span> mid = Math.floor((low + high) / 2);", "    <span class='token-key'>if</span> (values[mid] === target) <span class='token-key'>return</span> mid;", "    values[mid] &lt; target ? low = mid + 1 : high = mid - 1;", "  }", "}"], active: [1, 2, 3, 4, 5]
  }
};

let nodeSequence = 0;
let list = starterValues.map(createNodeData);
let selectedId = list[0].id;
let selectedMethod = "append";
let listMode = "singly";
let collectionMode = "list";
let algorithmMode = "none";
let algorithmState = null;
let toastTimer;
let stepMode = false;
let stepSession = null;
let scene, camera, renderer, controls, raycaster, pointer, nodeLayer, linkLayer, labelLayer, algorithmLayer;
const visualNodes = new Map();
const clickTargets = [];
const sceneElement = document.getElementById("scene");

function createNodeData(value) {
  nodeSequence += 1;
  return { id: `node-${Date.now().toString(36)}-${nodeSequence}`, value: Number(value), next: null, prev: null };
}

function makeLabel(text, color = "#dcecff", background = "transparent", fontSize = 32) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const paddingX = 24;
  context.font = `700 ${fontSize}px Manrope, Arial`;
  const width = Math.ceil(context.measureText(text).width + paddingX * 2);
  canvas.width = width;
  canvas.height = fontSize + 28;
  context.font = `700 ${fontSize}px Manrope, Arial`;
  if (background !== "transparent") {
    context.fillStyle = background;
    context.beginPath();
    if (typeof context.roundRect === "function") context.roundRect(1, 1, canvas.width - 2, canvas.height - 2, 15);
    else context.rect(1, 1, canvas.width - 2, canvas.height - 2);
    context.fill();
  }
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2 + 1);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set((canvas.width / canvas.height) * .48, .48, 1);
  return sprite;
}

function initScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0d1728, .055);
  camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(0, 4.7, 12.4);
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setAnimationLoop(renderScene);
  sceneElement.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = .07;
  controls.enablePan = false;
  controls.minDistance = 7;
  controls.maxDistance = 19;
  controls.maxPolarAngle = Math.PI * .48;
  controls.minPolarAngle = Math.PI * .18;
  controls.target.set(0, .15, 0);
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
  nodeLayer = new THREE.Group();
  linkLayer = new THREE.Group();
  labelLayer = new THREE.Group();
  algorithmLayer = new THREE.Group();
  scene.add(linkLayer, nodeLayer, labelLayer, algorithmLayer);
  const ambient = new THREE.HemisphereLight(0xbad7ff, 0x0b1627, 1.4);
  const key = new THREE.DirectionalLight(0x91fff0, 3.5);
  key.position.set(-4, 6, 7);
  const violetLight = new THREE.PointLight(0x8175ff, 18, 15, 2);
  violetLight.position.set(5, 2, 4);
  scene.add(ambient, key, violetLight);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(35, 18), new THREE.MeshBasicMaterial({ color: 0x0c192b, transparent: true, opacity: .42 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.35;
  scene.add(floor);
  window.addEventListener("resize", resizeScene);
  renderer.domElement.addEventListener("click", onSceneClick);
  resizeScene();
  rebuildScene(true);
}

function resizeScene() {
  const width = sceneElement.clientWidth;
  const height = sceneElement.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function positionFor(index, length) {
  if (collectionMode === "stack") {
    const spacing = Math.max(1.15, Math.min(1.85, 6.3 / Math.max(1, length - 1)));
    return new THREE.Vector3(0, ((length - 1) / 2 - index) * spacing, 0);
  }
  const spacing = length <= 4 ? 3.3 : Math.max(2.05, 13.6 / Math.max(1, length - 1));
  return new THREE.Vector3((index - (length - 1) / 2) * spacing, 0, 0);
}

function createVisualNode(item) {
  const group = new THREE.Group();
  const geometry = new RoundedBoxGeometry(1.74, 1.1, .58, 6, .14);
  const material = new THREE.MeshStandardMaterial({ color: 0x544ca0, metalness: .18, roughness: .3, emissive: 0x161332, emissiveIntensity: .8 });
  const box = new THREE.Mesh(geometry, material);
  box.userData.nodeId = item.id;
  group.add(box);
  const rim = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0xa198ff, transparent: true, opacity: .78 }));
  rim.scale.set(1.003, 1.003, 1.01);
  group.add(rim);
  const valueLabel = makeLabel(String(item.value), "#f8f8ff", "transparent", 37);
  valueLabel.position.set(0, .01, .35);
  group.add(valueLabel);
  const nextLabel = makeLabel("next", "#a6abc7", "transparent", 18);
  nextLabel.position.set(.47, -.28, .35);
  nextLabel.scale.multiplyScalar(.5);
  group.add(nextLabel);
  const prevLabel = makeLabel("prev", "#b6aeff", "transparent", 18);
  prevLabel.position.set(-.47, -.28, .35);
  prevLabel.scale.multiplyScalar(.5);
  prevLabel.visible = listMode === "doubly";
  group.add(prevLabel);
  group.userData = { id: item.id, box, rim, prevLabel, target: new THREE.Vector3(), created: performance.now() };
  nodeLayer.add(group);
  visualNodes.set(item.id, group);
  clickTargets.push(box);
  return group;
}

function rebuildScene(immediate = false) {
  syncPointers();
  const currentIds = new Set(list.map(item => item.id));
  [...visualNodes].forEach(([id, group]) => {
    if (currentIds.has(id)) return;
    nodeLayer.remove(group);
    visualNodes.delete(id);
    const index = clickTargets.indexOf(group.userData.box);
    if (index >= 0) clickTargets.splice(index, 1);
  });
  list.forEach((item, index) => {
    const group = visualNodes.get(item.id) || createVisualNode(item);
    const target = positionFor(index, list.length);
    group.userData.target.copy(target);
    group.userData.prevLabel.visible = listMode === "doubly";
    if (immediate) group.position.copy(target);
  });
  rebuildLinks();
  updateSelectionVisuals();
  renderAlgorithmOverlay();
  updateCopy();
}

function syncPointers() {
  list.forEach((node, index) => {
    node.next = list[index + 1]?.id || null;
    node.prev = listMode === "doubly" ? list[index - 1]?.id || null : null;
  });
}

function rebuildLinks() {
  linkLayer.clear();
  labelLayer.clear();
  const nextMaterial = new THREE.MeshStandardMaterial({ color: 0x4ee2c2, emissive: 0x1b7e72, emissiveIntensity: 1, metalness: .25, roughness: .35 });
  const prevMaterial = new THREE.MeshStandardMaterial({ color: 0x9a8cff, emissive: 0x5143ad, emissiveIntensity: 1, metalness: .25, roughness: .35 });
  for (let index = 0; index < list.length - 1; index++) {
    const from = positionFor(index, list.length);
    const to = positionFor(index + 1, list.length);
    const direction = to.clone().sub(from).normalize();
    const nodeGap = collectionMode === "stack" ? .65 : 1.03;
    const start = from.clone().addScaledVector(direction, nodeGap);
    const end = to.clone().addScaledVector(direction, -nodeGap);
    addPointer(start, end, nextMaterial, .045, .15, .35);

    if (listMode === "doubly") {
      const lane = collectionMode === "stack" ? new THREE.Vector3(0, 0, .42) : new THREE.Vector3(0, -.43, 0);
      addPointer(end.clone().add(lane), start.clone().add(lane), prevMaterial, .04, .13, .31);
    }
  }
  if (list.length) {
    const headText = collectionMode === "stack" ? "TOP" : collectionMode === "queue" ? "FRONT" : "HEAD";
    const tailText = collectionMode === "stack" ? "BASE" : collectionMode === "queue" ? "REAR" : "TAIL";
    const headOffset = collectionMode === "stack" ? new THREE.Vector3(0, 1.02, 0) : new THREE.Vector3(0, 1.15, 0);
    const tailOffset = collectionMode === "stack" ? new THREE.Vector3(0, -1.0, 0) : new THREE.Vector3(0, -1.05, 0);
    const head = makeLabel(headText, "#08231e", "#48e3c1", 20);
    head.position.copy(positionFor(0, list.length)).add(headOffset);
    labelLayer.add(head);
    const tail = makeLabel(tailText, "#c3c0ff", "#26204f", 18);
    tail.position.copy(positionFor(list.length - 1, list.length)).add(tailOffset);
    labelLayer.add(tail);
    const nullLabel = makeLabel("null", "#8391a9", "transparent", 18);
    nullLabel.position.copy(positionFor(list.length - 1, list.length)).add(collectionMode === "stack" ? new THREE.Vector3(0, -1.42, 0) : new THREE.Vector3(1.58, 0, 0));
    nullLabel.scale.multiplyScalar(.58);
    labelLayer.add(nullLabel);
    if (listMode === "doubly") {
      const previousNull = makeLabel("null", "#a69cff", "transparent", 18);
      previousNull.position.copy(positionFor(0, list.length)).add(collectionMode === "stack" ? new THREE.Vector3(0, 1.35, .42) : new THREE.Vector3(-1.58, -.43, 0));
      previousNull.scale.multiplyScalar(.58);
      labelLayer.add(previousNull);
    }
  } else {
    const empty = makeLabel("head → null", "#9ba9c0", "transparent", 28);
    empty.position.set(0, 0, 0);
    labelLayer.add(empty);
  }
}

function addPointer(start, end, material, radius, arrowRadius, arrowLength) {
  const direction = end.clone().sub(start);
  const distance = direction.length();
  if (!distance) return;
  direction.normalize();
  const axis = new THREE.Vector3(0, 1, 0);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, distance, 12), material);
  body.quaternion.setFromUnitVectors(axis, direction);
  body.position.copy(start).lerp(end, .5);
  linkLayer.add(body);
  const arrow = new THREE.Mesh(new THREE.ConeGeometry(arrowRadius, arrowLength, 14), material);
  arrow.quaternion.setFromUnitVectors(axis, direction);
  arrow.position.copy(end).addScaledVector(direction, arrowLength * .25);
  linkLayer.add(arrow);
}

function algorithmRole(index) {
  if (!algorithmState) return null;
  if (algorithmMode === "twoPointers") {
    if (algorithmState.found?.includes(index)) return "found";
    if (index === algorithmState.left) return "left";
    if (index === algorithmState.right) return "right";
  }
  if (algorithmMode === "slidingWindow") {
    if (index >= algorithmState.start && index < algorithmState.start + algorithmState.size) return "window";
  }
  if (algorithmMode === "binarySearch") {
    if (algorithmState.found === index) return "found";
    if (index === algorithmState.mid) return "mid";
    if (index === algorithmState.low) return "low";
    if (index === algorithmState.high) return "high";
  }
  return null;
}

function addAlgorithmMarker(index, text, color, background, height = 1.15) {
  if (index == null || index < 0 || index >= list.length) return;
  const marker = makeLabel(text, color, background, 17);
  marker.position.copy(positionFor(index, list.length)).add(new THREE.Vector3(0, height, .1));
  marker.scale.multiplyScalar(.72);
  algorithmLayer.add(marker);
}

function renderAlgorithmOverlay() {
  if (!algorithmLayer) return;
  algorithmLayer.clear();
  if (!algorithmState || collectionMode !== "list") return;
  if (algorithmMode === "twoPointers") {
    addAlgorithmMarker(algorithmState.left, "L", "#061a27", "#77c7ff");
    addAlgorithmMarker(algorithmState.right, "R", "#2a1504", "#f6b862");
    if (algorithmState.found) algorithmState.found.forEach(index => addAlgorithmMarker(index, "MATCH", "#07231d", "#48e3c1", 1.52));
  }
  if (algorithmMode === "slidingWindow") {
    const end = Math.min(list.length - 1, algorithmState.start + algorithmState.size - 1);
    const left = positionFor(algorithmState.start, list.length);
    const right = positionFor(end, list.length);
    const width = right.x - left.x + 1.98;
    const band = new THREE.Mesh(new THREE.BoxGeometry(Math.max(1.8, width), 1.45, .12), new THREE.MeshBasicMaterial({ color: 0xb6a7ff, transparent: true, opacity: .16, depthWrite: false }));
    band.position.copy(left).lerp(right, .5).add(new THREE.Vector3(0, 0, -.38));
    algorithmLayer.add(band);
    addAlgorithmMarker(algorithmState.start, "START", "#1e153d", "#c0b5ff");
    addAlgorithmMarker(end, "END", "#1e153d", "#c0b5ff");
    const values = list.slice(algorithmState.start, end + 1).map(node => node.value);
    const sum = values.reduce((total, value) => total + value, 0);
    const label = makeLabel(`WINDOW SUM ${sum}`, "#e6e2ff", "#332d64", 17);
    label.position.copy(left).lerp(right, .5).add(new THREE.Vector3(0, 1.55, 0));
    label.scale.multiplyScalar(.68);
    algorithmLayer.add(label);
  }
  if (algorithmMode === "binarySearch") {
    addAlgorithmMarker(algorithmState.low, "LOW", "#061a27", "#77c7ff");
    addAlgorithmMarker(algorithmState.high, "HIGH", "#2a1504", "#f6b862");
    addAlgorithmMarker(algorithmState.mid, algorithmState.found === algorithmState.mid ? "FOUND" : "MID", algorithmState.found === algorithmState.mid ? "#07231d" : "#1e153d", algorithmState.found === algorithmState.mid ? "#48e3c1" : "#c0b5ff", 1.52);
  }
}

function updateSelectionVisuals() {
  visualNodes.forEach((group, id) => {
    const index = list.findIndex(item => item.id === id);
    const role = algorithmRole(index);
    const selected = id === selectedId;
    const styles = { left: [0x236ea9, 0x0a2c45, 0x77c7ff], right: [0xb7661e, 0x4e2408, 0xf6b862], window: [0x685cae, 0x2b2853, 0xc0b5ff], low: [0x236ea9, 0x0a2c45, 0x77c7ff], high: [0xb7661e, 0x4e2408, 0xf6b862], mid: [0x685cae, 0x2b2853, 0xc0b5ff], found: [0x168e7d, 0x0a5249, 0x78ffe4] };
    const style = styles[role] || (selected ? [0x168e7d, 0x0a5249, 0x78ffe4] : [0x544ca0, 0x161332, 0xa198ff]);
    group.userData.box.material.color.set(style[0]);
    group.userData.box.material.emissive.set(style[1]);
    group.userData.rim.material.color.set(style[2]);
  });
}

function renderScene(time) {
  const seconds = time / 1000;
  visualNodes.forEach((group, id) => {
    group.position.lerp(group.userData.target, .12);
    const selected = id === selectedId;
    group.position.y = group.userData.target.y + (selected ? Math.sin(seconds * 3.4) * .09 + .07 : 0);
    group.rotation.y = selected ? Math.sin(seconds * 2.4) * .04 : 0;
  });
  controls.update();
  renderer.render(scene, camera);
}

function onSceneClick(event) {
  const bounds = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
  pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(clickTargets, false)[0];
  if (hit) selectNode(hit.object.userData.nodeId);
}

function selectNode(id) {
  selectedId = id;
  updateSelectionVisuals();
  const node = list.find(item => item.id === id);
  document.getElementById("selectionHint").textContent = node ? `Node ${node.value} is selected` : "No node selected";
}

function updateCopy() {
  const direction = listMode === "doubly" ? "⇄" : "→";
  const labels = collectionMode === "stack" ? `top ${direction} base · LIFO` : collectionMode === "queue" ? `front ${direction} rear · FIFO` : `head ${direction} tail`;
  document.getElementById("listSummary").textContent = list.length ? `${list.length} node${list.length === 1 ? "" : "s"} · ${labels}` : `Empty ${collectionMode === "stack" ? "stack" : collectionMode === "queue" ? "queue" : "list"} · null`;
  if (!list.some(item => item.id === selectedId)) selectedId = list[0]?.id || null;
  selectNode(selectedId);
}

function getMethodDisplay(name = selectedMethod) {
  if (algorithmMode !== "none") return algorithmVariants[algorithmMode];
  const structuralMethod = listMode === "doubly" ? { ...methods[name], ...doublyVariants[name] } : methods[name];
  const collectionMethod = collectionMode === "list" ? null : getCollectionVariant(collectionMode, name);
  return collectionMethod ? { ...structuralMethod, ...collectionMethod } : structuralMethod;
}

function updateStructureNote() {
  const note = document.getElementById("structureNote");
  if (algorithmMode !== "none") {
    const algorithmDetails = algorithmMode === "twoPointers" ? "The values are sorted first; L and R close in according to whether their sum is too small or too large." : algorithmMode === "slidingWindow" ? "The highlighted window stays contiguous and advances by one node each run." : "The values are sorted first; each comparison discards half of the remaining candidates.";
    note.innerHTML = `<span>✦</span><p><b>Algorithm view:</b> ${algorithmDetails}</p>`;
    return;
  }
  const behavior = collectionMode === "stack" ? " <b>Stack behavior:</b> push and pop both happen at the top, so the newest item leaves first." : collectionMode === "queue" ? " <b>Queue behavior:</b> enqueue uses the rear and dequeue uses the front, so the oldest item leaves first." : "";
  if (listMode === "doubly") {
    note.innerHTML = `<span>⇄</span><p><b>Doubly linked:</b> every node stores both <code>next</code> and <code>prev</code>. That uses one extra reference per node, but lets you move in either direction and unlink a known node without finding its predecessor.${behavior}</p>`;
  } else {
    note.innerHTML = `<span>→</span><p><b>Singly linked:</b> each node stores one <code>next</code> pointer. Moving backward requires a new traversal from the head.${behavior}</p>`;
  }
}

function updateStructureHeader() {
  const collection = collectionMode === "stack" ? "Stack · " : collectionMode === "queue" ? "Queue · " : "";
  document.getElementById("structureType").textContent = `${collection}${listMode === "doubly" ? "doubly" : "singly"} linked`;
}

function updatePresetControls() {
  const append = document.querySelector('[data-method="append"]');
  const remove = document.querySelector('[data-method="delete"]');
  const options = collectionMode === "stack"
    ? { append: ["↑", "Push", "add to top", "O(1)"], remove: ["↑", "Pop", "remove top", "O(1)"], description: "LIFO: the most recently pushed node is popped first." }
    : collectionMode === "queue"
      ? { append: ["→", "Enqueue", "add to rear", "O(1)"], remove: ["←", "Dequeue", "remove front", "O(1)"], description: "FIFO: the earliest enqueued node leaves first." }
      : { append: ["↳", "Append", "add to tail", "O(1)"], remove: ["⊖", "Delete", "selected node", "O(n)"], description: "Flexible node operations and one-way traversal." };
  [[append, options.append], [remove, options.remove]].forEach(([button, values]) => {
    button.querySelector(".method-icon").textContent = values[0];
    button.querySelector("b").textContent = values[1];
    button.querySelector("small").textContent = values[2];
    button.querySelector("code").textContent = values[3];
  });
  document.getElementById("presetDescription").textContent = options.description;
  document.querySelectorAll(".method-button").forEach(button => {
    const allowed = algorithmMode === "none" && (collectionMode === "list" || ["append", "delete"].includes(button.dataset.method));
    button.disabled = !allowed;
  });
}

function setCollectionMode(mode) {
  if (mode === collectionMode && algorithmMode === "none") return;
  if (algorithmMode !== "none") setAlgorithmMode("none");
  if (mode === collectionMode) return;
  if (stepSession) exitStepSession();
  collectionMode = mode;
  ["list", "stack", "queue"].forEach(name => {
    const button = document.getElementById(`${name}Preset`);
    const selected = name === mode;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  updatePresetControls();
  updateStructureHeader();
  updateStructureNote();
  if (collectionMode !== "list" && !["append", "delete"].includes(selectedMethod)) selectMethod("append");
  else selectMethod(selectedMethod);
  rebuildScene();
  showToast(collectionMode === "stack" ? "Stack preset enabled: push and pop at the top." : collectionMode === "queue" ? "Queue preset enabled: enqueue rear, dequeue front." : "Linked list preset restored.");
}

function updateAlgorithmControls() {
  const metadata = {
    none: ["Choose an algorithm to turn the nodes into an interactive search walkthrough.", "", ""],
    twoPointers: ["Sorted values; move L/R toward a target sum.", "Target sum", 78],
    slidingWindow: ["Slide a fixed-size, contiguous window through the nodes.", "Window size", 2],
    binarySearch: ["Sorted values; repeatedly halve the search range.", "Target value", 46]
  }[algorithmMode];
  [["noAlgorithm", "none"], ["twoPointersAlgorithm", "twoPointers"], ["windowAlgorithm", "slidingWindow"], ["binaryAlgorithm", "binarySearch"]].forEach(([id, mode]) => {
    const button = document.getElementById(id);
    const selected = mode === algorithmMode;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-selected", String(selected));
  });
  document.getElementById("algorithmDescription").textContent = metadata[0];
  const parameter = document.getElementById("algorithmParameter");
  parameter.hidden = algorithmMode === "none";
  if (algorithmMode !== "none") {
    document.getElementById("algorithmParameterLabel").textContent = metadata[1];
    document.getElementById("algorithmInput").value = metadata[2];
  }
}

function configureAlgorithm() {
  const input = document.getElementById("algorithmInput");
  const supplied = Number(input.value);
  if (algorithmMode === "twoPointers") {
    list.sort((a, b) => a.value - b.value);
    algorithmState = { left: 0, right: list.length - 1, target: Number.isFinite(supplied) ? supplied : 78, found: null, done: false };
  }
  if (algorithmMode === "slidingWindow") {
    const size = Math.max(1, Math.min(list.length || 1, Math.round(supplied) || 1));
    input.value = size;
    algorithmState = { start: 0, size, best: -Infinity, bestStart: 0, done: false };
  }
  if (algorithmMode === "binarySearch") {
    list.sort((a, b) => a.value - b.value);
    algorithmState = { low: 0, high: list.length - 1, mid: list.length ? Math.floor((list.length - 1) / 2) : null, target: Number.isFinite(supplied) ? supplied : 46, found: null, done: false };
  }
}

function setAlgorithmMode(mode) {
  if (stepSession) exitStepSession();
  if (mode === algorithmMode && mode !== "none") {
    configureAlgorithm();
    rebuildScene();
    updateRunButton();
    return;
  }
  if (mode !== "none" && collectionMode !== "list") setCollectionMode("list");
  algorithmMode = mode;
  algorithmState = null;
  updateAlgorithmControls();
  updatePresetControls();
  if (mode !== "none") {
    configureAlgorithm();
    const algorithm = getMethodDisplay();
    document.getElementById("methodTitle").textContent = algorithm.title;
    document.getElementById("methodExplanation").textContent = algorithm.explanation;
    document.getElementById("complexityValue").textContent = algorithm.complexity;
    document.getElementById("complexityLabel").textContent = algorithm.complexityLabel;
    document.getElementById("runIcon").textContent = algorithm.icon;
    renderCode(algorithm);
    updateStructureNote();
    rebuildScene();
    updateRunButton();
    showToast(`${algorithm.title} is ready to walk through.`);
  } else {
    algorithmLayer?.clear();
    selectMethod(selectedMethod);
    updateStructureNote();
    rebuildScene();
  }
}

function setListMode(mode) {
  if (mode === listMode) return;
  if (stepSession) exitStepSession();
  listMode = mode;
  const isDoubly = mode === "doubly";
  document.getElementById("singleMode").classList.toggle("active", !isDoubly);
  document.getElementById("singleMode").setAttribute("aria-selected", String(!isDoubly));
  document.getElementById("doubleMode").classList.toggle("active", isDoubly);
  document.getElementById("doubleMode").setAttribute("aria-selected", String(isDoubly));
  document.getElementById("prevLegend").hidden = !isDoubly;
  updateStructureHeader();
  const method = getMethodDisplay();
  document.getElementById("methodTitle").textContent = method.title;
  document.getElementById("methodExplanation").textContent = method.explanation;
  updateStructureNote();
  renderCode(method);
  rebuildScene();
  showToast(isDoubly ? "Doubly linked list mode: prev pointers are visible." : "Singly linked list mode: next pointers only.");
}

function selectMethod(name) {
  if (stepSession) exitStepSession();
  selectedMethod = name;
  const method = getMethodDisplay(name);
  document.querySelectorAll(".method-button").forEach(button => button.classList.toggle("active", button.dataset.method === name));
  document.getElementById("complexityValue").textContent = method.complexity;
  document.getElementById("complexityLabel").textContent = method.complexityLabel;
  document.getElementById("methodTitle").textContent = method.title;
  document.getElementById("methodExplanation").textContent = method.explanation;
  document.getElementById("runIcon").textContent = method.icon;
  renderCode(method);
  updateRunButton();
}

function renderCode(method = getMethodDisplay(), activeLines = method.active) {
  document.getElementById("codeLines").innerHTML = method.code.map((line, index) => `<div class="code-line ${activeLines.includes(index) ? "active" : ""}"><span class="code-number">${index + 1}</span><code>${line}</code></div>`).join("");
}

function updateRunButton() {
  const button = document.getElementById("runMethod");
  if (algorithmMode !== "none") {
    const algorithm = getMethodDisplay();
    const directLabel = algorithmState?.done ? "Restart walkthrough" : algorithmMode === "twoPointers" ? "Compare pointers" : algorithmMode === "slidingWindow" ? "Slide window" : "Check midpoint";
    const label = stepSession ? "Walkthrough in progress" : stepMode ? `Walk through: ${directLabel}` : directLabel;
    document.getElementById("runIcon").textContent = algorithm.icon;
    document.getElementById("runLabel").textContent = label;
    button.disabled = Boolean(stepSession);
    return;
  }
  const label = stepSession ? "Walkthrough in progress" : stepMode ? `Walk through: ${runLabel(methods[selectedMethod])}` : runLabel(methods[selectedMethod]);
  document.getElementById("runLabel").textContent = label;
  button.disabled = Boolean(stepSession);
}

function runLabel(method) {
  const value = document.getElementById("valueInput").value || "value";
  if (collectionMode === "stack") return selectedMethod === "append" ? `Push ${value}` : "Pop top node";
  if (collectionMode === "queue") return selectedMethod === "append" ? `Enqueue ${value}` : "Dequeue front node";
  if (selectedMethod === "append") return `Append ${value}`;
  if (selectedMethod === "prepend") return `Prepend ${value}`;
  if (selectedMethod === "insert") return `Insert ${value} after selected`;
  if (selectedMethod === "delete") return "Delete selected node";
  if (selectedMethod === "find") return `Find ${value}`;
  return "Reverse the list";
}

function currentValue() {
  const input = document.getElementById("valueInput");
  const value = Number(input.value);
  if (!Number.isInteger(value) || value < 0 || value > 999) {
    showToast("Enter a whole number between 0 and 999.");
    input.focus();
    return null;
  }
  return value;
}

function getOperationContext() {
  const selected = list.find(item => item.id === selectedId);
  const valueNeeded = ["append", "prepend", "insert", "find"].includes(selectedMethod);
  const value = valueNeeded ? currentValue() : undefined;
  if (valueNeeded && value === null) return null;
  if (collectionMode !== "list" && selectedMethod === "delete" && !list.length) {
    showToast(`${collectionMode === "stack" ? "Stack" : "Queue"} is empty.`);
    return null;
  }
  if (collectionMode === "list" && ["insert", "delete"].includes(selectedMethod) && !selected) {
    showToast("Select a node in the scene first.");
    return null;
  }
  return { value, selectedId: selected?.id, selectedValue: selected?.value };
}

function runSelectedMethod() {
  if (algorithmMode !== "none") {
    if (stepSession) return;
    if (stepMode) startAlgorithmStepSession();
    else runAlgorithm();
    return;
  }
  if (stepSession) return;
  const context = getOperationContext();
  if (!context) return;
  if (stepMode) startStepSession(context);
  else executeOperation(context);
}

function runAlgorithm() {
  if (!algorithmState) return;
  if (algorithmState.done) {
    configureAlgorithm();
    rebuildScene();
    updateRunButton();
    showToast("Algorithm walkthrough restarted.");
    return;
  }
  if (algorithmMode === "twoPointers") {
    const { left, right, target } = algorithmState;
    if (left >= right) {
      algorithmState.done = true;
      trace(`<b>No pair remains</b> that can sum to ${target}.`, "find");
      showToast(`No pair sums to ${target}.`);
    } else {
      const sum = list[left].value + list[right].value;
      if (sum === target) {
        algorithmState.found = [left, right]; algorithmState.done = true;
        selectedId = list[left].id;
        trace(`<b>${list[left].value} + ${list[right].value} = ${target}</b> — target pair found.`, "find");
        showToast(`Found ${list[left].value} + ${list[right].value} = ${target}.`);
      } else if (sum < target) {
        algorithmState.left += 1;
        trace(`<b>${list[left].value} + ${list[right].value} = ${sum}</b> is too small, so move L right.`, "find");
      } else {
        algorithmState.right -= 1;
        trace(`<b>${list[left].value} + ${list[right].value} = ${sum}</b> is too large, so move R left.`, "find");
      }
    }
  }
  if (algorithmMode === "slidingWindow") {
    const { start, size } = algorithmState;
    const values = list.slice(start, start + size).map(node => node.value);
    const sum = values.reduce((total, value) => total + value, 0);
    if (sum > algorithmState.best) { algorithmState.best = sum; algorithmState.bestStart = start; }
    trace(`<b>Window ${start + 1}–${start + size}: ${values.join(" + ") || "empty"} = ${sum}</b>.`, "find");
    if (start >= list.length - size) {
      algorithmState.start = algorithmState.bestStart;
      algorithmState.done = true;
      showToast(`Best window sum: ${algorithmState.best}.`);
    } else {
      algorithmState.start += 1;
      showToast("Window advanced one position.");
    }
  }
  if (algorithmMode === "binarySearch") {
    const { low, high, mid, target } = algorithmState;
    if (mid == null || low > high) {
      algorithmState.done = true;
      trace(`<b>The search range is empty.</b> ${target} is not present.`, "find");
      showToast(`${target} is not present.`);
    } else {
      const value = list[mid].value;
      if (value === target) {
        algorithmState.found = mid; algorithmState.done = true; selectedId = list[mid].id;
        trace(`<b>Midpoint ${value} matches ${target}</b> — target found.`, "find");
        showToast(`Found ${target} at midpoint.`);
      } else if (value < target) {
        algorithmState.low = mid + 1;
        algorithmState.mid = algorithmState.low <= high ? Math.floor((algorithmState.low + high) / 2) : null;
        trace(`<b>Midpoint ${value} is too small</b>; discard the lower half.`, "find");
      } else {
        algorithmState.high = mid - 1;
        algorithmState.mid = low <= algorithmState.high ? Math.floor((low + algorithmState.high) / 2) : null;
        trace(`<b>Midpoint ${value} is too large</b>; discard the upper half.`, "find");
      }
    }
  }
  rebuildScene();
  updateRunButton();
}

function executeOperation(context) {
  const selected = list.find(item => item.id === context.selectedId);
  const value = context.value;
  if (collectionMode === "stack") {
    if (selectedMethod === "append") {
      const node = createNodeData(value); list.unshift(node); selectedId = node.id;
      trace(`<b>Pushed ${value}</b> onto the top of the stack.`, "append"); showToast(`Pushed ${value}.`);
    } else {
      const removed = list.shift(); selectedId = list[0]?.id || null;
      trace(`<b>Popped ${removed.value}</b> from the top of the stack.`, "delete"); showToast(`Popped ${removed.value}.`);
    }
    rebuildScene();
    return;
  }
  if (collectionMode === "queue") {
    if (selectedMethod === "append") {
      const node = createNodeData(value); list.push(node); selectedId = node.id;
      trace(`<b>Enqueued ${value}</b> at the rear of the queue.`, "append"); showToast(`Enqueued ${value}.`);
    } else {
      const removed = list.shift(); selectedId = list[0]?.id || null;
      trace(`<b>Dequeued ${removed.value}</b> from the front of the queue.`, "delete"); showToast(`Dequeued ${removed.value}.`);
    }
    rebuildScene();
    return;
  }
  if (selectedMethod === "append") {
    const node = createNodeData(value); list.push(node); selectedId = node.id;
    trace(`<b>Created node ${value}</b> and linked the old tail to it.`, "append"); showToast(`Appended ${value} to the tail.`);
  }
  if (selectedMethod === "prepend") {
    const node = createNodeData(value); list.unshift(node); selectedId = node.id;
    trace(`<b>Created node ${value}</b> and moved head to the new node.`, "prepend"); showToast(`Prepended ${value} at the head.`);
  }
  if (selectedMethod === "insert") {
    const index = list.findIndex(item => item.id === selected.id); const node = createNodeData(value); list.splice(index + 1, 0, node); selectedId = node.id;
    trace(`<b>Linked ${selected.value} → ${value}</b>, preserving the old next pointer.`, "insert"); showToast(`Inserted ${value} after ${selected.value}.`);
  }
  if (selectedMethod === "delete") {
    const removed = selected;
    const removedIndex = list.findIndex(item => item.id === removed.id);
    list = list.filter(item => item.id !== removed.id);
    selectedId = list[removedIndex - 1]?.id || list[removedIndex]?.id || null;
    trace(`<b>Removed node ${removed.value}</b> and reconnected its neighboring pointer.`, "delete"); showToast(`Deleted node ${removed.value}.`);
  }
  if (selectedMethod === "find") {
    const found = list.find(item => item.value === value);
    if (found) { selectedId = found.id; trace(`<b>Visited nodes from head</b> and found value ${value}.`, "find"); showToast(`Found ${value}.`); }
    else { trace(`<b>Reached null</b> without finding ${value}.`, "find"); showToast(`${value} is not in this list.`); }
  }
  if (selectedMethod === "reverse") {
    list.reverse(); selectedId = list[0]?.id || null;
    trace(`<b>Flipped every next pointer</b>; the old tail is now the head.`, "reverse"); showToast("Reversed the linked list.");
  }
  rebuildScene();
}

function buildSteps(context) {
  const selected = list.find(item => item.id === context.selectedId);
  const value = context.value;
  if (collectionMode === "stack") {
    if (selectedMethod === "append") return [
      { line: 1, description: `Allocate node ${value}; it will become the new top.` },
      { line: 2, description: `Point ${value} at the current top${list.length ? ` (${list[0].value})` : " (null)"}.` },
      { line: 3, description: "Move the head reference to the new top, then apply the push." }
    ];
    return [
      { line: 2, description: `Keep a reference to the current top (${list[0].value}).` },
      { line: 3, description: `Move top to ${list[1]?.value ?? "null"}; the previous item is revealed.` },
      { line: 4, description: "Clear tail too if this was the final node, then apply the pop." }
    ];
  }
  if (collectionMode === "queue") {
    if (selectedMethod === "append") return [
      { line: 1, description: `Allocate node ${value}; it will join the rear of the queue.` },
      { line: list.length ? 3 : 2, description: list.length ? `Connect the current rear (${list.at(-1).value}) to ${value}.` : "This is an empty queue, so the new node is both front and rear." },
      { line: 4, description: "Move the tail/rear reference to the enqueued node." }
    ];
    return [
      { line: 2, description: `Keep a reference to the current front (${list[0].value}).` },
      { line: 3, description: `Move front to ${list[1]?.value ?? "null"}; the oldest item leaves.` },
      { line: 4, description: "Clear rear too if this was the final node, then apply the dequeue." }
    ];
  }
  if (selectedMethod === "append") return [
    { line: 1, description: `Allocate a new node carrying the value ${value}.` },
    { line: list.length ? 3 : 2, description: list.length ? (listMode === "doubly" ? `Connect tail ${list.at(-1).value} forward to the new node and give the new node a prev link back.` : `Connect the current tail (${list.at(-1).value}) to the new node.`) : "This is an empty list, so the new node becomes the head." },
    { line: 4, description: "Move the tail reference forward, then apply the new link." }
  ];
  if (selectedMethod === "prepend") return [
    { line: 1, description: `Allocate a new node carrying the value ${value}.` },
    { line: 2, description: `Point the new node at the current head${list.length ? ` (${list[0].value})` : " (null)"}.` },
    { line: 3, description: "Move the head reference to the new first node." }
  ];
  if (selectedMethod === "insert") return [
    { line: 1, description: `Allocate a new node carrying the value ${value}.` },
    { line: 2, description: listMode === "doubly" ? `Give the new node both neighbors: prev is ${selected.value} and next is ${selected.value}'s old next.` : `Copy ${selected.value}'s next pointer onto the new node.` },
    { line: 3, description: listMode === "doubly" ? "Update the old next node’s prev link so it points back to the newcomer." : `Redirect ${selected.value}'s next pointer to the new node.` },
    { line: 4, description: "If the selected node was the tail, move tail to the new node." }
  ];
  if (selectedMethod === "delete") {
    const targetIndex = list.findIndex(item => item.id === selected.id);
    if (listMode === "doubly") return [
      { line: 1, description: targetIndex > 0 ? `Use ${selected.value}'s prev node to bypass it in the forward direction.` : `The selected node is head, so move head to its next node.` },
      { line: 3, description: targetIndex < list.length - 1 ? `Use ${selected.value}'s next node to bypass it in the reverse direction.` : `The selected node is tail, so move tail to its prev node.` },
      { line: 5, description: `Clear ${selected.value}'s own next and prev references, then apply the unlink.` }
    ];
    return [
      { line: 1, description: "Start at the head with a previous pointer set to null." },
      ...list.slice(0, targetIndex).map(item => ({ line: 2, description: `Visit node ${item.value}; it is not the selected target, so continue.` })),
      { line: 5, description: targetIndex ? `Make node ${list[targetIndex - 1].value} skip over ${selected.value}.` : `Move head past the selected node ${selected.value}.` }
    ];
  }
  if (selectedMethod === "find") {
    const foundIndex = list.findIndex(item => item.value === value);
    const searched = list.slice(0, foundIndex >= 0 ? foundIndex + 1 : list.length);
    return [
      { line: 1, description: "Set current to the head, ready to walk the list." },
      ...searched.map(item => ({ line: item.value === value ? 3 : 4, description: item.value === value ? `Compare node ${item.value}: it matches the target.` : `Compare node ${item.value}: no match, follow next.` })),
      { line: foundIndex >= 0 ? 3 : 5, description: foundIndex >= 0 ? `Return node ${value} and select it in the scene.` : "Reached null without finding a matching node." }
    ];
  }
  if (listMode === "doubly") return [
    { line: 1, description: "Start at head. Each node will swap its next and prev references." },
    ...list.map(item => ({ line: 3, description: `At node ${item.value}, swap next and prev so both links turn around.` })),
    { line: 6, description: "Swap the head and tail references to complete the reversal." }
  ];
  return [
    { line: 1, description: "Set previous to null and current to the head." },
    ...list.map(item => ({ line: 4, description: `At node ${item.value}, save next and redirect its pointer backward.` })),
    { line: 6, description: "Swap the head and tail references to complete the reversal." }
  ];
}

function startStepSession(context) {
  stepSession = { type: "structure", context, steps: buildSteps(context), current: 0 };
  document.getElementById("stepper").hidden = false;
  renderStepSession();
  updateRunButton();
  showToast("Walk through the algorithm one line at a time.");
}

function buildAlgorithmSteps() {
  if (!algorithmState) return [];
  if (algorithmState.done) return [{ line: 1, description: "The walkthrough is complete. Applying this step restarts it from the initial pointers." }];
  if (algorithmMode === "twoPointers") {
    const { left, right, target } = algorithmState;
    if (left >= right) return [{ line: 2, description: "The pointers have met, so no unchecked pair remains." }];
    const sum = list[left].value + list[right].value;
    const decision = sum === target ? `The sum matches ${target}; this pair is the answer.` : sum < target ? `The sum is below ${target}; moving L right is the only way to increase it.` : `The sum is above ${target}; moving R left is the only way to decrease it.`;
    return [
      { line: 1, description: `L starts at ${list[left].value}; R starts at ${list[right].value}.` },
      { line: 2, description: "Both pointers are distinct, so the search can continue." },
      { line: 3, description: `Compute ${list[left].value} + ${list[right].value} = ${sum}.` },
      { line: sum === target ? 4 : 5, description: decision }
    ];
  }
  if (algorithmMode === "slidingWindow") {
    const { start, size, best } = algorithmState;
    const values = list.slice(start, start + size).map(node => node.value);
    const sum = values.reduce((total, value) => total + value, 0);
    const end = start + size - 1;
    return [
      { line: 1, description: Number.isFinite(best) ? `Best sum so far is ${best}.` : "Start with no best sum yet." },
      { line: 2, description: `Position the size-${size} window over nodes ${start + 1} through ${end + 1}.` },
      { line: 3, description: `Add the active values: ${values.join(" + ")} = ${sum}.` },
      { line: 4, description: sum > best ? `${sum} becomes the new best sum.` : `${sum} does not exceed the best sum ${best}; advance the window.` }
    ];
  }
  const { low, high, mid, target } = algorithmState;
  if (mid == null || low > high) return [{ line: 2, description: "The search range is empty, so the target is not present." }];
  const value = list[mid].value;
  const decision = value === target ? `Midpoint ${value} matches the target.` : value < target ? `${value} is too small; discard the lower half.` : `${value} is too large; discard the upper half.`;
  return [
    { line: 1, description: `The candidate range runs from ${list[low].value} to ${list[high].value}.` },
    { line: 2, description: "The range is valid, so inspect its middle." },
    { line: 3, description: `mid = floor((${low} + ${high}) / 2) = ${mid}; midpoint value is ${value}.` },
    { line: value === target ? 4 : 5, description: decision }
  ];
}

function startAlgorithmStepSession() {
  const steps = buildAlgorithmSteps();
  if (!steps.length) return;
  stepSession = { type: "algorithm", steps, current: 0 };
  document.getElementById("stepper").hidden = false;
  renderStepSession();
  updateRunButton();
  showToast("Review each comparison before applying the algorithm step.");
}

function renderStepSession() {
  if (!stepSession) return;
  const step = stepSession.steps[stepSession.current];
  const isLast = stepSession.current === stepSession.steps.length - 1;
  document.getElementById("stepCount").textContent = `Step ${stepSession.current + 1} of ${stepSession.steps.length}`;
  document.getElementById("stepDescription").textContent = step.description;
  document.getElementById("previousStep").disabled = stepSession.current === 0;
  const finalAction = stepSession.type === "algorithm" ? (algorithmState?.done ? "Restart walkthrough" : "Apply algorithm step") : selectedMethod === "find" ? "Confirm result" : "Apply change";
  document.getElementById("nextStep").textContent = isLast ? finalAction : "Next →";
  renderCode(getMethodDisplay(), [step.line]);
}

function moveStep(direction) {
  if (!stepSession) return;
  if (direction < 0 && stepSession.current > 0) {
    stepSession.current -= 1;
    renderStepSession();
    return;
  }
  if (direction > 0 && stepSession.current < stepSession.steps.length - 1) {
    stepSession.current += 1;
    renderStepSession();
    return;
  }
  if (direction > 0) {
    const session = stepSession;
    stepSession = null;
    document.getElementById("stepper").hidden = true;
    if (session.type === "algorithm") runAlgorithm();
    else executeOperation(session.context);
    renderCode(getMethodDisplay());
    updateRunButton();
  }
}

function exitStepSession() {
  stepSession = null;
  document.getElementById("stepper").hidden = true;
  renderCode(getMethodDisplay());
  updateRunButton();
}

function setStepMode(enabled) {
  if (!enabled && stepSession) exitStepSession();
  stepMode = enabled;
  const toggle = document.getElementById("stepToggle");
  toggle.classList.toggle("is-on", enabled);
  toggle.setAttribute("aria-pressed", String(enabled));
  updateRunButton();
}

function trace(text, method) {
  const listElement = document.getElementById("traceList");
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
  const title = method === "find" && algorithmMode !== "none" ? algorithmVariants[algorithmMode].title : methods[method].title;
  const methodName = title.replace("(value)", "").replace("(node, value)", "").replace("(target)", "").replace("(size)", "").replace("()", "");
  const item = document.createElement("li");
  item.innerHTML = `<span class="trace-time">${time}</span><b>${methodName}</b> — ${text}`;
  listElement.prepend(item);
  while (listElement.children.length > 4) listElement.lastElementChild.remove();
}

function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

document.querySelectorAll(".method-button").forEach(button => button.addEventListener("click", () => selectMethod(button.dataset.method)));
document.getElementById("singleMode").addEventListener("click", () => setListMode("singly"));
document.getElementById("doubleMode").addEventListener("click", () => setListMode("doubly"));
document.getElementById("listPreset").addEventListener("click", () => setCollectionMode("list"));
document.getElementById("stackPreset").addEventListener("click", () => setCollectionMode("stack"));
document.getElementById("queuePreset").addEventListener("click", () => setCollectionMode("queue"));
document.getElementById("noAlgorithm").addEventListener("click", () => setAlgorithmMode("none"));
document.getElementById("twoPointersAlgorithm").addEventListener("click", () => setAlgorithmMode("twoPointers"));
document.getElementById("windowAlgorithm").addEventListener("click", () => setAlgorithmMode("slidingWindow"));
document.getElementById("binaryAlgorithm").addEventListener("click", () => setAlgorithmMode("binarySearch"));
document.getElementById("algorithmInput").addEventListener("change", () => { if (algorithmMode !== "none") { if (stepSession) exitStepSession(); configureAlgorithm(); rebuildScene(); updateRunButton(); } });
document.getElementById("runMethod").addEventListener("click", runSelectedMethod);
document.getElementById("stepToggle").addEventListener("click", () => setStepMode(!stepMode));
document.getElementById("previousStep").addEventListener("click", () => moveStep(-1));
document.getElementById("nextStep").addEventListener("click", () => moveStep(1));
document.getElementById("exitSteps").addEventListener("click", () => setStepMode(false));
document.getElementById("valueInput").addEventListener("input", updateRunButton);
document.getElementById("valueInput").addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); runSelectedMethod(); } });
document.getElementById("resetList").addEventListener("click", () => { if (stepSession) exitStepSession(); list = starterValues.map(createNodeData); selectedId = list[0].id; if (algorithmMode !== "none") configureAlgorithm(); rebuildScene(); updateRunButton(); trace("<b>Restored the example list</b> with four linked nodes.", "append"); showToast("Example list restored."); });

trace("<b>Initialized</b> the example list: 15 → 28 → 46 → 63.", "append");
selectMethod("append");
initScene();
