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
    bg: "radial-gradient(ellipse at 65% 40%, rgba(201,169,110,0.18) 0%, rgba(201,169,110,0.04) 45%, transparent 70%)",
    scene: "fashion",
    tagline: "Wear the archive.",
    stat: "2,400+ styles curated",
  },
  {
    category: "Electronics",
    label: "Tech & Gadgets",
    count: 15,
    accent: "#6EC9C9",
    accentRGB: [0.431, 0.788, 0.788],
    bg: "radial-gradient(ellipse at 65% 40%, rgba(110,201,201,0.18) 0%, rgba(110,201,201,0.04) 45%, transparent 70%)",
    scene: "electronics",
    tagline: "Signal intelligence.",
    stat: "4,100+ devices stocked",
  },
  {
    category: "Furniture",
    label: "Home & Living",
    count: 15,
    accent: "#C9A07E",
    accentRGB: [0.788, 0.627, 0.494],
    bg: "radial-gradient(ellipse at 65% 40%, rgba(201,160,126,0.18) 0%, rgba(201,160,126,0.04) 45%, transparent 70%)",
    scene: "furniture",
    tagline: "Space as language.",
    stat: "1,800+ home pieces",
  },
  {
    category: "Groceries",
    label: "Artisan & Fresh",
    count: 15,
    accent: "#7EBF7A",
    accentRGB: [0.494, 0.749, 0.478],
    bg: "radial-gradient(ellipse at 65% 40%, rgba(126,191,122,0.18) 0%, rgba(126,191,122,0.04) 45%, transparent 70%)",
    scene: "groceries",
    tagline: "Taste with intention.",
    stat: "890+ artisan goods",
  },
];

/* ══════════════════════════════════════════════════
   MATERIAL HELPERS
══════════════════════════════════════════════════ */
const mat = (color, rough = 0.3, metal = 0.6) =>
  new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: rough, metalness: metal });

const wireMat = (color, opacity = 0.1) =>
  new THREE.MeshBasicMaterial({ color: new THREE.Color(color), wireframe: true, transparent: true, opacity });

const glassMat = (color, opacity = 0.75) =>
  new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.02, metalness: 0.05, transparent: true, opacity });

function makeRing(accentHex, radius = 1.6, tube = 0.008, tiltX = 0.7, tiltZ = 0.3) {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 8, 120),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(accentHex), transparent: true, opacity: 0.5 })
  );
  ring.rotation.x = tiltX;
  ring.rotation.z = tiltZ;
  return ring;
}

function makeGhost(source, accentHex, scale = 1.22) {
  const ghost = source.clone();
  ghost.scale.setScalar(scale);
  ghost.traverse(child => {
    if (child.isMesh) child.material = wireMat(accentHex, 0.07);
  });
  return ghost;
}

function makeParticles(accentRGB, count = 350) {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random()-0.5)*22;
    pos[i*3+1] = (Math.random()-0.5)*14;
    pos[i*3+2] = (Math.random()-0.5)*12 - 2;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({
    color: new THREE.Color(...accentRGB),
    size: 0.028, transparent: true, opacity: 0.6, sizeAttenuation: true,
  }));
}

function makeGround() {
  const g = new THREE.Mesh(
    new THREE.PlaneGeometry(32, 16),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(0x000000), roughness: 0.02, metalness: 0.98 })
  );
  g.rotation.x = -Math.PI/2;
  g.position.y = -2.2;
  return g;
}

function makeGridFloor(accentHex) {
  const g = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 14, 26, 14),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(accentHex), wireframe: true, transparent: true, opacity: 0.055 })
  );
  g.rotation.x = -Math.PI/2;
  g.position.y = -2.18;
  return g;
}

function makeDataLines(accentHex) {
  const group = new THREE.Group();
  const col = new THREE.Color(accentHex);
  for (let i = 0; i < 8; i++) {
    const h = Math.random() * 1.8 + 0.4;
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(0.005, h, 0.005),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.12 + Math.random()*0.14 })
    );
    bar.position.set((Math.random()-0.5)*10, -2.2 + h/2, (Math.random()-0.5)*4 - 1);
    group.add(bar);
  }
  return group;
}

/* ══════════════════════════════════════════════════
   MODELS — FASHION
══════════════════════════════════════════════════ */
function makeTShirt(accentHex) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex);
  const dark = col.clone().multiplyScalar(0.45);
  const highlight = col.clone().multiplyScalar(1.2);
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.5, 0.3), mat(col, 0.85, 0.05));
  body.position.set(0, -0.25, 0); g.add(body);
  const stitch = new THREE.Mesh(new THREE.BoxGeometry(0.015, 2.4, 0.01), mat(dark, 0.9, 0));
  stitch.position.set(0, -0.25, 0.152); g.add(stitch);
  const sl = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.58, 0.27), mat(col, 0.85, 0.05));
  sl.position.set(-1.45, 0.9, 0); sl.rotation.z = -0.4; g.add(sl);
  const sr = sl.clone(); sr.position.set(1.45, 0.9, 0); sr.rotation.z = 0.4; g.add(sr);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.4, 0.3, 24, 1, true), mat(dark, 0.85, 0));
  collar.position.set(0, 1.08, 0); g.add(collar);
  const hem = new THREE.Mesh(new THREE.BoxGeometry(2.06, 0.1, 0.32), mat(dark, 0.9, 0));
  hem.position.set(0, -1.5, 0); g.add(hem);
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.42, 0.04), mat(dark, 0.85, 0));
  pocket.position.set(-0.56, 0.28, 0.16); g.add(pocket);
  const pocketLine = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.01, 0.01), mat(highlight, 0.5, 0.5));
  pocketLine.position.set(-0.56, 0.49, 0.16); g.add(pocketLine);
  return g;
}

function makeSneaker(accentHex, s = 1) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex);
  const soleCol = new THREE.Color(0x0d0d0d);
  const white = new THREE.Color(0xf5f5f5);
  const sole = new THREE.Mesh(new THREE.BoxGeometry(1.9*s, 0.28*s, 0.75*s), mat(soleCol, 0.7, 0.05));
  sole.position.set(0, -0.5*s, 0); g.add(sole);
  const mid = new THREE.Mesh(new THREE.BoxGeometry(1.9*s, 0.1*s, 0.76*s), mat(col.clone().multiplyScalar(0.6), 0.6, 0.1));
  mid.position.set(0, -0.32*s, 0); g.add(mid);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(1.62*s, 0.6*s, 0.65*s), mat(col, 0.65, 0.05));
  upper.position.set(-0.04*s, -0.08*s, 0); g.add(upper);
  const toe = new THREE.Mesh(new THREE.SphereGeometry(0.34*s, 20, 14), mat(col.clone().multiplyScalar(0.85), 0.55, 0.05));
  toe.position.set(0.74*s, -0.1*s, 0); toe.scale.set(1.0, 0.72, 0.92); g.add(toe);
  const heel = new THREE.Mesh(new THREE.BoxGeometry(0.42*s, 0.46*s, 0.65*s), mat(col.clone().multiplyScalar(1.05), 0.65, 0.05));
  heel.position.set(-0.66*s, -0.2*s, 0); g.add(heel);
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.4*s, 0.6*s, 0.06*s), mat(white, 0.85, 0));
  tongue.position.set(-0.1*s, 0.14*s, 0.34*s); g.add(tongue);
  for (let i = 0; i < 3; i++) {
    const lace = new THREE.Mesh(new THREE.BoxGeometry(0.5*s, 0.018*s, 0.01*s), mat(white, 0.9, 0));
    lace.position.set(-0.1*s, 0.05*s + i*0.1*s, 0.38*s); g.add(lace);
  }
  return g;
}

