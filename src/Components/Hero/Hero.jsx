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
    accent: "#C9A96E",
    accentRGB: [0.788, 0.663, 0.431],
    bg: "radial-gradient(ellipse at 60% 50%, rgba(201,169,110,0.11) 0%, transparent 70%)",
    scene: "fashion",
  },
  {
    category: "Electronics",
    label: "Tech & Gadgets",
    accent: "#6EC9C9",
    accentRGB: [0.431, 0.788, 0.788],
    bg: "radial-gradient(ellipse at 60% 50%, rgba(110,201,201,0.11) 0%, transparent 70%)",
    scene: "electronics",
  },
  {
    category: "Furniture",
    label: "Home & Living",
    accent: "#B89A7A",
    accentRGB: [0.722, 0.604, 0.478],
    bg: "radial-gradient(ellipse at 60% 50%, rgba(184,154,122,0.11) 0%, transparent 70%)",
    scene: "furniture",
  },
  {
    category: "Groceries",
    label: "Artisan & Fresh",
    accent: "#7EBF7A",
    accentRGB: [0.494, 0.749, 0.478],
    bg: "radial-gradient(ellipse at 60% 50%, rgba(126,191,122,0.11) 0%, transparent 70%)",
    scene: "groceries",
  },
];

/* ══════════════════════════════════════════════════
   MATERIAL HELPERS
══════════════════════════════════════════════════ */
const solid = (color, rough = 0.4, metal = 0.5) =>
  new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal });

const wire = (color, opacity = 0.15) =>
  new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity });

const phong = (color, shininess = 80) =>
  new THREE.MeshPhongMaterial({ color, shininess });

/* ══════════════════════════════════════════════════
   PRODUCT MODEL BUILDERS
══════════════════════════════════════════════════ */

/* ── T-SHIRT (fashion) ─────────────────────────
   Built from merged box/cylinder shapes forming
   a recognizable shirt silhouette              */
function makeTShirt(accent) {
  const group = new THREE.Group();
  const body  = new THREE.Color(accent);
  const dark  = new THREE.Color(accent).multiplyScalar(0.55);

  // Body
  const torso = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.4, 0.28), solid(body, 0.9, 0.0));
  torso.position.y = -0.3;
  group.add(torso);

  // Left sleeve
  const lSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.25), solid(body, 0.9, 0.0));
  lSleeve.position.set(-1.42, 0.85, 0);
  lSleeve.rotation.z = -0.42;
  group.add(lSleeve);

  // Right sleeve
  const rSleeve = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.55, 0.25), solid(body, 0.9, 0.0));
  rSleeve.position.set(1.42, 0.85, 0);
  rSleeve.rotation.z = 0.42;
  group.add(rSleeve);

  // Collar
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 0.28, 20, 1, true), solid(dark, 0.9, 0.0));
  collar.position.set(0, 1.05, 0);
  group.add(collar);

  // Hem (bottom fold)
  const hem = new THREE.Mesh(new THREE.BoxGeometry(2.05, 0.12, 0.3), solid(dark, 0.9, 0.0));
  hem.position.y = -1.5;
  group.add(hem);

  // Subtle pocket
  const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.04), solid(dark, 0.9, 0.0));
  pocket.position.set(-0.55, 0.25, 0.15);
  group.add(pocket);

  group.userData = { rotY: 0.008, floatAmp: 0.28, floatSpeed: 1.0, floatOffset: 0, _hero: true };
  return group;
}

