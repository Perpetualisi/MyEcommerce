import React, { useEffect, useRef, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";

/* ══════════════════════════════════════════════════
   SLIDE DATA
══════════════════════════════════════════════════ */
const slides = [
  {
    category: "Fashion",
    label: "Clothing & Apparel",
    count: 15,
    accent: "#C9A96E",
    accentRGB: [0.788, 0.663, 0.431],
    bg: "radial-gradient(ellipse at 60% 50%, rgba(201,169,110,0.13) 0%, transparent 65%)",
    scene: "fashion",
    tagline: "Wear the archive.",
  },
  {
    category: "Electronics",
    label: "Tech & Gadgets",
    count: 15,
    accent: "#6EC9C9",
    accentRGB: [0.431, 0.788, 0.788],
    bg: "radial-gradient(ellipse at 60% 50%, rgba(110,201,201,0.13) 0%, transparent 65%)",
    scene: "electronics",
    tagline: "Signal intelligence.",
  },
  {
    category: "Furniture",
    label: "Home & Living",
    count: 15,
    accent: "#C9A07E",
    accentRGB: [0.788, 0.627, 0.494],
    bg: "radial-gradient(ellipse at 60% 50%, rgba(201,160,126,0.13) 0%, transparent 65%)",
    scene: "furniture",
    tagline: "Space as language.",
  },
  {
    category: "Groceries",
    label: "Artisan & Fresh",
    count: 15,
    accent: "#7EBF7A",
    accentRGB: [0.494, 0.749, 0.478],
    bg: "radial-gradient(ellipse at 60% 50%, rgba(126,191,122,0.13) 0%, transparent 65%)",
    scene: "groceries",
    tagline: "Taste with intention.",
  },
];

/* ══════════════════════════════════════════════════
   MATERIAL HELPERS
══════════════════════════════════════════════════ */
const mat = (color, rough = 0.4, metal = 0.5) =>
  new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: rough, metalness: metal });

const basic = (color, opacity = 1) =>
  new THREE.MeshBasicMaterial({ color: new THREE.Color(color), transparent: opacity < 1, opacity });

const wireMat = (color, opacity = 0.12) =>
  new THREE.MeshBasicMaterial({ color: new THREE.Color(color), wireframe: true, transparent: true, opacity });

/* ══════════════════════════════════════════════════
   SHARED: ORBITAL RING
   Glowing torus that slowly spins around an object
══════════════════════════════════════════════════ */
function makeRing(accentHex, radius = 1.6, tube = 0.012, tiltX = 0.7, tiltZ = 0.3) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 8, 80),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(accentHex), transparent: true, opacity: 0.45 })
  );
  ring.rotation.x = tiltX;
  ring.rotation.z = tiltZ;
  ring.userData._ring = true;
  return ring;
}

/* Wireframe ghost clone */
function makeGhost(source, accentHex, scale = 1.18) {
  const ghost = source.clone();
  ghost.scale.setScalar(scale);
  ghost.traverse(child => {
    if (child.isMesh) {
      child.material = wireMat(accentHex, 0.09);
    }
  });
  ghost.userData._ghost = true;
  return ghost;
}

/* ══════════════════════════════════════════════════
   PARTICLE FIELD
══════════════════════════════════════════════════ */
function makeParticles(accentRGB, count = 220) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 18;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    sizes[i] = Math.random() * 0.6 + 0.1;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const col = new THREE.Color(...accentRGB);
  const pts = new THREE.Points(geo,
    new THREE.PointsMaterial({
      color: col,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    })
  );
  pts.userData._particles = true;
  return pts;
}

/* ══════════════════════════════════════════════════
   REFLECTIVE GROUND PLANE
══════════════════════════════════════════════════ */
function makeGround(accentHex) {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 14, 1, 1),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x0a0905),
      roughness: 0.05,
      metalness: 0.95,
      envMapIntensity: 1.0,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2.1;
  ground.userData._ground = true;
  return ground;
}

/* ══════════════════════════════════════════════════
   GRID FLOOR
══════════════════════════════════════════════════ */
function makeGridFloor(accentHex) {
  const geo = new THREE.PlaneGeometry(22, 12, 22, 12);
  const grid = new THREE.Mesh(geo,
    new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentHex),
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    })
  );
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -2.08;
  grid.userData._grid = true;
  return grid;
}

/* ══════════════════════════════════════════════════
   MODELS — FASHION
══════════════════════════════════════════════════ */
function makeTShirt(accentHex) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex);
  const dark = col.clone().multiplyScalar(0.5);
  // body
  g.add((() => { const _m = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.4, 0.28), mat(col, 0.9, 0)); _m.position.set(0,-0.3,0); return _m; })());
  // sleeves
  const sl = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.25), mat(col, 0.9, 0));
  sl.position.set(-1.42, 0.85, 0); sl.rotation.z = -0.42; g.add(sl);
  const sr = sl.clone(); sr.position.set(1.42, 0.85, 0); sr.rotation.z = 0.42; g.add(sr);
  // collar
  g.add((() => { const _m = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 0.28, 20, 1, true), mat(dark, 0.9, 0)); _m.position.set(0,1.05,0); return _m; })());
  // hem
  g.add((() => { const _m = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.12, 0.3), mat(dark, 0.9, 0)); _m.position.set(0,-1.5,0); return _m; })());
  // pocket
  g.add((() => { const _m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.04), mat(dark, 0.9, 0)); _m.position.set(-0.55,0.25,0.15); return _m; })());
  return g;
}