function makeWatch(accentHex, s = 1) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex);
  const silver = new THREE.Color(0x999999);
  const black = new THREE.Color(0x050505);
  const caseM = new THREE.Mesh(new THREE.CylinderGeometry(0.4*s, 0.4*s, 0.13*s, 48), mat(silver, 0.08, 0.95));
  caseM.rotation.x = Math.PI/2; g.add(caseM);
  const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.4*s, 0.04*s, 8, 48), mat(silver.clone().multiplyScalar(1.1), 0.05, 0.98));
  bezel.rotation.x = Math.PI/2; bezel.position.z = 0.05*s; g.add(bezel);
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.35*s, 0.35*s, 0.06*s, 48), mat(black, 0.3, 0.1));
  dial.rotation.x = Math.PI/2; dial.position.z = 0.045*s; g.add(dial);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.32*s, 0.022*s, 8, 48), mat(col, 0.15, 0.85));
  ring.rotation.x = Math.PI/2; ring.position.z = 0.075*s; g.add(ring);
  for (let i = 0; i < 12; i++) {
    const angle = (i/12) * Math.PI * 2;
    const marker = new THREE.Mesh(new THREE.BoxGeometry(0.015*s, 0.06*s, 0.01*s), mat(col, 0.2, 0.8));
    marker.position.set(Math.sin(angle)*0.27*s, Math.cos(angle)*0.27*s, 0.08*s);
    g.add(marker);
  }
  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.025*s, 0.28*s, 0.018*s), mat(col, 0.15, 0.9));
  minHand.position.set(0, 0.1*s, 0.1*s); g.add(minHand);
  const hrHand = new THREE.Mesh(new THREE.BoxGeometry(0.03*s, 0.2*s, 0.018*s), mat(new THREE.Color(0xffffff), 0.15, 0.7));
  hrHand.position.set(0.03*s, 0.07*s, 0.1*s); hrHand.rotation.z = 1.0; g.add(hrHand);
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.04*s, 0.035*s, 0.12*s, 12), mat(silver, 0.1, 0.9));
  crown.rotation.z = Math.PI/2; crown.position.set(0.44*s, 0, 0); g.add(crown);
  [-1, 1].forEach(sign => {
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.55*s, 0.72*s, 0.06*s), mat(new THREE.Color(0x080808), 0.95, 0));
    strap.rotation.x = Math.PI/2; strap.position.z = sign * 0.5*s; g.add(strap);
  });
  return g;
}

/* ══════════════════════════════════════════════════
   MODELS — ELECTRONICS
══════════════════════════════════════════════════ */
function makeSmartphone(accentHex) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex);
  const titanium = new THREE.Color(0x1a1a1a);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(1.14, 2.26, 0.12), mat(titanium, 0.06, 0.96));
  g.add(frame);
  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.02, 2.06, 0.055), glassMat(col.clone().multiplyScalar(0.25), 0.92));
  screen.position.z = 0.04; g.add(screen);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 1.9), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.2 }));
  glow.position.z = 0.065; g.add(glow);
  const island = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.075, 0.02), mat(titanium, 0.05, 0.9));
  island.position.set(0, 0.94, 0.065); g.add(island);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.015), mat(col, 0.15, 0.8));
  bar.position.set(0, -0.95, 0.065); g.add(bar);
  const btn1 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.22, 0.055), mat(titanium.clone().multiplyScalar(1.2), 0.08, 0.95));
  btn1.position.set(0.585, 0.18, 0); g.add(btn1);
  const btn2 = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.14, 0.055), mat(titanium.clone().multiplyScalar(1.2), 0.08, 0.95));
  btn2.position.set(0.585, -0.08, 0); g.add(btn2);
  const camIsland = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.035), mat(new THREE.Color(0x0a0a0a), 0.08, 0.92));
  camIsland.position.set(0.22, 0.88, -0.07); g.add(camIsland);
  [[-0.09, 0.09], [0.09, 0.09], [-0.09, -0.06]].forEach(([cx, cy]) => {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.025, 32), mat(new THREE.Color(0x020202), 0.02, 0.3));
    lens.rotation.x = Math.PI/2; lens.position.set(0.22+cx, 0.88+cy, -0.093); g.add(lens);
    const lensRing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.01, 8, 32), mat(titanium.clone().multiplyScalar(0.8), 0.05, 0.95));
    lensRing.rotation.x = Math.PI/2; lensRing.position.set(0.22+cx, 0.88+cy, -0.082); g.add(lensRing);
  });
  return g;
}

function makeLaptop(accentHex, s = 1) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex);
  const aluminum = new THREE.Color(0x1c1c1c);
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.3*s, 0.09*s, 1.55*s), mat(aluminum, 0.1, 0.9));
  base.position.y = -0.045*s; g.add(base);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(2.1*s, 0.01*s, 1.2*s), mat(new THREE.Color(0x141414), 0.3, 0.5));
  deck.position.set(0, 0, 0.12*s); g.add(deck);
  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.75*s, 0.01*s, 0.48*s), mat(new THREE.Color(0x111111), 0.08, 0.6));
  pad.position.set(0, 0.01, 0.52*s); g.add(pad);
  const lid = new THREE.Group();
  const lidBody = new THREE.Mesh(new THREE.BoxGeometry(2.3*s, 1.5*s, 0.075*s), mat(aluminum, 0.1, 0.9));
  lid.add(lidBody);
  const scr = new THREE.Mesh(new THREE.BoxGeometry(2.1*s, 1.35*s, 0.04*s), glassMat(col.clone().multiplyScalar(0.28), 0.95));
  scr.position.z = 0.058*s; lid.add(scr);
  const scrGlow = new THREE.Mesh(new THREE.PlaneGeometry(2.0*s, 1.28*s), new THREE.MeshBasicMaterial({ color: new THREE.Color(accentHex), transparent: true, opacity: 0.12 }));
  scrGlow.position.z = 0.075*s; lid.add(scrGlow);
  const notch = new THREE.Mesh(new THREE.BoxGeometry(0.22*s, 0.055*s, 0.02*s), mat(new THREE.Color(0x050505), 0.1, 0.5));
  notch.position.set(0, 0.72*s, 0.07*s); lid.add(notch);
  lid.position.set(0, 0.06*s, -0.78*s); lid.rotation.x = -1.88; g.add(lid);
  const hinge = new THREE.Mesh(new THREE.BoxGeometry(2.3*s, 0.05*s, 0.05*s), mat(aluminum.clone().multiplyScalar(1.3), 0.05, 0.98));
  hinge.position.set(0, 0, -0.78*s); g.add(hinge);
  return g;
}