/* ── SNEAKER (fashion secondary) ──────────────── */
function makeSneaker(accent, scale = 1) {
  const group = new THREE.Group();
  const col = new THREE.Color(accent);
  const sole = new THREE.Color(0x222222);

  // Sole
  const soleM = new THREE.Mesh(new THREE.BoxGeometry(1.8 * scale, 0.22 * scale, 0.7 * scale), solid(sole, 0.8, 0.1));
  soleM.position.y = -0.45 * scale;
  group.add(soleM);

  // Upper body (shoe shape via tapered box)
  const upper = new THREE.Mesh(new THREE.BoxGeometry(1.6 * scale, 0.55 * scale, 0.62 * scale), solid(col, 0.7, 0.1));
  upper.position.set(-0.05 * scale, -0.1 * scale, 0);
  group.add(upper);

  // Toe cap
  const toe = new THREE.Mesh(new THREE.SphereGeometry(0.32 * scale, 16, 12), solid(col.clone().multiplyScalar(0.8), 0.6, 0.1));
  toe.position.set(0.72 * scale, -0.12 * scale, 0);
  toe.scale.set(1.0, 0.7, 0.9);
  group.add(toe);

  // Heel
  const heel = new THREE.Mesh(new THREE.BoxGeometry(0.4 * scale, 0.42 * scale, 0.62 * scale), solid(col.clone().multiplyScalar(1.15), 0.7, 0.1));
  heel.position.set(-0.65 * scale, -0.22 * scale, 0);
  group.add(heel);

  // Tongue
  const tongue = new THREE.Mesh(new THREE.BoxGeometry(0.38 * scale, 0.55 * scale, 0.06 * scale), solid(new THREE.Color(0xfafafa), 0.9, 0.0));
  tongue.position.set(-0.12 * scale, 0.12 * scale, 0.32 * scale);
  group.add(tongue);

  return group;
}

/* ── SMARTPHONE (electronics) ─────────────────── */
function makeSmartphone(accent) {
  const group = new THREE.Group();
  const bodyColor = new THREE.Color(0x1a1a1a);
  const screenCol = new THREE.Color(accent).multiplyScalar(0.4);
  const accentCol = new THREE.Color(accent);

  // Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.2, 0.11), solid(bodyColor, 0.1, 0.9));
  group.add(body);

  // Screen
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.95, 0.06), solid(screenCol, 0.05, 0.1));
  screen.position.z = 0.08;
  group.add(screen);

  // Screen glow plane
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 1.82),
    new THREE.MeshBasicMaterial({ color: accentCol, transparent: true, opacity: 0.18 }));
  glow.position.z = 0.12;
  group.add(glow);

  // Home bar
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.045, 0.04), solid(new THREE.Color(accent), 0.2, 0.8));
  bar.position.set(0, -0.92, 0.12);
  group.add(bar);

  // Camera island
  const camIsland = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.04), solid(new THREE.Color(0x111111), 0.1, 0.9));
  camIsland.position.set(0.2, 0.85, -0.07);
  group.add(camIsland);
  [[-0.08, 0.08], [0.08, 0.08], [-0.08, -0.08]].forEach(([cx, cy]) => {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.03, 20), solid(new THREE.Color(0x050505), 0.05, 0.5));
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0.2 + cx, 0.85 + cy, -0.09);
    group.add(lens);
  });

  // Side button
  const btn = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.28, 0.06), solid(accentCol, 0.3, 0.8));
  btn.position.set(0.58, 0.1, 0);
  group.add(btn);

  group.userData = { rotY: 0.007, floatAmp: 0.26, floatSpeed: 1.05, floatOffset: 0, _hero: true };
  return group;
}

/* ── LAPTOP (electronics secondary) ───────────── */
function makeLaptop(accent, scale = 1) {
  const group = new THREE.Group();
  const bodyCol = new THREE.Color(0x2a2a2a);
  const screenC = new THREE.Color(accent).multiplyScalar(0.35);

  // Base
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.2 * scale, 0.1 * scale, 1.5 * scale), solid(bodyCol, 0.15, 0.85));
  base.position.y = -0.05 * scale;
  group.add(base);

  // Lid (open ~110°)
  const lid = new THREE.Group();
  const lidPanel = new THREE.Mesh(new THREE.BoxGeometry(2.2 * scale, 1.45 * scale, 0.07 * scale), solid(bodyCol, 0.15, 0.85));
  const scrn = new THREE.Mesh(new THREE.BoxGeometry(2.0 * scale, 1.3 * scale, 0.04 * scale), solid(screenC, 0.05, 0.1));
  scrn.position.z = 0.055 * scale;
  lid.add(lidPanel);
  lid.add(scrn);
  lid.position.set(0, 0.05 * scale, -0.72 * scale);
  lid.rotation.x = -1.9;
  group.add(lid);

  // Trackpad
  const pad = new THREE.Mesh(new THREE.BoxGeometry(0.7 * scale, 0.45 * scale, 0.01 * scale), solid(new THREE.Color(0x333333), 0.3, 0.6));
  pad.position.set(0, 0.1 * scale, 0.35 * scale);
  group.add(pad);

  return group;
}