function makeSneaker(accentHex, scale = 1) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex);
  const sole = new THREE.Color(0x111111);
  const s = scale;
  // sole
  g.add((() => { const _m = new THREE.Mesh(new THREE.BoxGeometry(1.8*s, 0.22*s, 0.7*s), mat(sole, 0.8, 0.1)); _m.position.set(0,-0.45*s,0); return _m; })());
  // upper
  g.add((() => { const _m = new THREE.Mesh(new THREE.BoxGeometry(1.6*s, 0.55*s, 0.62*s), mat(col, 0.7, 0.1)); _m.position.set(-0.05*s,-0.1*s,0); return _m; })());
  // toe
  const toe = new THREE.Mesh(new THREE.SphereGeometry(0.32*s, 16, 12), mat(col.clone().multiplyScalar(0.8), 0.6, 0.1));
  toe.position.set(0.72*s, -0.12*s, 0); toe.scale.set(1.0, 0.7, 0.9); g.add(toe);
  // heel
  g.add((() => { const _m = new THREE.Mesh(new THREE.BoxGeometry(0.4*s, 0.42*s, 0.62*s), mat(col.clone().multiplyScalar(1.1), 0.7, 0.1)); _m.position.set(-0.65*s,-0.22*s,0); return _m; })());
  // tongue
  g.add((() => { const _m = new THREE.Mesh(new THREE.BoxGeometry(0.38*s, 0.55*s, 0.06*s), mat(new THREE.Color(0xfafafa), 0.9, 0)); _m.position.set(-0.12*s,0.12*s,0.32*s); return _m; })());
  return g;
}

/* Wristwatch — new */
function makeWatch(accentHex, scale = 1) {
  const g = new THREE.Group();
  const s = scale;
  const col = new THREE.Color(accentHex);
  const silver = new THREE.Color(0x888888);
  // case
  const caseM = new THREE.Mesh(new THREE.CylinderGeometry(0.38*s, 0.38*s, 0.12*s, 40), mat(silver, 0.1, 0.95));
  caseM.rotation.x = Math.PI / 2;
  g.add(caseM);
  // dial
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.33*s, 0.33*s, 0.07*s, 40), mat(new THREE.Color(0x080705), 0.4, 0.3));
  dial.rotation.x = Math.PI / 2;
  dial.position.z = 0.04*s;
  g.add(dial);
  // accent ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.33*s, 0.025*s, 8, 40), mat(col, 0.2, 0.8));
  ring.rotation.x = Math.PI / 2;
  ring.position.z = 0.065*s;
  g.add(ring);
  // hands
  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.03*s, 0.26*s, 0.02*s), mat(col, 0.2, 0.8));
  minHand.position.set(0, 0.09*s, 0.09*s);
  g.add(minHand);
  const hrHand = new THREE.Mesh(new THREE.BoxGeometry(0.035*s, 0.18*s, 0.02*s), mat(new THREE.Color(0xffffff), 0.2, 0.6));
  hrHand.position.set(0.04*s, 0.06*s, 0.09*s);
  hrHand.rotation.z = 1.1;
  g.add(hrHand);
  // straps
  [-1, 1].forEach(sign => {
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.5*s, 0.68*s, 0.07*s), mat(new THREE.Color(0x1a0f05), 0.95, 0));
    strap.rotation.x = Math.PI / 2;
    strap.position.z = sign * 0.48*s;
    g.add(strap);
  });
  return g;
}

/* ══════════════════════════════════════════════════
   MODELS — ELECTRONICS
══════════════════════════════════════════════════ */
function makeSmartphone(accentHex) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex);
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 0.11), mat(new THREE.Color(0x141414), 0.05, 0.95));
  g.add(body);
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.95, 0.06), mat(col.clone().multiplyScalar(0.35), 0.05, 0.1));
  screen.position.z = 0.08; g.add(screen);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 1.82), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.18 }));
  glow.position.z = 0.12; g.add(glow);
  // home bar
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.045, 0.04), mat(col, 0.2, 0.8));
  bar.position.set(0, -0.92, 0.12); g.add(bar);
  // camera island
  const ci = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.04), mat(new THREE.Color(0x0a0a0a), 0.1, 0.9));
  ci.position.set(0.2, 0.85, -0.07); g.add(ci);
  [[-0.08,0.08],[0.08,0.08],[-0.08,-0.08]].forEach(([cx,cy]) => {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,0.03,20), mat(new THREE.Color(0x030303), 0.05, 0.5));
    lens.rotation.x = Math.PI/2; lens.position.set(0.2+cx, 0.85+cy, -0.09); g.add(lens);
  });
  const btn = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 0.06), mat(col, 0.3, 0.8));
  btn.position.set(0.58, 0.1, 0); g.add(btn);
  return g;
}

function makeLaptop(accentHex, scale = 1) {
  const g = new THREE.Group();
  const s = scale;
  const bodyCol = new THREE.Color(0x252525);
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.2*s, 0.1*s, 1.5*s), mat(bodyCol, 0.15, 0.85));
  base.position.y = -0.05*s; g.add(base);
  const lid = new THREE.Group();
  lid.add(new THREE.Mesh(new THREE.BoxGeometry(2.2*s, 1.45*s, 0.07*s), mat(bodyCol, 0.15, 0.85)));
  const scrnM = new THREE.Mesh(new THREE.BoxGeometry(2.0*s, 1.3*s, 0.04*s), mat(new THREE.Color(accentHex).multiplyScalar(0.3), 0.05, 0.1));
  scrnM.position.z = 0.055*s; lid.add(scrnM);
  lid.position.set(0, 0.05*s, -0.72*s); lid.rotation.x = -1.9; g.add(lid);
  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.7*s, 0.45*s, 0.01*s), mat(new THREE.Color(0x333333), 0.3, 0.6));
  pad.position.set(0, 0.1*s, 0.35*s); g.add(pad);
  return g;
}