function makeAirpods(accentHex, s = 1) {
  const g = new THREE.Group();
  const white = new THREE.Color(0xf2f2f2);
  const accent = new THREE.Color(accentHex);
  const makeEarbud = (side) => {
    const eb = new THREE.Group();
    const pod = new THREE.Mesh(new THREE.SphereGeometry(0.23*s, 24, 18), mat(white, 0.08, 0.05));
    pod.scale.set(1, 1.12, 0.88); eb.add(pod);
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.14*s, 16, 12), mat(new THREE.Color(0xdddddd), 0.3, 0));
    mesh.position.set(0, -0.1*s, 0.12*s); mesh.scale.set(1, 0.5, 0.3); eb.add(mesh);
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.058*s, 0.05*s, 0.58*s, 16), mat(white, 0.08, 0.05));
    stem.position.y = -0.42*s; eb.add(stem);
    const stemAccent = new THREE.Mesh(new THREE.CylinderGeometry(0.015*s, 0.015*s, 0.12*s, 12), mat(accent, 0.1, 0.85));
    stemAccent.position.set(0, -0.62*s, 0); eb.add(stemAccent);
    eb.position.set(side * 0.56*s, 0, 0); eb.rotation.z = side * 0.28;
    return eb;
  };
  g.add(makeEarbud(-1)); g.add(makeEarbud(1));
  const caseBody = new THREE.Mesh(new THREE.BoxGeometry(1.22*s, 0.56*s, 0.72*s), mat(white, 0.06, 0.05));
  caseBody.position.y = -1.0*s; g.add(caseBody);
  const caseLid = new THREE.Mesh(new THREE.BoxGeometry(1.22*s, 0.34*s, 0.72*s), mat(white.clone().multiplyScalar(0.94), 0.06, 0.05));
  caseLid.position.set(0, -0.45*s, 0); caseLid.rotation.x = -0.55; g.add(caseLid);
  const led = new THREE.Mesh(new THREE.SphereGeometry(0.035*s, 12, 10), new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: 0.8 }));
  led.position.set(0, -0.72*s, 0.37*s); g.add(led);
  return g;
}

/* ══════════════════════════════════════════════════
   MODELS — FURNITURE
══════════════════════════════════════════════════ */
function makeChair(accentHex) {
  const g = new THREE.Group();
  const wood = new THREE.Color(accentHex);
  const dark = wood.clone().multiplyScalar(0.45);
  const pad = new THREE.Color(0x0a0a09);
  const metal = new THREE.Color(0x777777);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.1, 1.65), mat(wood, 0.65, 0.05));
  seat.position.y = 0.32; g.add(seat);
  const cush = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 1.5), mat(pad, 0.9, 0));
  cush.position.y = 0.43; g.add(cush);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.65, 1.55, 0.1), mat(wood, 0.65, 0.05));
  back.position.set(0, 1.18, -0.78); g.add(back);
  const backCush = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.4, 0.1), mat(pad, 0.9, 0));
  backCush.position.set(0, 1.18, -0.72); g.add(backCush);
  [[-0.66,-0.66],[0.66,-0.66],[-0.66,0.66],[0.66,0.66]].forEach(([x,z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.38, 16), mat(dark, 0.55, 0.15));
    leg.position.set(x, -0.32, z); g.add(leg);
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), mat(metal, 0.1, 0.85));
    foot.position.set(x, -1.01, z); g.add(foot);
  });
  [-0.9, 0.9].forEach(x => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 1.15), mat(wood, 0.65, 0.05));
    arm.position.set(x, 0.8, 0.1); g.add(arm);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.48, 0.07), mat(dark, 0.55, 0.15));
    post.position.set(x, 0.56, 0.58); g.add(post);
  });
  return g;
}

function makeSofa(accentHex) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex).multiplyScalar(0.55);
  const dark = col.clone().multiplyScalar(0.55);
  const piping = new THREE.Color(accentHex).multiplyScalar(0.8);
  const legCol = new THREE.Color(0x8a8a8a);
  const body = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.72, 1.35), mat(col, 0.92, 0));
  body.position.y = 0.06; g.add(body);
  const back = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.9, 0.4), mat(col, 0.92, 0));
  back.position.set(0, 0.74, -0.47); g.add(back);
  [-1.05, 0, 1.05].forEach(x => {
    const cush = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.25, 1.14), mat(dark, 0.92, 0));
    cush.position.set(x, 0.49, 0.04); g.add(cush);
    const pip = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.25, 1.15), mat(piping, 0.4, 0.2));
    pip.position.set(x+0.49, 0.49, 0.04); g.add(pip);
  });
  [-1.05, 0, 1.05].forEach(x => {
    const bc = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.78, 0.32), mat(dark, 0.92, 0));
    bc.position.set(x, 0.74, -0.44); g.add(bc);
  });
  [-1.73, 1.73].forEach(x => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.82, 1.35), mat(col, 0.92, 0));
    arm.position.set(x, 0.31, 0); g.add(arm);
    const armTop = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 1.3), mat(dark, 0.9, 0));
    armTop.position.set(x, 0.73, 0); g.add(armTop);
  });
  [[-1.35,-0.52],[0,-0.52],[1.35,-0.52],[-1.35,0.52],[0,0.52],[1.35,0.52]].forEach(([x,z]) => {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.055, 0.44, 14), mat(legCol, 0.08, 0.88));
    l.position.set(x, -0.35, z); g.add(l);
  });
  return g;
}

function makeLamp(accentHex, s = 1) {
  const g = new THREE.Group();
  const col = new THREE.Color(accentHex);
  const brass = new THREE.Color(0x8a7a4a);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.44*s, 0.5*s, 0.1*s, 32), mat(brass, 0.15, 0.82));
  base.position.y = -1.1*s; g.add(base);
  const mid = new THREE.Mesh(new THREE.SphereGeometry(0.22*s, 24, 18), mat(brass, 0.12, 0.85));
  mid.position.y = -0.6*s; mid.scale.set(1, 0.7, 1); g.add(mid);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.032*s, 0.038*s, 1.85*s, 16), mat(brass, 0.12, 0.88));
  pole.position.y = -0.02*s; g.add(pole);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.025*s, 0.025*s, 0.55*s, 12), mat(brass, 0.12, 0.88));
  arm.rotation.z = 0.3; arm.position.set(0.12*s, 0.9*s, 0); g.add(arm);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.62*s, 0.7*s, 32, 1, true), mat(col, 0.75, 0));
  shade.position.y = 0.92*s; g.add(shade);
  const shadeRim = new THREE.Mesh(new THREE.TorusGeometry(0.62*s, 0.018*s, 8, 32), mat(brass, 0.1, 0.85));
  shadeRim.position.y = 0.58*s; g.add(shadeRim);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.11*s, 16, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.92, 0.65), transparent: true, opacity: 0.95 }));
  bulb.position.y = 0.72*s; g.add(bulb);
  return g;
}

/* ══════════════════════════════════════════════════
   MODELS — GROCERIES
══════════════════════════════════════════════════ */
function makeApple(accentHex, s = 1) {
  const g = new THREE.Group();
  const red = new THREE.Color(accentHex);
  const dark = red.clone().multiplyScalar(0.65);
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.74*s, 36, 30), mat(red, 0.4, 0));
  body.scale.y = 0.9; g.add(body);
  const shine = new THREE.Mesh(new THREE.SphereGeometry(0.22*s, 16, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color(1,1,1), transparent: true, opacity: 0.06 }));
  shine.position.set(-0.2*s, 0.2*s, 0.5*s); g.add(shine);
  const indent = new THREE.Mesh(new THREE.SphereGeometry(0.2*s, 14, 12), mat(dark, 0.6, 0));
  indent.position.y = 0.6*s; indent.scale.y = 0.35; g.add(indent);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.022*s, 0.028*s, 0.3*s, 10), mat(new THREE.Color(0x4a2c0a), 0.88, 0));
  stem.position.y = 0.74*s; g.add(stem);
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0,0); leafShape.bezierCurveTo(0.12,0.16,0.22,0.12,0.18,-0.08); leafShape.bezierCurveTo(0.08,-0.04,0,0.04,0,0);
  const leaf = new THREE.Mesh(new THREE.ShapeGeometry(leafShape, 10), mat(new THREE.Color(0x2a6e20), 0.75, 0));
  leaf.position.set(0.04*s, 0.88*s, 0); leaf.rotation.z = 0.35; leaf.scale.setScalar(s*1.1); g.add(leaf);
  return g;
}