/* ── HEADPHONES (electronics third) ───────────── */
function makeHeadphones(accent, scale = 1) {
  const group = new THREE.Group();
  const col = new THREE.Color(accent);
  const dark = new THREE.Color(0x1a1a1a);

  // Headband arc
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.75 * scale, 0.07 * scale, 12, 40, Math.PI),
    solid(dark, 0.2, 0.8));
  arc.rotation.z = Math.PI;
  arc.position.y = 0.1 * scale;
  group.add(arc);

  // Left cup
  const lCup = new THREE.Mesh(new THREE.CylinderGeometry(0.32 * scale, 0.32 * scale, 0.22 * scale, 24),
    solid(col, 0.3, 0.5));
  lCup.position.set(-0.75 * scale, -0.58 * scale, 0);
  lCup.rotation.z = Math.PI / 2;
  group.add(lCup);

  // Right cup
  const rCup = lCup.clone();
  rCup.position.set(0.75 * scale, -0.58 * scale, 0);
  group.add(rCup);

  // Cushions
  [lCup, rCup].forEach((cup, i) => {
    const cushion = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * scale, 0.28 * scale, 0.08 * scale, 24),
      solid(new THREE.Color(0x111111), 0.95, 0.0));
    cushion.rotation.z = Math.PI / 2;
    cushion.position.copy(cup.position);
    cushion.position.x += i === 0 ? -0.15 * scale : 0.15 * scale;
    group.add(cushion);
  });

  return group;
}

/* ── CHAIR (furniture) ─────────────────────────── */
function makeChair(accent) {
  const group = new THREE.Group();
  const wood = new THREE.Color(accent);
  const dark = new THREE.Color(accent).clone().multiplyScalar(0.55);
  const pad  = new THREE.Color(0x1a1a1a);

  // Seat
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 1.6), solid(wood, 0.7, 0.1));
  seat.position.y = 0.3;
  group.add(seat);

  // Seat cushion
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.12, 1.45), solid(pad, 0.95, 0.0));
  cushion.position.y = 0.41;
  group.add(cushion);

  // Backrest
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 0.1), solid(wood, 0.7, 0.1));
  back.position.set(0, 1.15, -0.75);
  group.add(back);

  // Back cushion
  const backCush = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.35, 0.1), solid(pad, 0.95, 0.0));
  backCush.position.set(0, 1.15, -0.69);
  group.add(backCush);

  // 4 legs
  [[-0.65, -0.65], [0.65, -0.65], [-0.65, 0.65], [0.65, 0.65]].forEach(([x, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.3, 12), solid(dark, 0.6, 0.2));
    leg.position.set(x, -0.35, z);
    group.add(leg);
  });

  // Armrests
  [-0.88, 0.88].forEach(x => {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 1.1), solid(wood, 0.7, 0.1));
    arm.position.set(x, 0.78, 0.08);
    group.add(arm);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), solid(dark, 0.6, 0.2));
    post.position.set(x, 0.54, 0.55);
    group.add(post);
  });

  group.userData = { rotY: 0.006, floatAmp: 0.22, floatSpeed: 0.95, floatOffset: 0, _hero: true };
  return group;
}