/* AirPod-style earbuds — new */
function makeAirpods(accentHex, scale = 1) {
  const g = new THREE.Group();
  const s = scale;
  const col = new THREE.Color(0xf0f0f0);
  const accent = new THREE.Color(accentHex);
  const makeEarbud = (side) => {
    const eb = new THREE.Group();
    // pod body
    const pod = new THREE.Mesh(new THREE.SphereGeometry(0.22*s, 20, 16), mat(col, 0.15, 0.1));
    pod.scale.set(1, 1.1, 0.9); eb.add(pod);
    // stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.06*s, 0.05*s, 0.55*s, 12), mat(col, 0.15, 0.1));
    stem.position.y = -0.4*s; eb.add(stem);
    // accent dot
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.05*s, 10, 10), mat(accent, 0.1, 0.8));
    dot.position.set(0, -0.55*s, 0.04*s); eb.add(dot);
    eb.position.set(side * 0.55*s, 0, 0);
    eb.rotation.z = side * 0.25;
    return eb;
  };
  g.add(makeEarbud(-1)); g.add(makeEarbud(1));
  // case hint
  const caseB = new THREE.Mesh(new THREE.BoxGeometry(1.2*s, 0.55*s, 0.7*s),
    new THREE.MeshStandardMaterial({ color: col, roughness: 0.1, metalness: 0.1 }));
  caseB.position.y = -1.0*s;
  const lid2 = new THREE.Mesh(new THREE.BoxGeometry(1.2*s, 0.35*s, 0.7*s),
    new THREE.MeshStandardMaterial({ color: col.clone().multiplyScalar(0.92), roughness: 0.1, metalness: 0.1 }));
  lid2.position.y = -0.45*s; lid2.rotation.x = -0.6;
  g.add(caseB); g.add(lid2);
  return g;
}

/* ══════════════════════════════════════════════════
   MODELS — FURNITURE
══════════════════════════════════════════════════ */
function makeChair(accentHex) {
  const g = new THREE.Group();
  const wood = new THREE.Color(accentHex);
  const dark = wood.clone().multiplyScalar(0.5);
  const pad  = new THREE.Color(0x141414);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.6), mat(wood, 0.7, 0.1));
  seat.position.y = 0.3; g.add(seat);
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.12, 1.45), mat(pad, 0.95, 0));
  cushion.position.y = 0.41; g.add(cushion);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 0.1), mat(wood, 0.7, 0.1));
  back.position.set(0, 1.15, -0.75); g.add(back);
  const backCush = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.35, 0.1), mat(pad, 0.95, 0));
  backCush.position.set(0, 1.15, -0.69); g.add(backCush);
  [[-0.65,-0.65],[0.65,-0.65],[-0.65,0.65],[0.65,0.65]].forEach(([x,z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,1.3,12), mat(dark, 0.6, 0.2));
    leg.position.set(x, -0.35, z); g.add(leg);
  });
  [-0.88, 0.88].forEach(x => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 1.1), mat(wood, 0.7, 0.1));
    arm.position.set(x, 0.78, 0.08); g.add(arm);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), mat(dark, 0.6, 0.2));
    post.position.set(x, 0.54, 0.55); g.add(post);
  });
  return g;
}

/* Sofa — new, large centrepiece for furniture scene */
function makeSofa(accentHex) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex).multiplyScalar(0.6);
  const dark = col.clone().multiplyScalar(0.6);
  const leg = new THREE.Color(0x888888);
  // main body
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.7, 1.3), mat(col, 0.95, 0));
  body.position.y = 0.05; g.add(body);
  // back
  const back = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.85, 0.38), mat(col, 0.95, 0));
  back.position.set(0, 0.7, -0.46); g.add(back);
  // seat cushions (3)
  [-1.02, 0, 1.02].forEach(x => {
    const c = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.22, 1.12), mat(dark, 0.95, 0));
    c.position.set(x, 0.46, 0.05); g.add(c);
  });
  // armrests
  [-1.72, 1.72].forEach(x => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.78, 1.3), mat(col, 0.95, 0));
    arm.position.set(x, 0.29, 0); g.add(arm);
  });
  // legs (4)
  [[-1.3,-0.5],[1.3,-0.5],[-1.3,0.5],[1.3,0.5]].forEach(([x,z]) => {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.07,0.07,0.4,10), mat(leg, 0.1, 0.85));
    l.position.set(x, -0.35, z); g.add(l);
  });
  return g;
}

function makeLamp(accentHex, scale = 1) {
  const g = new THREE.Group();
  const s = scale;
  const col = new THREE.Color(accentHex);
  const silver = new THREE.Color(0x888888);
  const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.38*s,0.42*s,0.08*s,24), mat(silver, 0.2, 0.85));
  base2.position.y = -1.05*s; g.add(base2);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04*s,0.04*s,1.8*s,12), mat(silver, 0.2, 0.85));
  pole.position.y = -0.05*s; g.add(pole);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.55*s,0.65*s,24,1,true), mat(col, 0.8, 0));
  shade.position.y = 0.85*s; g.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12*s,16,16), new THREE.MeshBasicMaterial({ color: new THREE.Color(1,0.95,0.7), transparent: true, opacity: 0.9 }));
  bulb.position.y = 0.65*s; g.add(bulb);
  return g;
}