function makeOliveOil(accentHex, s = 1) {
  const g = new THREE.Group();
  const glass = new THREE.Color(accentHex).lerp(new THREE.Color(0x1e3d0d), 0.65);
  const label = new THREE.Color(accentHex).multiplyScalar(1.1);
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.36*s, 0.31*s, 1.24*s, 32), glassMat(glass, 0.8)));
  const shoulder = new THREE.Mesh(new THREE.CylinderGeometry(0.19*s, 0.36*s, 0.38*s, 32), glassMat(glass, 0.8));
  shoulder.position.y = 0.81*s; g.add(shoulder);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1*s, 0.19*s, 0.28*s, 20), glassMat(glass, 0.8));
  neck.position.y = 1.1*s; g.add(neck);
  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.1*s, 0.1*s, 0.06*s, 20), mat(glass, 0.1, 0.2));
  lip.position.y = 1.26*s; g.add(lip);
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.095*s, 0.098*s, 0.18*s, 16), mat(new THREE.Color(0xa07020), 0.88, 0));
  cork.position.y = 1.34*s; g.add(cork);
  const labelMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.37*s, 0.32*s, 0.58*s, 32), mat(label, 0.7, 0));
  labelMesh.position.y = -0.08*s; g.add(labelMesh);
  return g;
}

function makeJar(accentHex, s = 1) {
  const g = new THREE.Group();
  const glass = new THREE.Color(accentHex).multiplyScalar(0.55);
  const fill = new THREE.Color(accentHex).multiplyScalar(0.85);
  g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.44*s, 0.4*s, 1.05*s, 32), glassMat(glass, 0.7)));
  const content = new THREE.Mesh(new THREE.CylinderGeometry(0.4*s, 0.37*s, 0.75*s, 28), mat(fill, 0.55, 0));
  content.position.y = -0.12*s; g.add(content);
  const lidM = new THREE.Mesh(new THREE.CylinderGeometry(0.46*s, 0.46*s, 0.2*s, 32), mat(new THREE.Color(0x777777), 0.15, 0.85));
  lidM.position.y = 0.63*s; g.add(lidM);
  const lidRim = new THREE.Mesh(new THREE.TorusGeometry(0.46*s, 0.028*s, 8, 32), mat(new THREE.Color(0x666666), 0.1, 0.88));
  lidRim.position.y = 0.52*s; g.add(lidRim);
  const labelMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.45*s, 0.41*s, 0.4*s, 32), mat(new THREE.Color(accentHex).multiplyScalar(1.2), 0.65, 0));
  labelMesh.position.y = 0.05*s; g.add(labelMesh);
  return g;
}

function makeBread(s = 1) {
  const g = new THREE.Group();
  const crust = new THREE.Color(0xb87818);
  const inner = new THREE.Color(0xf0c860);
  const dark = crust.clone().multiplyScalar(0.7);
  g.add(new THREE.Mesh(new THREE.BoxGeometry(1.45*s, 0.8*s, 0.72*s), mat(crust, 0.92, 0)));
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.54*s, 24, 16), mat(crust.clone().multiplyScalar(0.9), 0.92, 0));
  dome.position.y = 0.32*s; dome.scale.set(1.34, 0.62, 0.7); g.add(dome);
  [-0.25*s, 0, 0.25*s].forEach(x => {
    const cut = new THREE.Mesh(new THREE.BoxGeometry(0.032*s, 0.1*s, 0.68*s), mat(inner, 0.88, 0));
    cut.position.set(x, 0.5*s, 0); g.add(cut);
  });
  const end1 = new THREE.Mesh(new THREE.BoxGeometry(0.08*s, 0.75*s, 0.72*s), mat(dark, 0.95, 0));
  end1.position.set(-0.685*s, 0, 0); g.add(end1);
  const end2 = end1.clone(); end2.position.set(0.685*s, 0, 0); g.add(end2);
  return g;
}

/* ══════════════════════════════════════════════════
   SCENE ASSEMBLER
══════════════════════════════════════════════════ */
function assembleScene(sceneName, accentRGB) {
  const accent = new THREE.Color(...accentRGB);
  const accentHex = `#${accent.getHexString()}`;
  const objects = [];
  const addObj = (mesh, pos, rx=0, ry=0, rz=0, ud={}) => {
    mesh.position.set(...pos); mesh.rotation.set(rx, ry, rz);
    mesh.userData = { rotY:0.006, rotX:0.001, floatAmp:0.22, floatSpeed:0.95, floatOffset:0, ...ud };
    objects.push(mesh); return mesh;
  };
  if (sceneName === "fashion") {
    addObj(makeTShirt(accentHex),       [0,0.1,0],        0,0.1,0,       {rotY:0.006,floatAmp:0.28,floatSpeed:0.88,floatOffset:0});
    addObj(makeSneaker(accentHex,0.7),  [-2.7,-1.0,0.3],  0,0.65,0,      {rotY:0.008,floatAmp:0.18,floatSpeed:1.18,floatOffset:1.1});
    addObj(makeSneaker(accentHex,0.6),  [2.5,-1.35,-0.2], 0,-0.75,0,     {rotY:0.007,floatAmp:0.16,floatSpeed:1.32,floatOffset:2.3});
    addObj(makeWatch(accentHex,0.88),   [2.1,1.2,0.5],    0.18,-0.5,0.28,{rotY:0.009,rotX:0.003,floatAmp:0.2,floatSpeed:1.08,floatOffset:3.1});
  }
  if (sceneName === "electronics") {
    addObj(makeSmartphone(accentHex),   [0.2,0.1,0],      0,0.05,0,      {rotY:0.006,rotX:0.002,floatAmp:0.26,floatSpeed:0.92,floatOffset:0});
    addObj(makeLaptop(accentHex,0.6),   [-2.5,-0.7,-0.4], 0,0.5,0,       {rotY:0.005,floatAmp:0.15,floatSpeed:1.08,floatOffset:1.8});
    addObj(makeAirpods(accentHex,0.82), [2.4,0.3,0.3],    0,-0.5,0.18,   {rotY:0.008,rotX:0.003,floatAmp:0.22,floatSpeed:1.22,floatOffset:0.7});
  }
  if (sceneName === "furniture") {
    addObj(makeSofa(accentHex),         [0,-0.55,0],      0,0.28,0,      {rotY:0.004,floatAmp:0.16,floatSpeed:0.82,floatOffset:0});
    addObj(makeChair(accentHex),        [-2.8,0.05,0.4],  0,0.78,0,      {rotY:0.006,floatAmp:0.18,floatSpeed:0.98,floatOffset:1.5});
    addObj(makeLamp(accentHex,0.68),    [2.7,0.25,0],     0,0,0,         {rotY:0.007,floatAmp:0.16,floatSpeed:1.12,floatOffset:1.2});
  }
  if (sceneName === "groceries") {
    addObj(makeApple(accentHex,1.32),     [0.2,0.22,0],     0,0.1,0,       {rotY:0.007,rotX:0.002,floatAmp:0.28,floatSpeed:0.98,floatOffset:0});
    addObj(makeOliveOil(accentHex,0.82),  [-2.4,-0.08,0.3], 0,0.58,0,      {rotY:0.005,floatAmp:0.18,floatSpeed:1.12,floatOffset:1.1});
    addObj(makeJar(accentHex,0.75),       [2.4,-0.28,0],    0,-0.5,0,      {rotY:0.006,floatAmp:0.18,floatSpeed:1.18,floatOffset:2.0});
    addObj(makeBread(0.7),                [1.1,-1.75,0.5],  0,-0.38,0,     {rotY:0.005,floatAmp:0.14,floatSpeed:1.28,floatOffset:2.8});
  }
  return objects;
}