/* ── LAMP (furniture secondary) ───────────────── */
function makeLamp(accent, scale = 1) {
  const group = new THREE.Group();
  const col = new THREE.Color(accent);
  const metal = new THREE.Color(0x888888);

  // Base disc
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.38 * scale, 0.42 * scale, 0.08 * scale, 24),
    solid(metal, 0.2, 0.85));
  base.position.y = -1.05 * scale;
  group.add(base);

  // Pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04 * scale, 0.04 * scale, 1.8 * scale, 12),
    solid(metal, 0.2, 0.85));
  pole.position.y = -0.05 * scale;
  group.add(pole);

  // Shade (open cone)
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.55 * scale, 0.65 * scale, 24, 1, true),
    solid(col, 0.8, 0.0));
  shade.position.y = 0.85 * scale;
  group.add(shade);

  // Bulb glow
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12 * scale, 16, 16),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.95, 0.7), transparent: true, opacity: 0.9 }));
  bulb.position.y = 0.65 * scale;
  group.add(bulb);

  return group;
}

/* ── APPLE / FRUIT (groceries) ─────────────────── */
function makeApple(accent, scale = 1) {
  const group = new THREE.Group();
  const red = new THREE.Color(accent);

  // Body — slightly flattened sphere
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.72 * scale, 32, 28), solid(red, 0.5, 0.0));
  body.scale.y = 0.88;
  group.add(body);

  // Indent top
  const indent = new THREE.Mesh(new THREE.SphereGeometry(0.18 * scale, 12, 12), solid(red.clone().multiplyScalar(0.7), 0.7, 0.0));
  indent.position.y = 0.58 * scale;
  indent.scale.y = 0.4;
  group.add(indent);

  // Stem
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025 * scale, 0.03 * scale, 0.28 * scale, 8),
    solid(new THREE.Color(0x5a3a1a), 0.9, 0.0));
  stem.position.y = 0.72 * scale;
  group.add(stem);

  // Leaf
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, 0);
  leafShape.bezierCurveTo(0.15, 0.15, 0.25, 0.1, 0.2, -0.1);
  leafShape.bezierCurveTo(0.1, -0.05, 0, 0.05, 0, 0);
  const leafGeo = new THREE.ShapeGeometry(leafShape, 8);
  const leaf = new THREE.Mesh(leafGeo, solid(new THREE.Color(0x2e7d32), 0.8, 0.0));
  leaf.position.set(0.04 * scale, 0.85 * scale, 0);
  leaf.rotation.z = 0.4;
  leaf.scale.setScalar(scale);
  group.add(leaf);

  return group;
}

/* ── JAR (groceries secondary) ─────────────────── */
function makeJar(accent, scale = 1) {
  const group = new THREE.Group();
  const glass = new THREE.Color(accent).multiplyScalar(0.6);
  const lid   = new THREE.Color(0x888888);

  // Jar body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * scale, 0.38 * scale, 1.0 * scale, 28),
    new THREE.MeshStandardMaterial({ color: glass, roughness: 0.05, metalness: 0.0, transparent: true, opacity: 0.7 }));
  group.add(body);

  // Lid
  const lidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.44 * scale, 0.44 * scale, 0.18 * scale, 28),
    solid(lid, 0.2, 0.8));
  lidMesh.position.y = 0.59 * scale;
  group.add(lidMesh);

  // Contents hint (colored fill)
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(0.38 * scale, 0.34 * scale, 0.7 * scale, 24),
    solid(new THREE.Color(accent), 0.6, 0.0));
  fill.position.y = -0.12 * scale;
  group.add(fill);

  return group;
}

/* ── BREAD LOAF (groceries third) ──────────────── */
function makeBread(scale = 1) {
  const group = new THREE.Group();
  const crust = new THREE.Color(0xc8860a);
  const inner = new THREE.Color(0xf5d07a);

  // Loaf body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.4 * scale, 0.75 * scale, 0.7 * scale), solid(crust, 0.95, 0.0));
  body.scale.set(1, 1, 1);
  group.add(body);

  // Dome top
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.52 * scale, 20, 14), solid(crust.clone().multiplyScalar(0.88), 0.95, 0.0));
  dome.position.y = 0.3 * scale;
  dome.scale.set(1.32, 0.58, 0.68);
  group.add(dome);

  // Score lines (cuts on top)
  [-0.2 * scale, 0.2 * scale].forEach(x => {
    const cut = new THREE.Mesh(new THREE.BoxGeometry(0.04 * scale, 0.12 * scale, 0.65 * scale),
      solid(inner, 0.95, 0.0));
    cut.position.set(x, 0.46 * scale, 0);
    group.add(cut);
  });

  return group;
}