/* ══════════════════════════════════════════════════
   MODELS — GROCERIES
══════════════════════════════════════════════════ */
function makeApple(accentHex, scale = 1) {
  const g = new THREE.Group();
  const s = scale;
  const red = new THREE.Color(accentHex);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.72*s,32,28), mat(red, 0.5, 0));
  body.scale.y = 0.88; g.add(body);
  const indent = new THREE.Mesh(new THREE.SphereGeometry(0.18*s,12,12), mat(red.clone().multiplyScalar(0.7), 0.7, 0));
  indent.position.y = 0.58*s; indent.scale.y = 0.4; g.add(indent);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025*s,0.03*s,0.28*s,8), mat(new THREE.Color(0x5a3a1a), 0.9, 0));
  stem.position.y = 0.72*s; g.add(stem);
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0,0); leafShape.bezierCurveTo(0.15,0.15,0.25,0.1,0.2,-0.1); leafShape.bezierCurveTo(0.1,-0.05,0,0.05,0,0);
  const leaf = new THREE.Mesh(new THREE.ShapeGeometry(leafShape, 8), mat(new THREE.Color(0x2e7d32), 0.8, 0));
  leaf.position.set(0.04*s,0.85*s,0); leaf.rotation.z = 0.4; leaf.scale.setScalar(s); g.add(leaf);
  return g;
}

/* Olive oil bottle — new */
function makeOliveOil(accentHex, scale = 1) {
  const g = new THREE.Group();
  const s = scale;
  const glass = new THREE.Color(accentHex).lerp(new THREE.Color(0x2a4a1a), 0.6);
  // bottle body
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35*s, 0.3*s, 1.2*s, 24),
    new THREE.MeshStandardMaterial({ color: glass, roughness: 0.06, metalness: 0, transparent: true, opacity: 0.82 })
  );
  g.add(body);
  // shoulder taper
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.18*s, 0.35*s, 0.35*s, 24), mat(glass, 0.06, 0));
  shoulder.position.y = 0.775*s; g.add(shoulder);
  // neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1*s, 0.18*s, 0.3*s, 16), mat(glass, 0.06, 0));
  neck.position.y = 1.08*s; g.add(neck);
  // cork
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.1*s, 0.1*s, 0.16*s, 14), mat(new THREE.Color(0xb8860b), 0.9, 0));
  cork.position.y = 1.3*s; g.add(cork);
  // label hint
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.36*s, 0.31*s, 0.55*s, 24), mat(new THREE.Color(accentHex).multiplyScalar(1.3), 0.8, 0));
  label.position.y = -0.1*s; g.add(label);
  return g;
}

function makeJar(accentHex, scale = 1) {
  const g = new THREE.Group();
  const s = scale;
  const glass = new THREE.Color(accentHex).multiplyScalar(0.6);
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42*s,0.38*s,1.0*s,28),
    new THREE.MeshStandardMaterial({ color: glass, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.72 }));
  g.add(body);
  const lidM = new THREE.Mesh(new THREE.CylinderGeometry(0.44*s,0.44*s,0.18*s,28), mat(new THREE.Color(0x888888), 0.2, 0.8));
  lidM.position.y = 0.59*s; g.add(lidM);
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.38*s,0.34*s,0.7*s,24), mat(new THREE.Color(accentHex), 0.6, 0));
  fill.position.y = -0.12*s; g.add(fill);
  return g;
}

function makeBread(scale = 1) {
  const g = new THREE.Group();
  const s = scale;
  const crust = new THREE.Color(0xc8860a);
  const inner = new THREE.Color(0xf5d07a);
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.4*s,0.75*s,0.7*s), mat(crust, 0.95, 0));
  g.add(body);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.52*s,20,14), mat(crust.clone().multiplyScalar(0.88), 0.95, 0));
  dome.position.y = 0.3*s; dome.scale.set(1.32, 0.58, 0.68); g.add(dome);
  [-0.2*s, 0.2*s].forEach(x => {
    const cut = new THREE.Mesh(new THREE.BoxGeometry(0.04*s,0.12*s,0.65*s), mat(inner, 0.95, 0));
    cut.position.set(x, 0.46*s, 0); g.add(cut);
  });
  return g;
}