/* ══════════════════════════════════════════════════
   THREE.JS SCENE
══════════════════════════════════════════════════ */
const ThreeScene = ({ slide, transitioning }) => {
  const mountRef      = useRef(null);
  const rendRef       = useRef(null);
  const camRef        = useRef(null);
  const sceneRef      = useRef(null);
  const ptRef         = useRef(null);
  const frameRef      = useRef(null);
  const clockRef      = useRef(new THREE.Clock());
  const mouseRef      = useRef({ x:0, y:0 });
  const targetCam     = useRef({ x:0, y:0.5 });
  const introRef      = useRef({ active:true, t:0 });
  const accentLightRef = useRef(null);
  const rimLightRef   = useRef(null);

  useEffect(() => {
    const mount = mountRef.current; if (!mount) return;
    const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    mount.appendChild(renderer.domElement);
    rendRef.current = renderer;
    const camera = new THREE.PerspectiveCamera(44, mount.clientWidth/mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.5, 9.5); camRef.current = camera;
    const ro = new ResizeObserver(() => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth/mount.clientHeight;
      camera.updateProjectionMatrix();
    });
    ro.observe(mount);
    const onMouse = e => {
      const rect = mount.getBoundingClientRect();
      mouseRef.current = { x:((e.clientX-rect.left)/rect.width-0.5)*2, y:-((e.clientY-rect.top)/rect.height-0.5)*2 };
    };
    mount.addEventListener('mousemove', onMouse);
    return () => {
      cancelAnimationFrame(frameRef.current); ro.disconnect();
      mount.removeEventListener('mousemove', onMouse);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const renderer = rendRef.current; const camera = camRef.current;
    if (!renderer || !camera) return;
    cancelAnimationFrame(frameRef.current);
    if (sceneRef.current) {
      sceneRef.current.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) [obj.material].flat().forEach(m => m.dispose());
      });
    }
    const scene = new THREE.Scene(); sceneRef.current = scene;
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(6, 10, 7); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.001; scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 0.5); fill.position.set(-6, 2, 4); scene.add(fill);
    const back = new THREE.DirectionalLight(0xffffff, 0.3); back.position.set(0, -2, -6); scene.add(back);
    const accentLight = new THREE.PointLight(new THREE.Color(...slide.accentRGB), 5.5, 24);
    accentLight.position.set(-3.5, 4, 5.5); scene.add(accentLight); accentLightRef.current = accentLight;
    const rim = new THREE.PointLight(new THREE.Color(...slide.accentRGB), 2.2, 16);
    rim.position.set(4, -3, -4); scene.add(rim); rimLightRef.current = rim;
    const top = new THREE.PointLight(0xffffff, 0.8, 20); top.position.set(0, 8, 0); scene.add(top);
    scene.add(makeGround());
    scene.add(makeGridFloor(slide.accent));
    scene.add(makeDataLines(slide.accent));
    const particles = makeParticles(slide.accentRGB, 350); scene.add(particles); ptRef.current = particles;
    const objects = assembleScene(slide.scene, slide.accentRGB);
    objects.forEach(obj => { obj.castShadow = true; obj.receiveShadow = true; scene.add(obj); });
    const rings = [];
    if (objects.length > 0) {
      const hero = objects[0];
      const r1 = makeRing(slide.accent,1.9,0.01,0.72,0.18); r1.position.copy(hero.position); scene.add(r1); rings.push({mesh:r1,speed:0.38,axis:'y'});
      const r2 = makeRing(slide.accent,2.5,0.006,1.25,-0.45); r2.position.copy(hero.position); scene.add(r2); rings.push({mesh:r2,speed:-0.22,axis:'x'});
      const r3 = makeRing(slide.accent,3.2,0.004,0.4,0.8); r3.position.copy(hero.position); scene.add(r3); rings.push({mesh:r3,speed:0.16,axis:'z'});
      const ghost = makeGhost(objects[0], slide.accent, 1.26); ghost.position.copy(hero.position); scene.add(ghost); objects[0].userData._ghost = ghost;
    }
    introRef.current = { active:true, t:0 };
    camera.position.set(0, 3.5, 15);
    clockRef.current = new THREE.Clock();
    objects.forEach(obj => { obj.userData._baseX = obj.position.x; obj.userData._baseY = obj.position.y; });
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();
      const mx = mouseRef.current.x; const my = mouseRef.current.y;
      if (introRef.current.active) {
        introRef.current.t = Math.min(introRef.current.t + 0.01, 1);
        const p = 1 - Math.pow(1 - introRef.current.t, 3.5);
        camera.position.z = 15 - p*5.5; camera.position.y = 3.5 - p*3;
        if (introRef.current.t >= 1) introRef.current.active = false;
      } else {
        targetCam.current.x += (mx*0.8 - targetCam.current.x) * 0.035;
        targetCam.current.y += (0.5 + my*0.45 - targetCam.current.y) * 0.035;
        camera.position.x += (targetCam.current.x - camera.position.x) * 0.035;
        camera.position.y += (targetCam.current.y - camera.position.y) * 0.035;
      }
      camera.lookAt(0, 0, 0);
      if (accentLightRef.current) accentLightRef.current.intensity = 5.0 + Math.sin(t*1.6)*1.2;
      if (rimLightRef.current)    rimLightRef.current.intensity    = 2.0 + Math.cos(t*2.2)*0.6;
      objects.forEach(obj => {
        const {rotY=0.006,rotX=0.001,floatAmp=0.22,floatSpeed=0.95,floatOffset=0,_baseX=0,_baseY=0,_ghost} = obj.userData;
        obj.rotation.y += rotY + mx*0.0006; obj.rotation.x += rotX + my*0.0003;
        obj.position.y = _baseY + Math.sin(t*floatSpeed+floatOffset)*floatAmp;
        obj.position.x = _baseX + Math.sin(t*floatSpeed*0.35+floatOffset)*floatAmp*0.08;
        if (_ghost) { _ghost.position.copy(obj.position); _ghost.rotation.copy(obj.rotation); _ghost.rotation.y += t*0.12; }
      });
      if (objects.length > 0) {
        const hero = objects[0];
        rings.forEach(({mesh,speed,axis}) => {
          mesh.position.copy(hero.position);
          if (axis==='y') mesh.rotation.y += speed*0.01;
          else if (axis==='x') mesh.rotation.x += speed*0.01;
          else mesh.rotation.z += speed*0.01;
        });
      }
      if (ptRef.current) { ptRef.current.rotation.y = t*0.012; ptRef.current.rotation.x = Math.sin(t*0.07)*0.035; }
      renderer.render(scene, camera);
    };
    animate();
    return () => cancelAnimationFrame(frameRef.current);
  }, [slide]);

  return (
    <div ref={mountRef} style={{ position:'absolute', inset:0, opacity:transitioning?0:1, transition:'opacity 0.5s ease' }} />
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
  const pad = n => String(n).padStart(2, '0');
  return (
    <div style={{ position:'absolute', top:22, left:26, zIndex:40, fontFamily:"'Overpass Mono',monospace", fontSize:'8px', letterSpacing:'0.4em', textTransform:'uppercase', color:accent, opacity:0.65, transition:'color 0.8s' }}>
      {pad(time.getHours())}:{pad(time.getMinutes())}:{pad(time.getSeconds())}
    </div>
  );
};