/* ══════════════════════════════════════════════════
   SCENE ASSEMBLER — places multiple products
══════════════════════════════════════════════════ */
function assembleScene(sceneName, accentRGB) {
  const accent = new THREE.Color(...accentRGB);
  const accentHex = `#${accent.getHexString()}`;
  const groups = [];

  if (sceneName === "fashion") {
    // Hero: T-shirt centre
    const shirt = makeTShirt(accentHex);
    shirt.position.set(0, 0.1, 0);
    shirt.userData = { rotY: 0.007, rotX: 0.001, floatAmp: 0.3, floatSpeed: 0.9, floatOffset: 0 };
    groups.push(shirt);

    // Left: sneaker
    const shoe = makeSneaker(accentHex, 0.72);
    shoe.position.set(-2.6, -1.0, 0.3);
    shoe.rotation.y = 0.6;
    shoe.userData = { rotY: 0.009, rotX: 0.002, floatAmp: 0.2, floatSpeed: 1.2, floatOffset: 1.1 };
    groups.push(shoe);

    // Right: another sneaker (pair)
    const shoe2 = makeSneaker(accentHex, 0.62);
    shoe2.position.set(2.4, -1.4, -0.2);
    shoe2.rotation.y = -0.8;
    shoe2.userData = { rotY: 0.007, rotX: 0.001, floatAmp: 0.18, floatSpeed: 1.35, floatOffset: 2.3 };
    groups.push(shoe2);
  }

  if (sceneName === "electronics") {
    // Hero: smartphone centre
    const phone = makeSmartphone(accentHex);
    phone.position.set(0.2, 0.1, 0);
    phone.userData = { rotY: 0.007, rotX: 0.002, floatAmp: 0.28, floatSpeed: 0.95, floatOffset: 0 };
    groups.push(phone);

    // Left back: laptop
    const laptop = makeLaptop(accentHex, 0.62);
    laptop.position.set(-2.4, -0.7, -0.5);
    laptop.rotation.y = 0.5;
    laptop.userData = { rotY: 0.005, rotX: 0.001, floatAmp: 0.16, floatSpeed: 1.1, floatOffset: 1.8 };
    groups.push(laptop);

    // Right: headphones
    const hp = makeHeadphones(accentHex, 0.8);
    hp.position.set(2.4, 0.5, 0.2);
    hp.rotation.y = -0.4;
    hp.userData = { rotY: 0.009, rotX: 0.003, floatAmp: 0.24, floatSpeed: 1.25, floatOffset: 0.7 };
    groups.push(hp);
  }

  if (sceneName === "furniture") {
    // Hero: chair
    const chair = makeChair(accentHex);
    chair.position.set(0, -0.2, 0);
    chair.userData = { rotY: 0.006, rotX: 0.001, floatAmp: 0.22, floatSpeed: 0.9, floatOffset: 0 };
    groups.push(chair);

    // Right: lamp
    const lamp = makeLamp(accentHex, 0.72);
    lamp.position.set(2.5, 0.2, 0);
    lamp.userData = { rotY: 0.008, rotX: 0.001, floatAmp: 0.18, floatSpeed: 1.15, floatOffset: 1.2 };
    groups.push(lamp);

    // Left small: decorative sphere (vase hint)
    const vase = new THREE.Group();
    const vBody = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 20),
      solid(new THREE.Color(accentHex).multiplyScalar(0.7), 0.3, 0.4));
    vBody.scale.set(1, 1.4, 1);
    const vNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.25, 0.35, 16),
      solid(new THREE.Color(accentHex).multiplyScalar(0.7), 0.3, 0.4));
    vNeck.position.y = 0.62;
    vase.add(vBody);
    vase.add(vNeck);
    vase.position.set(-2.6, -0.5, 0.3);
    vase.userData = { rotY: 0.01, rotX: 0.002, floatAmp: 0.24, floatSpeed: 1.3, floatOffset: 2.1 };
    groups.push(vase);
  }

  if (sceneName === "groceries") {
    // Hero: apple (large)
    const apple = makeApple(new THREE.Color(accentRGB[0], accentRGB[1], accentRGB[2]).getHexString(), 1.35);
    apple.position.set(0.1, 0.1, 0);
    apple.userData = { rotY: 0.008, rotX: 0.002, floatAmp: 0.3, floatSpeed: 1.0, floatOffset: 0 };
    groups.push(apple);

    // Left: jar
    const jar = makeJar(accentHex, 0.82);
    jar.position.set(-2.4, -0.3, 0.2);
    jar.rotation.y = 0.5;
    jar.userData = { rotY: 0.007, rotX: 0.001, floatAmp: 0.2, floatSpeed: 1.2, floatOffset: 1.4 };
    groups.push(jar);

    // Right: bread loaf
    const bread = makeBread(0.78);
    bread.position.set(2.4, -0.8, 0);
    bread.rotation.y = -0.6;
    bread.userData = { rotY: 0.006, rotX: 0.001, floatAmp: 0.18, floatSpeed: 1.1, floatOffset: 2.2 };
    groups.push(bread);

    // Small extra apple
    const apple2 = makeApple(`${new THREE.Color(accentRGB[0]*0.8, accentRGB[1]*0.6, 0.2).getHexString()}`, 0.68);
    apple2.position.set(1.5, -1.6, 0.4);
    apple2.userData = { rotY: 0.011, rotX: 0.002, floatAmp: 0.22, floatSpeed: 1.4, floatOffset: 0.8 };
    groups.push(apple2);
  }

  return groups;
}