/* ══════════════════════════════════════════════════
   SCENE ASSEMBLER
══════════════════════════════════════════════════ */
function assembleScene(sceneName, accentRGB) {
  const accent = new THREE.Color(...accentRGB);
  const accentHex = `#${accent.getHexString()}`;
  const objects = []; // { mesh, basePos, ud }

  const addObj = (mesh, pos, rx=0, ry=0, rz=0, ud={}) => {
    mesh.position.set(...pos);
    mesh.rotation.set(rx, ry, rz);
    mesh.userData = { rotY:0.007, rotX:0.001, floatAmp:0.25, floatSpeed:1.0, floatOffset:0, ...ud };
    objects.push(mesh);
    return mesh;
  };

  if (sceneName === "fashion") {
    const shirt = makeTShirt(accentHex);
    addObj(shirt, [0, 0.1, 0], 0, 0, 0, { rotY:0.007, rotX:0.001, floatAmp:0.3, floatSpeed:0.9, floatOffset:0 });
    const shoe = makeSneaker(accentHex, 0.72);
    addObj(shoe, [-2.6, -1.0, 0.3], 0, 0.6, 0, { rotY:0.009, floatAmp:0.2, floatSpeed:1.2, floatOffset:1.1 });
    const shoe2 = makeSneaker(accentHex, 0.62);
    addObj(shoe2, [2.4, -1.4, -0.2], 0, -0.8, 0, { rotY:0.007, floatAmp:0.18, floatSpeed:1.35, floatOffset:2.3 });
    const watch = makeWatch(accentHex, 0.9);
    addObj(watch, [2.0, 1.2, 0.6], 0.2, -0.5, 0.3, { rotY:0.01, rotX:0.003, floatAmp:0.22, floatSpeed:1.1, floatOffset:3.1 });
  }

  if (sceneName === "electronics") {
    const phone = makeSmartphone(accentHex);
    addObj(phone, [0.2, 0.1, 0], 0, 0, 0, { rotY:0.007, rotX:0.002, floatAmp:0.28, floatSpeed:0.95, floatOffset:0 });
    const laptop = makeLaptop(accentHex, 0.62);
    addObj(laptop, [-2.4, -0.7, -0.5], 0, 0.5, 0, { rotY:0.005, floatAmp:0.16, floatSpeed:1.1, floatOffset:1.8 });
    const pods = makeAirpods(accentHex, 0.85);
    addObj(pods, [2.3, 0.3, 0.3], 0, -0.5, 0.2, { rotY:0.009, rotX:0.003, floatAmp:0.24, floatSpeed:1.25, floatOffset:0.7 });
  }

  if (sceneName === "furniture") {
    const sofa = makeSofa(accentHex);
    addObj(sofa, [0, -0.6, 0], 0, 0.3, 0, { rotY:0.005, floatAmp:0.18, floatSpeed:0.85, floatOffset:0 });
    const chair = makeChair(accentHex);
    addObj(chair, [-2.7, 0.0, 0.4], 0, 0.8, 0, { rotY:0.007, floatAmp:0.2, floatSpeed:1.0, floatOffset:1.5 });
    const lamp = makeLamp(accentHex, 0.7);
    addObj(lamp, [2.6, 0.2, 0], 0, 0, 0, { rotY:0.008, floatAmp:0.18, floatSpeed:1.15, floatOffset:1.2 });
  }

  if (sceneName === "groceries") {
    const apple = makeApple(accentHex, 1.35);
    addObj(apple, [0.2, 0.2, 0], 0, 0, 0, { rotY:0.008, rotX:0.002, floatAmp:0.3, floatSpeed:1.0, floatOffset:0 });
    const oil = makeOliveOil(accentHex, 0.85);
    addObj(oil, [-2.3, -0.1, 0.3], 0, 0.6, 0, { rotY:0.006, floatAmp:0.2, floatSpeed:1.15, floatOffset:1.1 });
    const jar = makeJar(accentHex, 0.78);
    addObj(jar, [2.3, -0.3, 0], 0, -0.5, 0, { rotY:0.007, floatAmp:0.2, floatSpeed:1.2, floatOffset:2.0 });
    const bread = makeBread(0.72);
    addObj(bread, [1.0, -1.8, 0.5], 0, -0.4, 0, { rotY:0.006, floatAmp:0.16, floatSpeed:1.3, floatOffset:2.8 });
  }

  return objects;
}