/* ══════════════════════════════════════════════════
   SVG DECORATIONS
══════════════════════════════════════════════════ */
const SVGCornerTL = ({ accent }) => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ position:'absolute', top:0, left:0, opacity:0.4, pointerEvents:'none', zIndex:30 }}>
    <path d="M0 56 L0 0 L56 0" stroke={accent} strokeWidth="0.8" fill="none"/>
    <circle cx="0" cy="0" r="3.5" fill={accent} opacity="0.8"/>
    <path d="M12 0 L12 12 L0 12" stroke={accent} strokeWidth="0.4" fill="none" opacity="0.5"/>
  </svg>
);

const SVGCornerBR = ({ accent }) => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ position:'absolute', bottom:0, right:0, opacity:0.4, pointerEvents:'none', zIndex:30 }}>
    <path d="M56 0 L56 56 L0 56" stroke={accent} strokeWidth="0.8" fill="none"/>
    <circle cx="56" cy="56" r="3.5" fill={accent} opacity="0.8"/>
    <path d="M44 56 L44 44 L56 44" stroke={accent} strokeWidth="0.4" fill="none" opacity="0.5"/>
  </svg>
);

const SVGCornerTR = ({ accent }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ position:'absolute', top:0, right:0, opacity:0.25, pointerEvents:'none', zIndex:30 }}>
    <path d="M0 0 L40 0 L40 40" stroke={accent} strokeWidth="0.8" fill="none"/>
  </svg>
);

const SVGCornerBL = ({ accent }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" style={{ position:'absolute', bottom:0, left:0, opacity:0.25, pointerEvents:'none', zIndex:30 }}>
    <path d="M40 40 L0 40 L0 0" stroke={accent} strokeWidth="0.8" fill="none"/>
  </svg>
);

const SVGReticle = ({ accent }) => (
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none"
    style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', opacity:0.08, pointerEvents:'none', zIndex:30, animation:'reticleSpin 20s linear infinite' }}>
    <circle cx="30" cy="30" r="28" stroke={accent} strokeWidth="0.6" strokeDasharray="4 6"/>
    <circle cx="30" cy="30" r="20" stroke={accent} strokeWidth="0.4"/>
    <line x1="30" y1="0" x2="30" y2="10" stroke={accent} strokeWidth="0.8"/>
    <line x1="30" y1="50" x2="30" y2="60" stroke={accent} strokeWidth="0.8"/>
    <line x1="0" y1="30" x2="10" y2="30" stroke={accent} strokeWidth="0.8"/>
    <line x1="50" y1="30" x2="60" y2="30" stroke={accent} strokeWidth="0.8"/>
  </svg>
);

const SVGStamp = ({ accent }) => (
  <svg width="72" height="72" viewBox="0 0 80 80" fill="none"
    style={{ position:'absolute', bottom:56, right:28, opacity:0.14, transform:'rotate(-18deg)', pointerEvents:'none', zIndex:30 }}>
    <circle cx="40" cy="40" r="36" stroke={accent} strokeWidth="0.8"/>
    <circle cx="40" cy="40" r="29" stroke={accent} strokeWidth="0.4" strokeDasharray="2 3"/>
    <text x="40" y="37" textAnchor="middle" fill={accent} fontSize="6.5" fontFamily="'Overpass Mono',monospace" letterSpacing="3.5">VENDO</text>
    <text x="40" y="47" textAnchor="middle" fill={accent} fontSize="5" fontFamily="'Overpass Mono',monospace" letterSpacing="2">ARCHIVE</text>
    <text x="40" y="56" textAnchor="middle" fill={accent} fontSize="4" fontFamily="'Overpass Mono',monospace" letterSpacing="1.5">EST. 2024</text>
  </svg>
);

const SVGWaveform = ({ accent }) => {
  const pts = Array.from({ length:40 }, (_,i) => ({
    x: (i/39)*100,
    y: 50 + Math.sin(i*0.58)*14 + Math.sin(i*1.3)*6,
  }));
  const d = pts.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  return (
    <svg width="130" height="28" viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', opacity:0.22, pointerEvents:'none', zIndex:30 }}>
      <path d={d} stroke={accent} strokeWidth="1.8" fill="none"/>
    </svg>
  );
};