/* ══════════════════════════════════════════════════
   THREE.JS CANVAS COMPONENT
══════════════════════════════════════════════════ */
const ThreeScene = ({ slide, transitioning }) => {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const objectsRef = useRef([]);
  const frameRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const mouseRef = useRef({ x: 0, y: 0 });
  const basePositionsRef = useRef([]);

  // Init renderer once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.5, 8.5);
    cameraRef.current = camera;

    const ro = new ResizeObserver(() => {
      if (!mount) return;
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
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!renderer || !camera) return;

    cancelAnimationFrame(frameRef.current);

    // Dispose old
    if (sceneRef.current) {
      sceneRef.current.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(m => m.dispose());
        }
      });
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.45));

    const key = new THREE.DirectionalLight(0xffffff, 1.8);
    key.position.set(5, 8, 6);
    scene.add(key);

    const fill = new THREE.DirectionalLight(0xffffff, 0.5);
    fill.position.set(-6, 2, 4);
    scene.add(fill);

    const accent = new THREE.PointLight(new THREE.Color(...slide.accentRGB), 3.5, 20);
    accent.position.set(-3, 3, 5);
    scene.add(accent);

    const rim = new THREE.PointLight(0xffffff, 0.8, 15);
    rim.position.set(5, -4, 3);
    scene.add(rim);

    // Assemble products
    const groups = assembleScene(slide.scene, slide.accentRGB);
    groups.forEach(g => scene.add(g));
    objectsRef.current = groups;

    // Store base Y positions for float
    basePositionsRef.current = groups.map(g => ({
      x: g.position.x,
      y: g.position.y,
      z: g.position.z,
    }));

    clockRef.current = new THREE.Clock();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clockRef.current.getElapsedTime();
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      groups.forEach((obj, i) => {
        const { rotY = 0.007, rotX = 0.001, floatAmp = 0.25, floatSpeed = 1.0, floatOffset = 0 } = obj.userData;
        const base = basePositionsRef.current[i];
        if (!base) return;

        obj.rotation.y += rotY + mx * 0.0008;
        obj.rotation.x += rotX + my * 0.0004;

        // Smooth float
        obj.position.y = base.y + Math.sin(t * floatSpeed + floatOffset) * floatAmp;

        // Subtle X sway
        obj.position.x = base.x + Math.sin(t * floatSpeed * 0.4 + floatOffset) * floatAmp * 0.12;
      });

      // Camera parallax
      camera.position.x += (mx * 0.6 - camera.position.x) * 0.035;
      camera.position.y += (0.5 + my * 0.4 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();
    return () => cancelAnimationFrame(frameRef.current);
  }, [slide]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute', inset: 0,
        opacity: transitioning ? 0 : 1,
        transition: 'opacity 0.45s ease',
      }}
    />
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
    width: 100%; height: calc(100vh - 80px); min-height: 650px;
    display: grid; grid-template-columns: 54% 46%;
    background: #080705; overflow: hidden;
  }
  @media (max-width: 992px) { .hero-section { grid-template-columns: 50% 50%; } }
  @media (max-width: 768px) {
    .hero-root { padding-top: 60px; }
    .hero-section {
      display: flex; flex-direction: column-reverse;
      height: auto; min-height: calc(100svh - 60px);
    }
  }

  .left-panel {
    position: relative; display: flex; flex-direction: column;
    justify-content: center; padding: 0 6vw; z-index: 20;
  }
  @media (max-width: 768px) {
    .left-panel { padding: 40px 7vw 80px; height: auto; width: 100%; }
  }

  .counter {
    font-size: 10px; letter-spacing: 0.45em; color: rgba(255,255,255,0.22);
    margin-bottom: clamp(20px,4vh,36px); display: flex; align-items: center; gap: 14px;
  }
  .eyebrow { font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; margin-bottom: 18px; }
  .headline {
    font-weight: 300; line-height: 1.08; letter-spacing: -0.025em;
    color: #fff; margin-bottom: 24px; font-size: clamp(34px, 4.5vw, 86px);
  }
  @media (max-width: 768px) { .headline { font-size: clamp(30px, 9vw, 42px); } }
  .headline em {
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    font-weight: 300; color: rgba(255,255,255,0.58);
  }
  .subline {
    font-size: 11px; line-height: 1.95; color: rgba(255,255,255,0.35);
    max-width: 380px; margin-bottom: clamp(30px,5vh,44px); letter-spacing: 0.04em;
  }
  .cta-row { display: flex; gap: 16px; flex-wrap: wrap; }
  .btn-fill {
    padding: 18px 42px; font-family: 'Overpass Mono', monospace;
    font-size: 9px; letter-spacing: 0.38em; text-transform: uppercase;
    text-decoration: none; border: none; cursor: pointer; color: #080705;
    font-weight: 600; display: inline-block;
    transition: transform 0.3s cubic-bezier(0.2,1,0.3,1), box-shadow 0.3s;
  }
  .btn-fill:hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
  .btn-outline {
    padding: 17px 42px; border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.5); font-family: 'Overpass Mono', monospace;
    font-size: 9px; letter-spacing: 0.38em; text-transform: uppercase;
    text-decoration: none; background: transparent; cursor: pointer;
    transition: all 0.3s ease; display: inline-block;
  }
  .btn-outline:hover { border-color: #fff; color: #fff; background: rgba(255,255,255,0.05); }

  .dots { position: absolute; bottom: 42px; left: 6vw; display: flex; gap: 10px; }
  @media (max-width: 768px) { .dots { bottom: 30px; left: 7vw; } }
  .dot { height: 2px; cursor: pointer; transition: all 0.6s cubic-bezier(0.4,0,0.2,1); }

  .right-panel {
    position: relative; overflow: hidden;
    border-left: 1px solid rgba(255,255,255,0.05);
  }
  @media (max-width: 768px) {
    .right-panel {
      height: 42vh; min-height: 300px; width: 100%;
      border-left: none; border-bottom: 1px solid rgba(255,255,255,0.05);
    }
  }
  .grid-lines {
    position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
    background-size: 60px 60px;
  }
  .right-label {
    position: absolute; top: 28px; right: 28px; z-index: 40;
    font-family: 'Overpass Mono', monospace;
    font-size: 8px; letter-spacing: 0.6em; text-transform: uppercase;
  }
  .scene-hint {
    position: absolute; bottom: 22px; left: 28px; z-index: 40;
    font-family: 'Overpass Mono', monospace;
    font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.1);
  }

  .fi { opacity: 0; transform: translateY(20px); animation: fadeUp 0.8s ease forwards; }
  .fd1 { animation-delay: 0.1s; } .fd2 { animation-delay: 0.2s; }
  .fd3 { animation-delay: 0.3s; } .fd4 { animation-delay: 0.4s; }
  .fd5 { animation-delay: 0.5s; }
  @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