/* ══════════════════════════════════════════════════
   THREE.JS SCENE
══════════════════════════════════════════════════ */
const ThreeScene = ({ slide, transitioning }) => {
  const mountRef  = useRef(null);
  const rendRef   = useRef(null);
  const sceneRef  = useRef(null);
  const camRef    = useRef(null);
  const objsRef   = useRef([]);
  const ringsRef  = useRef([]);
  const ptRef     = useRef(null);
  const frameRef  = useRef(null);
  const clockRef  = useRef(new THREE.Clock());
  const mouseRef  = useRef({ x:0, y:0 });
  const targetCam = useRef({ x:0, y:0.5 });
  const introRef  = useRef({ active: true, t: 0 });
  const accentLightRef = useRef(null);

  // Init renderer once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);
    rendRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(46, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.5, 9.5);
    camRef.current = camera;

    const ro = new ResizeObserver(() => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);

    const onMouse = e => {
      const rect = mount.getBoundingClientRect();
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: -((e.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };
    mount.addEventListener('mousemove', onMouse);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
      mount.removeEventListener('mousemove', onMouse);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // Rebuild scene on slide change
  useEffect(() => {
    const renderer = rendRef.current;
    const camera = camRef.current;
    if (!renderer || !camera) return;
    cancelAnimationFrame(frameRef.current);

    // Dispose old scene
    if (sceneRef.current) {
      sceneRef.current.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) [obj.material].flat().forEach(m => m.dispose());
      });
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ── LIGHTING ──────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const key = new THREE.DirectionalLight(0xffffff, 2.0);
    key.position.set(5, 9, 6);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 0.55);
    fill.position.set(-6, 2, 4);
    scene.add(fill);

    const accentLight = new THREE.PointLight(new THREE.Color(...slide.accentRGB), 4.5, 22);
    accentLight.position.set(-3, 3.5, 5);
    scene.add(accentLight);
    accentLightRef.current = accentLight;

    // Pulsing rim light
    const rim = new THREE.PointLight(0xffffff, 1.0, 18);
    rim.position.set(5, -4, 3);
    scene.add(rim);

    // Second accent behind
    const accentBack = new THREE.PointLight(new THREE.Color(...slide.accentRGB), 2.0, 14);
    accentBack.position.set(3, -2, -4);
    scene.add(accentBack);

    // ── ENVIRONMENT ────────────────────────────────
    scene.add(makeGround(slide.accent));
    scene.add(makeGridFloor(slide.accent));
    const particles = makeParticles(slide.accentRGB, 280);
    scene.add(particles);
    ptRef.current = particles;

    // ── PRODUCTS ───────────────────────────────────
    const objects = assembleScene(slide.scene, slide.accentRGB);
    objects.forEach(obj => {
      obj.castShadow = true;
      scene.add(obj);
    });
    objsRef.current = objects;

    // ── ORBITAL RINGS (one per hero object) ────────
    const rings = [];
    if (objects.length > 0) {
      const hero = objects[0];
      const r1 = makeRing(slide.accent, 1.8, 0.014, 0.7, 0.2);
      r1.position.copy(hero.position);
      scene.add(r1); rings.push({ mesh: r1, speed: 0.4, axis: 'y' });

      const r2 = makeRing(slide.accent, 2.2, 0.008, 1.2, -0.5);
      r2.position.copy(hero.position);
      scene.add(r2); rings.push({ mesh: r2, speed: -0.28, axis: 'x' });
    }
    ringsRef.current = rings;

    // ── GHOST WIREFRAME (hero only) ─────────────────
    if (objects.length > 0) {
      const ghost = makeGhost(objects[0], slide.accent, 1.22);
      ghost.position.copy(objects[0].position);
      scene.add(ghost);
      objects[0].userData._ghost = ghost;
      // attach ghost update to hero object
    }

    // Reset intro camera animation
    introRef.current = { active: true, t: 0 };
    camera.position.set(0, 3, 14);
    clockRef.current = new THREE.Clock();

    // Store base positions for float
    objects.forEach(obj => {
      obj.userData._baseX = obj.position.x;
      obj.userData._baseY = obj.position.y;
      obj.userData._baseZ = obj.position.z;
    });

    // ── ANIMATE LOOP ───────────────────────────────
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();
      const dt = Math.min(0.05, clockRef.current.getDelta ? 0.016 : 0.016);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Cinematic intro: camera pulls in
      if (introRef.current.active) {
        introRef.current.t = Math.min(introRef.current.t + 0.012, 1);
        const p = 1 - Math.pow(1 - introRef.current.t, 3); // ease out cubic
        camera.position.z = 14 - p * 4.5;
        camera.position.y = 3 - p * 2.5;
        if (introRef.current.t >= 1) introRef.current.active = false;
      } else {
        // Smooth mouse parallax
        targetCam.current.x += (mx * 0.7 - targetCam.current.x) * 0.04;
        targetCam.current.y += (0.5 + my * 0.4 - targetCam.current.y) * 0.04;
        camera.position.x += (targetCam.current.x - camera.position.x) * 0.04;
        camera.position.y += (targetCam.current.y - camera.position.y) * 0.04;
      }
      camera.lookAt(0, 0, 0);

      // Pulsing accent light
      if (accentLightRef.current) {
        accentLightRef.current.intensity = 4.0 + Math.sin(t * 1.8) * 1.0;
      }

      // Float + rotate objects
      objects.forEach(obj => {
        const { rotY=0.007, rotX=0.001, floatAmp=0.25, floatSpeed=1.0, floatOffset=0,
                _baseX=0, _baseY=0, _ghost } = obj.userData;
        obj.rotation.y += rotY + mx * 0.0008;
        obj.rotation.x += rotX + my * 0.0004;
        obj.position.y = _baseY + Math.sin(t * floatSpeed + floatOffset) * floatAmp;
        obj.position.x = _baseX + Math.sin(t * floatSpeed * 0.38 + floatOffset) * floatAmp * 0.1;

        // Sync ghost to hero
        if (_ghost) {
          _ghost.position.copy(obj.position);
          _ghost.rotation.copy(obj.rotation);
          _ghost.rotation.y += t * 0.15;
        }
      });

      // Orbital rings follow hero
      if (objects.length > 0) {
        const hero = objects[0];
        rings.forEach(({ mesh, speed, axis }) => {
          mesh.position.copy(hero.position);
          if (axis === 'y') mesh.rotation.y += speed * 0.012;
          else mesh.rotation.x += speed * 0.012;
        });
      }

      // Slowly rotate particles
      if (ptRef.current) {
        ptRef.current.rotation.y = t * 0.015;
        ptRef.current.rotation.x = Math.sin(t * 0.08) * 0.04;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => cancelAnimationFrame(frameRef.current);
  }, [slide]);

  return (
    <div ref={mountRef} style={{ position:'absolute', inset:0, opacity: transitioning ? 0 : 1, transition:'opacity 0.45s ease' }} />
  );
};