const SVGScanBeam = ({ accent, y }) => (
  <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:5, overflow:'hidden' }}>
    <div style={{
      position:'absolute', left:0, right:0, top:`${y}%`,
      height:'80px',
      background:`linear-gradient(to bottom, transparent 0%, ${accent}08 40%, ${accent}10 50%, ${accent}08 60%, transparent 100%)`,
      transition:'none',
    }}/>
  </div>
);

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Overpass+Mono:wght@300;400;600&family=DM+Serif+Display:ital@0;1&display=swap');

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  @keyframes reticleSpin { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.75)} }
  @keyframes fadeUp { to{opacity:1;transform:translateY(0)} }
  @keyframes scanMove { from{background-position:0 -200px} to{background-position:0 100vh} }
  @keyframes shimmer { from{transform:translateX(-100%)} to{transform:translateX(100%)} }

  .hero-root {
    font-family:'Overpass Mono',monospace;
    background:#000;
    padding-top:var(--header-h,100px);
  }

  .hero-section {
    width:100%;
    height:calc(100svh - var(--header-h,100px));
    min-height:680px;
    display:grid;
    grid-template-columns:52% 48%;
    background:#000;
    overflow:hidden;
    position:relative;
  }
  @media(max-width:1100px){.hero-section{grid-template-columns:50% 50%}}
  @media(max-width:768px){.hero-section{display:flex;flex-direction:column-reverse;height:auto;min-height:100svh}}

  /* LEFT */
  .left-panel{
    position:relative;display:flex;flex-direction:column;
    justify-content:center;padding:0 5vw 0 4vw;z-index:20;background:#000;
  }
  @media(max-width:768px){.left-panel{padding:48px 7vw 96px;height:auto;width:100%}}

  .cat-ticker{
    position:absolute;left:0;top:0;bottom:0;width:28px;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    border-right:1px solid rgba(255,255,255,0.04);gap:30px;z-index:10;
  }
  @media(max-width:768px){.cat-ticker{display:none}}
  .cat-tick-item{
    writing-mode:vertical-rl;transform:rotate(180deg);
    font-size:7px;letter-spacing:0.5em;text-transform:uppercase;
    cursor:pointer;transition:color 0.4s,letter-spacing 0.3s;
  }
  .cat-tick-item:hover{letter-spacing:0.62em}

  .hero-content{padding-left:36px}

  .hero-meta{
    display:flex;align-items:center;gap:20px;
    margin-bottom:clamp(22px,4vh,38px);
  }
  .hero-index{
    font-size:9px;letter-spacing:0.4em;color:rgba(255,255,255,0.18);
    display:flex;align-items:center;gap:12px;
  }
  .hero-index-line{height:1px;transition:background 0.8s}
  .hero-edition{
    font-size:7px;letter-spacing:0.5em;text-transform:uppercase;
    color:rgba(255,255,255,0.14);padding:4px 10px;
    border:1px solid rgba(255,255,255,0.06);
  }

  .hero-badge{
    display:inline-flex;align-items:center;gap:9px;
    margin-bottom:18px;padding:5px 14px;
    border:1px solid rgba(255,255,255,0.06);
    background:rgba(255,255,255,0.015);
    font-size:7.5px;letter-spacing:0.45em;text-transform:uppercase;
    color:rgba(255,255,255,0.22);width:fit-content;transition:border-color 0.8s;
  }
  .hero-badge-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;animation:pulse 2s ease-in-out infinite}

  .hero-eyebrow{
    font-size:9px;letter-spacing:0.6em;text-transform:uppercase;
    margin-bottom:14px;transition:color 0.8s;
  }

  .hero-headline{
    font-family:'DM Serif Display',serif;
    font-weight:400;line-height:1.04;letter-spacing:-0.02em;
    color:#fff;margin-bottom:16px;
    font-size:clamp(36px,4.6vw,84px);
    transition:opacity 0.45s,transform 0.45s;
  }
  @media(max-width:768px){.hero-headline{font-size:clamp(30px,10vw,46px)}}
  .hero-headline em{font-family:'DM Serif Display',serif;font-style:italic;color:rgba(255,255,255,0.36)}

  .hero-tagline{
    font-family:'Cormorant Garamond',serif;font-style:italic;
    font-size:clamp(14px,1.4vw,19px);color:rgba(255,255,255,0.28);
    margin-bottom:18px;letter-spacing:0.01em;transition:opacity 0.45s;
  }

  .hero-stat{
    display:flex;align-items:center;gap:12px;
    margin-bottom:clamp(20px,3.5vh,34px);
    font-size:8px;letter-spacing:0.3em;text-transform:uppercase;
    color:rgba(255,255,255,0.18);transition:opacity 0.45s;
  }
  .hero-stat-line{height:1px;width:24px;flex-shrink:0;transition:background 0.8s}

  .hero-sub{
    font-size:10px;line-height:2;color:rgba(255,255,255,0.2);
    max-width:400px;margin-bottom:clamp(26px,4vh,42px);
    letter-spacing:0.04em;transition:opacity 0.45s;
  }

  .cta-row{display:flex;gap:12px;flex-wrap:wrap;align-items:center}

  .btn-fill{
    padding:16px 42px;font-family:'Overpass Mono',monospace;
    font-size:8.5px;letter-spacing:0.4em;text-transform:uppercase;
    text-decoration:none;border:none;cursor:pointer;
    color:#000;font-weight:600;display:inline-block;
    position:relative;overflow:hidden;
    transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),box-shadow 0.4s;
  }
  .btn-fill::before{
    content:'';position:absolute;inset:0;
    background:rgba(255,255,255,0);
    transition:background 0.3s;
  }
  .btn-fill:hover{transform:translateY(-2px);box-shadow:0 14px 40px rgba(0,0,0,0.55)}
  .btn-fill:hover::before{background:rgba(255,255,255,0.12)}

  .btn-ghost{
    padding:15px 24px;font-family:'Overpass Mono',monospace;
    font-size:8.5px;letter-spacing:0.4em;text-transform:uppercase;
    text-decoration:none;background:transparent;cursor:pointer;
    color:rgba(255,255,255,0.28);display:inline-flex;align-items:center;gap:10px;
    border:none;transition:color 0.3s;
  }
  .btn-ghost:hover{color:#fff}
  .btn-ghost-line{height:1px;width:22px;background:currentColor;transition:width 0.35s cubic-bezier(0.16,1,0.3,1);flex-shrink:0}
  .btn-ghost:hover .btn-ghost-line{width:38px}

  .hero-dots{position:absolute;bottom:44px;left:5vw;display:flex;gap:10px;align-items:center}
  @media(max-width:768px){.hero-dots{bottom:32px;left:7vw}}
  .hero-dot{height:1px;cursor:pointer;transition:all 0.6s cubic-bezier(0.4,0,0.2,1)}

  .hero-progress{position:absolute;bottom:0;left:0;right:0;height:1px;background:rgba(255,255,255,0.04)}
  .hero-progress-fill{height:100%;transition:width 6.5s linear,background 0.8s ease}

  .kb-hint{
    position:absolute;bottom:46px;right:5vw;
    font-size:7px;letter-spacing:0.4em;text-transform:uppercase;
    color:rgba(255,255,255,0.07);display:flex;align-items:center;gap:8px;
  }
  .kb-key{
    display:inline-flex;align-items:center;justify-content:center;
    width:18px;height:18px;border:1px solid rgba(255,255,255,0.07);
    font-size:9px;color:rgba(255,255,255,0.12);
  }

  /* RIGHT */
  .right-panel{
    position:relative;overflow:hidden;
    border-left:1px solid rgba(255,255,255,0.04);
    background:#000;
  }
  @media(max-width:768px){
    .right-panel{height:48vh;min-height:320px;width:100%;border-left:none;border-bottom:1px solid rgba(255,255,255,0.04)}
  }

  .grid-lines{
    position:absolute;inset:0;z-index:1;pointer-events:none;
    background-image:
      linear-gradient(rgba(255,255,255,0.007) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,255,255,0.007) 1px,transparent 1px);
    background-size:55px 55px;
  }

  .scan-line{
    position:absolute;inset:0;pointer-events:none;z-index:3;
    background:linear-gradient(to bottom,transparent 0%,rgba(255,255,255,0.01) 50%,transparent 100%);
    background-size:100% 220px;
    animation:scanMove 9s linear infinite;
  }

  .right-hud{position:absolute;inset:0;z-index:40;pointer-events:none}

  .hud-label{
    position:absolute;bottom:28px;right:28px;
    font-size:8px;letter-spacing:0.6em;text-transform:uppercase;
    transition:color 0.8s,opacity 0.45s;
  }
  .hud-badge{
    position:absolute;top:20px;right:20px;
    font-size:7px;letter-spacing:0.45em;text-transform:uppercase;
    padding:5px 12px;border:1px solid rgba(255,255,255,0.05);
    background:rgba(0,0,0,0.8);backdrop-filter:blur(12px);
    transition:color 0.8s,border-color 0.8s;
    display:flex;align-items:center;gap:8px;
  }
  .hud-badge-dot{width:4px;height:4px;border-radius:50%;animation:pulse 2s ease-in-out infinite}

  .hud-stat{
    position:absolute;bottom:52px;left:24px;
    font-size:7px;letter-spacing:0.35em;text-transform:uppercase;
    color:rgba(255,255,255,0.15);
    display:flex;flex-direction:column;gap:5px;
  }
  .hud-stat-val{
    font-size:13px;letter-spacing:-0.01em;font-weight:600;
    transition:color 0.8s;
    font-family:'DM Serif Display',serif;
  }

  /* cross-hair HUD lines */
  .hud-crossh{
    position:absolute;top:50%;left:50%;
    transform:translate(-50%,-50%);
    width:100%;height:100%;
    pointer-events:none;z-index:6;
  }
  .hud-crossh::before,.hud-crossh::after{
    content:'';position:absolute;
    background:rgba(255,255,255,0.025);
  }
  .hud-crossh::before{left:50%;top:0;width:1px;height:100%}
  .hud-crossh::after{top:50%;left:0;height:1px;width:100%}

  /* slide-in animation */
  .fi{opacity:0;transform:translateY(22px);animation:fadeUp 0.9s ease forwards}
  .fd1{animation-delay:.06s}.fd2{animation-delay:.14s}.fd3{animation-delay:.22s}
  .fd4{animation-delay:.3s}.fd5{animation-delay:.38s}.fd6{animation-delay:.46s}