`;

/* ══════════════════════════════════════════════════
   HERO COMPONENT
══════════════════════════════════════════════════ */
const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (index === current || transitioning) return;
    setTransitioning(true);
    setTimeout(() => { setCurrent(index); setTransitioning(false); }, 450);
  }, [current, transitioning]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  useEffect(() => {
    const iv = setInterval(next, 6500);
    return () => clearInterval(iv);
  }, [next]);

  const slide = slides[current];

  return (
    <>
      <style>{STYLES}</style>
      <div className="hero-root">
        <section className="hero-section">

          {/* LEFT */}
          <div className="left-panel">
            <div className="counter fi fd1">
              <div style={{ width: 32, height: 1, background: slide.accent, transition: 'background 0.8s ease', flexShrink: 0 }} />
              <span>0{current + 1} — 0{slides.length}</span>
            </div>

            <div className="eyebrow fi fd2" style={{
              color: slide.accent,
              transition: 'color 0.8s ease, opacity 0.4s ease, transform 0.4s ease',
              opacity: transitioning ? 0 : 1,
              transform: `translateY(${transitioning ? '10px' : '0'})`,
            }}>
              {slide.category} Collection
            </div>

            <h1 className="headline fi fd3" style={{
              opacity: transitioning ? 0 : 1,
              transform: `translateY(${transitioning ? '15px' : '0'})`,
              transition: 'opacity 0.4s ease 0.05s, transform 0.4s ease 0.05s',
            }}>
              Everything for<br />
              <em>Modern Living.</em>
            </h1>

            <p className="subline fi fd4" style={{
              opacity: transitioning ? 0 : 1,
              transition: 'opacity 0.4s ease 0.1s',
            }}>
              Artisan groceries, curated tech, slow-fashion, and bespoke furniture —
              an intentional archive for every aspect of your day.
            </p>

            <div className="cta-row fi fd5">
              <Link to="/shop">
                <button className="btn-fill" style={{ background: slide.accent, transition: 'background 0.8s ease' }}>
                  Browse Collection
                </button>
              </Link>
              <Link to="/categories">
                <button className="btn-outline">View Categories</button>
              </Link>
            </div>

            <div className="dots">
              {slides.map((_, i) => (
                <div key={i} className="dot" style={{
                  width: i === current ? '45px' : '15px',
                  background: i === current ? slide.accent : 'rgba(255,255,255,0.15)',
                }} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>

          {/* RIGHT — 3D SCENE */}
          <div className="right-panel">
            <div style={{
              position: 'absolute', inset: 0, zIndex: 1,
              background: slide.bg,
              transition: 'background 1s cubic-bezier(0.4,0,0.2,1)',
            }} />
            <div className="grid-lines" />

            <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
              <ThreeScene slide={slide} transitioning={transitioning} />
            </div>

            <div className="right-label" style={{
              color: slide.accent,
              transition: 'color 0.8s ease, opacity 0.4s',
              opacity: transitioning ? 0 : 1,
            }}>
              {slide.label}
            </div>

            <div className="scene-hint">3D Preview · Move cursor to interact</div>
          </div>

        </section>
      </div>
    </>
  );
};

export default Hero;