/* ══════════════════════════════════════════════════
   LIVE CLOCK
══════════════════════════════════════════════════ */
const LiveClock = ({ accent }) => {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const iv = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);
  const h = String(time.getHours()).padStart(2,'0');
  const m = String(time.getMinutes()).padStart(2,'0');
  const s = String(time.getSeconds()).padStart(2,'0');
  return (
    <div style={{
      position:'absolute', top:24, left:28, zIndex:40,
      fontFamily:"'Overpass Mono', monospace",
      fontSize:'8px', letterSpacing:'0.4em', textTransform:'uppercase',
      color: accent, opacity: 0.65,
      transition:'color 0.8s',
    }}>
      {h}:{m}:{s}
    </div>
  );
};

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .hero-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    padding-top: 80px;
  }
  .hero-section {
    width: 100%; height: calc(100vh - 80px); min-height: 680px;
    display: grid; grid-template-columns: 54% 46%;
    background: #080705; overflow: hidden; position: relative;
  }
  @media (max-width: 992px) { .hero-section { grid-template-columns: 50% 50%; } }
  @media (max-width: 768px) {
    .hero-root { padding-top: 60px; }
    .hero-section { display: flex; flex-direction: column-reverse; height: auto; min-height: calc(100svh - 60px); }
  }

  /* ── LEFT PANEL ── */
  .left-panel {
    position: relative; display: flex; flex-direction: column;
    justify-content: center; padding: 0 6vw; z-index: 20;
  }
  @media (max-width: 768px) { .left-panel { padding: 44px 7vw 88px; height: auto; width: 100%; } }

  /* vertical category ticker */
  .cat-ticker {
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 26px; display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    border-right: 1px solid rgba(255,255,255,0.05);
    gap: 28px; z-index: 10;
  }
  @media (max-width: 768px) { .cat-ticker { display: none; } }
  .cat-tick-item {
    writing-mode: vertical-rl; transform: rotate(180deg);
    font-size: 7px; letter-spacing: 0.45em; text-transform: uppercase;
    cursor: pointer; transition: color 0.4s, opacity 0.4s;
  }

  .counter {
    font-size: 10px; letter-spacing: 0.45em; color: rgba(255,255,255,0.22);
    margin-bottom: clamp(18px,3.5vh,32px); display: flex; align-items: center; gap: 14px;
  }
  .eyebrow { font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; margin-bottom: 16px; transition: color 0.8s, opacity 0.4s, transform 0.4s; }
  .headline {
    font-weight: 300; line-height: 1.06; letter-spacing: -0.025em;
    color: #fff; margin-bottom: 20px; font-size: clamp(34px,4.5vw,86px);
    transition: opacity 0.4s 0.05s, transform 0.4s 0.05s;
  }
  @media (max-width: 768px) { .headline { font-size: clamp(30px,9vw,44px); } }
  .headline em { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; color: rgba(255,255,255,0.5); }
  .tagline-line {
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    font-size: clamp(13px,1.3vw,17px); color: rgba(255,255,255,0.32);
    margin-bottom: 22px; letter-spacing: 0.02em;
    transition: opacity 0.4s 0.08s;
  }
  .subline {
    font-size: 10px; line-height: 1.95; color: rgba(255,255,255,0.3);
    max-width: 380px; margin-bottom: clamp(28px,4.5vh,42px); letter-spacing: 0.04em;
    transition: opacity 0.4s 0.1s;
  }
  .cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
  .btn-fill {
    padding: 17px 40px; font-family: 'Overpass Mono', monospace;
    font-size: 9px; letter-spacing: 0.38em; text-transform: uppercase;
    text-decoration: none; border: none; cursor: pointer; color: #080705;
    font-weight: 600; display: inline-block;
    transition: transform 0.3s cubic-bezier(0.2,1,0.3,1), box-shadow 0.3s;
  }
  .btn-fill:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.45); }
  .btn-outline {
    padding: 16px 40px; border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.5); font-family: 'Overpass Mono', monospace;
    font-size: 9px; letter-spacing: 0.38em; text-transform: uppercase;
    text-decoration: none; background: transparent; cursor: pointer;
    transition: all 0.3s ease; display: inline-block;
  }
  .btn-outline:hover { border-color: #fff; color: #fff; background: rgba(255,255,255,0.04); }

  /* Progress bar */
  .progress-bar-wrap {
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: rgba(255,255,255,0.05);
  }
  .progress-bar-fill {
    height: 100%; transition: width 6.5s linear, background 0.8s ease;
  }

  /* Dots */
  .dots { position: absolute; bottom: 42px; left: 6vw; display: flex; gap: 10px; align-items: center; }
  @media (max-width: 768px) { .dots { bottom: 32px; left: 7vw; } }
  .dot { height: 2px; cursor: pointer; transition: all 0.6s cubic-bezier(0.4,0,0.2,1); }

  /* Archive count badge */
  .archive-badge {
    display: inline-flex; align-items: center; gap: 8px;
    margin-bottom: 20px;
    padding: 5px 12px; border: 1px solid rgba(255,255,255,0.07);
    background: rgba(255,255,255,0.03);
    font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); width: fit-content;
    transition: border-color 0.8s;
  }
  .archive-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  /* Keyboard hint */
  .kb-hint {
    position: absolute; bottom: 44px; right: 28px;
    font-size: 7.5px; letter-spacing: 0.4em; text-transform: uppercase;
    color: rgba(255,255,255,0.12); display: flex; align-items: center; gap: 8px;
  }
  .kb-key {
    display: inline-flex; align-items: center; justify-content: center;
    width: 20px; height: 20px;
    border: 1px solid rgba(255,255,255,0.12);
    font-size: 10px; color: rgba(255,255,255,0.2);
  }

  /* ── RIGHT PANEL ── */
  .right-panel {
    position: relative; overflow: hidden;
    border-left: 1px solid rgba(255,255,255,0.05);
  }
  @media (max-width: 768px) {
    .right-panel { height: 44vh; min-height: 300px; width: 100%;
      border-left: none; border-bottom: 1px solid rgba(255,255,255,0.05); }
  }
  .grid-lines {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.016) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.016) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .right-label {
    position: absolute; bottom: 28px; right: 28px; z-index: 40;
    font-size: 8px; letter-spacing: 0.6em; text-transform: uppercase;
    transition: color 0.8s ease, opacity 0.4s;
  }
  .scene-hint {
    position: absolute; bottom: 22px; left: 28px; z-index: 40;
    font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.1);
  }
  /* model count, top right of 3D panel */
  .model-badge {
    position: absolute; top: 24px; right: 24px; z-index: 40;
    font-size: 7.5px; letter-spacing: 0.42em; text-transform: uppercase;
    padding: 5px 12px; border: 1px solid rgba(255,255,255,0.07);
    background: rgba(8,7,5,0.6); backdrop-filter: blur(8px);
    transition: color 0.8s, border-color 0.8s;
  }

  /* slide-in animations */
  .fi { opacity: 0; transform: translateY(20px); animation: fadeUp 0.8s ease forwards; }
  .fd1 { animation-delay: 0.08s; } .fd2 { animation-delay: 0.18s; }
  .fd3 { animation-delay: 0.28s; } .fd4 { animation-delay: 0.36s; }
  .fd5 { animation-delay: 0.44s; } .fd6 { animation-delay: 0.52s; }
  @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