`;

/* ══════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════ */
const Hero = () => {
  const [current, setCurrent]           = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress]         = useState(0);
  const [scanY, setScanY]               = useState(20);
  const progRef = useRef(null);

  const goTo = useCallback((index) => {
    if (index === current || transitioning) return;
    setTransitioning(true); setProgress(0);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 500);
  }, [current, transitioning]);

  const next = useCallback(() => goTo((current+1) % slides.length), [current, goTo]);

  useEffect(() => {
    setProgress(0);
    const iv = setInterval(next, 6500);
    const start = performance.now();
    const anim = now => {
      const pct = Math.min(((now-start)/6500)*100, 100);
      setProgress(pct);
      if (pct < 100) progRef.current = requestAnimationFrame(anim);
    };
    progRef.current = requestAnimationFrame(anim);
    return () => { clearInterval(iv); cancelAnimationFrame(progRef.current); };
  }, [current, next]);

  useEffect(() => {
    let raf; let y = 20;
    const tick = () => { y = (y + 0.1) % 100; setScanY(y); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onKey = e => {
      if (e.key==='ArrowRight'||e.key==='ArrowDown') next();
      if (e.key==='ArrowLeft'||e.key==='ArrowUp') goTo((current-1+slides.length)%slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, next, goTo]);

  const slide = slides[current];
  const fade = (d=0) => ({
    opacity: transitioning ? 0 : 1,
    transform: `translateY(${transitioning ? 14 : 0}px)`,
    transition: `opacity 0.45s ease ${d}s, transform 0.45s ease ${d}s`,
  });

  return (
    <>
      <style>{STYLES}</style>
      <div className="hero-root">
        <section className="hero-section">

          {/* LEFT */}
          <div className="left-panel">
            <div className="cat-ticker">
              {slides.map((s,i) => (
                <div key={s.category} className="cat-tick-item"
                  style={{ color: i===current ? s.accent : 'rgba(255,255,255,0.12)' }}
                  onClick={() => goTo(i)}>
                  {s.category}
                </div>
              ))}
            </div>

            <div className="hero-content">
              <div className="hero-meta fi fd1">
                <div className="hero-index">
                  <div className="hero-index-line" style={{ width:28, background:slide.accent, transition:'background 0.8s' }}/>
                  <span>0{current+1} / 0{slides.length}</span>
                </div>
                <div className="hero-edition">2026 Collection</div>
              </div>

              <div className="hero-badge fi fd2" style={{ borderColor:`${slide.accent}28`, transition:'border-color 0.8s' }}>
                <div className="hero-badge-dot" style={{ background:slide.accent, transition:'background 0.8s' }}/>
                {slide.count} Curated Objects · {slide.label}
              </div>

              <div className="hero-eyebrow fi fd2" style={{ color:slide.accent, ...fade(0.04) }}>
                {slide.category} Archive
              </div>

              <h1 className="hero-headline fi fd3" style={fade(0.08)}>
                The World's<br />
                Finest <em>Archive.</em>
              </h1>

              <p className="hero-tagline fi fd4" style={{ opacity:transitioning?0:1, transition:'opacity 0.45s ease 0.1s' }}>
                {slide.tagline}
              </p>

              <div className="hero-stat fi fd4" style={{ opacity:transitioning?0:1, transition:'opacity 0.45s ease 0.12s' }}>
                <div className="hero-stat-line" style={{ background:slide.accent, transition:'background 0.8s' }}/>
                {slide.stat}
              </div>

              <p className="hero-sub fi fd5" style={{ opacity:transitioning?0:1, transition:'opacity 0.45s ease 0.14s' }}>
                Artisan groceries, curated tech, slow-fashion and bespoke furniture.
                Sourced from the world's finest makers — free delivery on every order.
              </p>

              <div className="cta-row fi fd6">
                <Link to="/shop">
                  <button className="btn-fill" style={{ background:slide.accent, transition:'background 0.8s' }}>
                    Shop Collection
                  </button>
                </Link>
                <Link to="/categories">
                  <button className="btn-ghost">
                    Explore Archive
                    <span className="btn-ghost-line"/>
                  </button>
                </Link>
              </div>
            </div>

            <div className="hero-dots">
              {slides.map((_,i) => (
                <div key={i} className="hero-dot" style={{
                  width: i===current ? '48px' : '12px',
                  background: i===current ? slide.accent : 'rgba(255,255,255,0.1)',
                }} onClick={() => goTo(i)}/>
              ))}
            </div>

            <div className="kb-hint">
              <span className="kb-key">←</span>
              <span className="kb-key">→</span>
              Navigate
            </div>

            <div className="hero-progress">
              <div className="hero-progress-fill" style={{ width:`${progress}%`, background:slide.accent }}/>
            </div>
          </div>

          {/* RIGHT */}
          <div className="right-panel">
            <div style={{ position:'absolute', inset:0, zIndex:1, background:slide.bg, transition:'background 1.2s cubic-bezier(0.4,0,0.2,1)' }}/>
            <div className="grid-lines"/>
            <div className="scan-line"/>
            <SVGScanBeam accent={slide.accent} y={scanY}/>
            <div className="hud-crossh"/>
            <SVGCornerTL accent={slide.accent}/>
            <SVGCornerBR accent={slide.accent}/>
            <SVGCornerTR accent={slide.accent}/>
            <SVGCornerBL accent={slide.accent}/>
            <SVGReticle accent={slide.accent}/>
            <SVGStamp accent={slide.accent}/>

            <div style={{ position:'absolute', inset:0, zIndex:10 }}>
              <ThreeScene slide={slide} transitioning={transitioning}/>
            </div>

            <div className="right-hud">
              <LiveClock accent={slide.accent}/>
              <div className="hud-badge" style={{ color:slide.accent, borderColor:`${slide.accent}22` }}>
                <div className="hud-badge-dot" style={{ background:slide.accent }}/>
                Live 3D Preview
              </div>
              <div className="hud-stat" style={{ opacity:transitioning?0:1, transition:'opacity 0.45s' }}>
                <span className="hud-stat-val" style={{ color:slide.accent }}>{slide.stat.split(' ')[0]}</span>
                <span>{slide.label}</span>
              </div>
              <div className="hud-label" style={{ color:slide.accent, opacity:transitioning?0:1, transition:'color 0.8s,opacity 0.45s' }}>
                {slide.label}
              </div>
            </div>

            <SVGWaveform accent={slide.accent}/>
          </div>

        </section>
      </div>
    </>
  );
};

export default Hero;