`;

/* ══════════════════════════════════════════════════
   HERO COMPONENT
══════════════════════════════════════════════════ */
const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const progRef = useRef(null);

  const goTo = useCallback((index) => {
    if (index === current || transitioning) return;
    setTransitioning(true);
    setProgress(0);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 450);
  }, [current, transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  // Auto-advance + progress bar
  useEffect(() => {
    setProgress(0);
    const iv = setInterval(next, 6500);
    // Animate progress bar from 0→100 over 6.5s
    const start = performance.now();
    const animProg = (now) => {
      const pct = Math.min(((now - start) / 6500) * 100, 100);
      setProgress(pct);
      if (pct < 100) progRef.current = requestAnimationFrame(animProg);
    };
    progRef.current = requestAnimationFrame(animProg);
    return () => { clearInterval(iv); cancelAnimationFrame(progRef.current); };
  }, [current, next]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo((current - 1 + slides.length) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, next, goTo]);

  const slide = slides[current];

  const fade = (extra = 0) => ({
    opacity: transitioning ? 0 : 1,
    transform: `translateY(${transitioning ? 10 + extra : 0}px)`,
    transition: `opacity 0.4s ease ${extra * 0.01}s, transform 0.4s ease ${extra * 0.01}s`,
  });

  return (
    <>
      <style>{STYLES}</style>
      <div className="hero-root">
        <section className="hero-section">

          {/* LEFT */}
          <div className="left-panel">

            {/* Vertical category ticker */}
            <div className="cat-ticker">
              {slides.map((s, i) => (
                <div key={s.category} className="cat-tick-item"
                  style={{ color: i === current ? s.accent : 'rgba(255,255,255,0.18)' }}
                  onClick={() => goTo(i)}>
                  {s.category}
                </div>
              ))}
            </div>

            <div style={{ paddingLeft: 32 }}>
              <div className="counter fi fd1">
                <div style={{ width:32, height:1, background: slide.accent, transition:'background 0.8s', flexShrink:0 }} />
                <span>0{current+1} — 0{slides.length}</span>
              </div>

              {/* Archive badge */}
              <div className="archive-badge fi fd2" style={{ borderColor: `${slide.accent}33`, transition:'border-color 0.8s' }}>
                <div className="archive-badge-dot" style={{ background: slide.accent, transition:'background 0.8s' }} />
                {slide.count} Objects · {slide.label}
              </div>

              <div className="eyebrow fi fd2" style={{ color: slide.accent, ...fade(5) }}>
                {slide.category} Collection
              </div>

              <h1 className="headline fi fd3" style={fade(10)}>
                Everything for<br />
                <em>Modern Living.</em>
              </h1>

              <p className="tagline-line fi fd4" style={{ opacity: transitioning ? 0 : 1, transition:'opacity 0.4s ease 0.08s' }}>
                {slide.tagline}
              </p>

              <p className="subline fi fd4" style={{ opacity: transitioning ? 0 : 1, transition:'opacity 0.4s ease 0.1s' }}>
                Artisan groceries, curated tech, slow-fashion, and bespoke furniture —
                an intentional archive for every aspect of your day.
              </p>

              <div className="cta-row fi fd5">
                <Link to="/shop">
                  <button className="btn-fill" style={{ background: slide.accent, transition:'background 0.8s' }}>
                    Browse Collection
                  </button>
                </Link>
                <Link to="/categories">
                  <button className="btn-outline">View Categories</button>
                </Link>
              </div>
            </div>

            {/* Dots */}
            <div className="dots">
              {slides.map((_, i) => (
                <div key={i} className="dot" style={{
                  width: i === current ? '44px' : '14px',
                  background: i === current ? slide.accent : 'rgba(255,255,255,0.14)',
                }} onClick={() => goTo(i)} />
              ))}
            </div>

            {/* Keyboard hint */}
            <div className="kb-hint">
              <span className="kb-key">←</span>
              <span className="kb-key">→</span>
              <span>Navigate</span>
            </div>

            {/* Progress bar */}
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width:`${progress}%`, background: slide.accent }} />
            </div>
          </div>

          {/* RIGHT — 3D */}
          <div className="right-panel">
            <div style={{
              position:'absolute', inset:0, zIndex:1,
              background: slide.bg,
              transition:'background 1s cubic-bezier(0.4,0,0.2,1)',
            }} />
            <div className="grid-lines" />

            <div style={{ position:'absolute', inset:0, zIndex:10 }}>
              <ThreeScene slide={slide} transitioning={transitioning} />
            </div>

            <LiveClock accent={slide.accent} />

            <div className="model-badge" style={{ color: slide.accent, borderColor:`${slide.accent}30` }}>
              3D Preview
            </div>

            <div className="right-label" style={{ color: slide.accent, opacity: transitioning ? 0 : 1, transition:'color 0.8s, opacity 0.4s' }}>
              {slide.label}
            </div>

            <div className="scene-hint">Move cursor to interact · ↑↓ for parallax</div>
          </div>

        </section>
      </div>
    </>
  );
};

export default Hero;