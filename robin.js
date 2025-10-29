import { getDetections } from "./assets/video_process.js";

// APPLE: x,y = Pos, Rot = Rot

// PEAR: x = c:sticker, y = c:stroke, Rot = Font

// BANANA: x = strokeweight, y =stroke on/off, Rot = Size

// MANGO: x = Ita, y = Wght, Rot = width

//CALIBRATE THESE VALUES

let calibrMin = 200;
let calibrMax = 450;
let stickers = [];
let ranSvg;
let ranRotDir;
let svg;
let laststicker = null;
let tomato;
let tomatoX;
let tomatoY;
// let switchSticker = false;
let switch0 = true;
let switch1 = true;
let switchMove = true;
let firstCorner0;
let corner0X, corner0Y;
let currentFont;
//distances
let distAP;
let distAB;
let distAM;
let distBP;
let distBA;
let distBM;
let distMP;
let italValue = null;
let wghtValue = null;
let labelnames = [
  "Doux",
  "Viva",
  "Bombo",
  "Fresco",
  "Bio",
  "Sol",
  "Vita",
  "Gold",
];

let colorfills = [
  "#ff6200ff",
  "#ff6200ff",
  "#ff4124",
  "#ff4124",
  "#00be36",
  "#00be36",
  "#f4f5f5",
  "#4df5ed",
  "#4df5ed",
  "#e5f100",
  "#e5f100",
  "#e5f100",
  "#000000",
  "#f4f5f5",
  "#f4f5f5",
  "#f4f5f5",
];
let colorstrokes = [
  "#ff8200",
  "#ff4124",
  "#00be36",
  "#f4f5f5",
  "#4df5ed",
  "#e5f100",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
  "#000000",
];

//interface

let num1, num2, num3, num4;

class Sticker {
  constructor(stickerText) {
    this.sticker = document.createElement("div");
    this.sticker.classList.add("sticker-holder");

    let textHolder = document.createElement("div");
    textHolder.classList.add("label");
    textHolder.textContent = stickerText;

    //random POS
    this.sticker.style.left = Math.floor(Math.random() * 100 - 10) + "%";
    this.sticker.style.top = Math.floor(Math.random() * 100 - 10) + "%";

    // RANDOM ROT
    let ranRotDir = Math.floor(Math.random() * 2);
    if (ranRotDir === 0) {
      this.sticker.style.rotate = Math.floor(Math.random() * 30) + "deg";
    } else {
      this.sticker.style.rotate = Math.floor(Math.random() * -30) + "deg";
    }

    let ranFill = colorfills[Math.floor(Math.random() * colorfills.length)];
    let ranStrCol =
      colorstrokes[Math.floor(Math.random() * colorstrokes.length)];

    ranSvg = Math.floor(Math.random() * 6 + 1);
    // ranSvg = 4;
    if (ranSvg === 1) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 105 58.03">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <path d="M104,1v56.03h-40.91c0-2.92-1.18-5.56-3.1-7.48-1.92-1.92-4.56-3.1-7.49-3.1s-5.57,1.18-7.49,3.1-3.1,4.56-3.1,7.48H1V1h40.91c0,5.84,4.74,10.57,10.59,10.57,2.92,0,5.57-1.18,7.49-3.1,1.92-1.91,3.1-4.56,3.1-7.48h40.91Z" fill="${ranFill}"/>
      <path id="borderPath" d="M105,58.03h-42.91v-1c0-2.56-1-4.96-2.81-6.77-1.81-1.81-4.22-2.81-6.78-2.81s-4.97,1-6.78,2.81c-1.81,1.81-2.81,4.21-2.81,6.77v1H0V0h42.91v1c0,5.28,4.3,9.57,9.59,9.57,2.56,0,4.97-1,6.78-2.81,1.81-1.81,2.81-4.21,2.81-6.77V0h42.91v58.03ZM64.05,56.03h38.96V2h-38.96c-.23,2.71-1.4,5.23-3.35,7.18-2.19,2.19-5.1,3.39-8.19,3.39-6.05,0-11.03-4.66-11.54-10.57H2v54.03h38.96c.23-2.71,1.4-5.23,3.35-7.18,2.19-2.19,5.1-3.39,8.19-3.39s6.01,1.2,8.19,3.39c1.95,1.95,3.12,4.47,3.35,7.18Z" fill="${ranStrCol}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 2) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 117.44 64.8">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <path d="M116.44,16.7v31.4c-8.68,0-15.72,7.03-15.72,15.7H16.72c0-8.67-7.04-15.7-15.72-15.7v-31.4c8.68,0,15.72-7.03,15.72-15.7h84c0,8.67,7.04,15.7,15.72,15.7h0Z" fill="${ranFill}"/>
      <path id="borderPath" d="M101.72,64.8H15.72v-1c0-8.11-6.6-14.7-14.72-14.7H0V15.7h1c8.12,0,14.72-6.6,14.72-14.7V0h86v1c0,8.11,6.6,14.7,14.72,14.7h1v33.4h-1c-8.12,0-14.72,6.59-14.72,14.7v1ZM17.69,62.8h82.06c.5-8.41,7.27-15.17,15.69-15.67v-29.46c-8.42-.5-15.19-7.26-15.69-15.67H17.69c-.5,8.42-7.27,15.17-15.69,15.67v29.46c8.42.5,15.19,7.26,15.69,15.67Z" fill="${ranStrCol}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 3) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 116.44 92.91">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <polygon points="58.22 1.52 68.08 12.75 83.22 5.97 85.86 19.43 103.27 18.44 98.15 31.46 114.4 36.46 102.54 46.46 114.4 56.46 98.15 61.46 103.27 74.48 85.86 73.48 83.22 86.95 68.08 80.16 58.22 91.4 48.36 80.16 33.22 86.95 30.59 73.48 13.17 74.48 18.29 61.46 2.05 56.46 13.9 46.46 2.05 36.46 18.29 31.46 13.17 18.44 30.59 19.43 33.22 5.97 48.36 12.75 58.22 1.52" fill="${ranFill}"/>
      <path id="borderPath" d="M58.22,92.91l-10.13-11.54-15.61,7-2.71-13.84-18.1,1.03,5.29-13.47L0,56.87l12.35-10.42L0,36.04l16.96-5.22-5.29-13.47,18.1,1.03,2.71-13.84,15.61,7L58.22,0l10.13,11.54,15.61-7,2.71,13.84,18.1-1.03-5.29,13.47,16.96,5.22-12.35,10.42,12.35,10.42-16.96,5.22,5.29,13.47-18.1-1.03-2.71,13.84-15.61-7-10.13,11.54ZM48.62,78.95l9.6,10.94,9.6-10.94,14.66,6.57,2.56-13.08,16.73.95-4.94-12.57,15.52-4.78-11.36-9.58,11.36-9.58-15.52-4.78,4.94-12.57-16.73.95-2.56-13.08-14.66,6.57-9.6-10.94-9.6,10.94-14.66-6.57-2.56,13.08-16.73-.95,4.94,12.57-15.52,4.78,11.36,9.58-11.36,9.58,15.52,4.78-4.94,12.57,16.73-.95,2.56,13.08,14.66-6.57Z" fill="${ranStrCol}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 4) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 91.88 91.88">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <circle cx="45.94" cy="45.94" r="44.94" fill="${ranFill}"/>
      <path id="borderPath" d="M45.94,91.88C20.61,91.88,0,71.27,0,45.94S20.61,0,45.94,0s45.94,20.61,45.94,45.94-20.61,45.94-45.94,45.94ZM45.94,2C21.71,2,2,21.71,2,45.94s19.71,43.94,43.94,43.94,43.94-19.71,43.94-43.94S70.17,2,45.94,2Z" fill="${ranStrCol}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 5) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 114.35 91.88">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <ellipse cx="57.18" cy="45.94" rx="56.18" ry="44.94" fill="${ranFill}"/>
      <path d="M57.18,91.88C25.65,91.88,0,71.27,0,45.94S25.65,0,57.18,0s57.18,20.61,57.18,45.94-25.65,45.94-57.18,45.94ZM57.18,2C26.75,2,2,21.71,2,45.94s24.75,43.94,55.18,43.94,55.18-19.71,55.18-43.94S87.6,2,57.18,2Z" fill="${ranStrCol}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 6) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 114.35 91.88">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <rect x="1" y="1" width="112.35" height="89.88" fill="${ranFill}"/>
      <path d="M114.35,91.88H0V0h114.35v91.88ZM2,89.88h110.35V2H2v87.88Z" fill="${ranStrCol}"/>
    </g>
  </g>
</svg>`;
    }

    this.sticker.innerHTML = textHolder.outerHTML + svg;
  }

  animate() {
    gsap.to(this.sticker, {
      rotate: "+=8deg",
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }

  moveLast() {
    laststicker = stickers[stickers.length - 1];
    // console.log(laststicker);
  }

  appendTo(parent) {
    parent.appendChild(this.sticker);
  }
}

document.getElementById("s1-trigger").addEventListener("click", () => {
  //RANDOM label name from array
  createSticker();
});

// CON SOLEEE LOOOOGERRRRR
document.getElementById("s2-trigger").addEventListener("click", () => {
  checkLast(laststicker);
  // console.log(tomatoX, tomatoY);
});

document.getElementById("s3-trigger").addEventListener("click", () => {
  stickers = [];
  clear();
});

function clear() {
  document.querySelector(".sticker-canvas").innerHTML = "";
}

function checkLast(last) {
  // console.log(last);
}

document.getElementById("s4-trigger").addEventListener("click", () => {
  gsap.to(laststicker.sticker, { scale: 3, duration: 0 });
});

document.getElementById("size-slider").addEventListener("input", (e) => {
  const scaleValue = Number(e.target.value);
  gsap.to(laststicker.sticker, { scale: scaleValue, duration: 0.2 });
});

function createSticker() {
  let randomLabel = labelnames[Math.floor(Math.random() * labelnames.length)];

  let sticker = new Sticker(randomLabel);
  sticker.appendTo(document.querySelector(".sticker-canvas"));
  sticker.animate();
  stickers.push(sticker);

  laststicker = stickers[stickers.length - 1];
  if (stickers.length > 8) {
    stickers = [];
    clear();
  }
}

// window.addEventListener("load", () => {
//   createSticker();
// });

// ______

//DOM elements
const video = (window.video = document.getElementById("webcam_canvas"));
const canvas = (window.canvas = document.getElementById("out_canvas"));

//dimensions for canvas
canvas.width = 480;
canvas.height = 360;

//constraints for webcam
const constraints = {
  audio: false,
  video: true,
  video: { width: 1280, height: 720 },
};

//success
function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

//potential error
function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}
//webcam
navigator.mediaDevices
  .getUserMedia(constraints)
  .then(handleSuccess)
  .catch(handleError);

function angle2DFromCorners(det) {
  const dx = det.corners[1].x - det.corners[0].x;
  const dy = det.corners[1].y - det.corners[0].y;
  return (Math.atan2(dy, dx) * 180) / Math.PI; // gradi
}

function loop() {
  requestAnimationFrame(loop);

  const detections = getDetections();
  const ids = detections.map((d) => d.id);

  const distDiv = document.getElementById("distDisplay");
  distDiv.innerHTML = ""; // CLEAR

  //WIDTH CALC
  function tagPixelWidth(det) {
    const c0 = det.corners[0];
    const c1 = det.corners[1];
    return Math.hypot(c1.x - c0.x, c1.y - c0.y);
  }

  function getcorner(det) {
    const c0 = det.corners[0];
    return c0;
  }

  //DEBUG

  detections.forEach((det) => {
    const tagwidth = tagPixelWidth(det);

    const c0 = det.corners[0];
    const angle = angle2DFromCorners(det);

    const p = document.createElement("p");

    p.textContent = `Tag ${det.id}, tagwidth=${tagwidth.toFixed(1)},
corner0=(${c0.x.toFixed(1)}, ${c0.y.toFixed(1)}),
rotation=${angle.toFixed(1)}°`;

    p.style.whiteSpace = "pre-line";
    distDiv.appendChild(p);
  });

  const pDist = document.createElement("p");
  pDist.textContent = `distAP: ${distAP}, font:${currentFont} \n distAM: ${distAM} `;
  pDist.style.whiteSpace = "pre-line";
  distDiv.appendChild(pDist);

  //A0: ROT: Sticker
  if (ids.includes(1) && laststicker) {
    //BIG Number 11
    num1 = document.getElementById("fruitNumber-1");
    num1.textContent = "➊";

    //FontSelectionRegions
    const fsr_1 = document.getElementById("fsr-UnicaSoft");
    const fsr_2 = document.getElementById("fsr-UnicaMono");
    const fsr_3 = document.getElementById("fsr-Unica");

    const detection = detections.find((det) => det.id === 1);
    console.log("this is ID:1");
    if (!detection) return;

    let angle = angle2DFromCorners(detection);
    if (angle < 0) angle += 360;

    const lbl = laststicker.sticker.querySelector(".label");
    if (!lbl) return;

    //AngleDisplayLogic

    const pointerRotation = document.getElementById("pointerRotation");
    const roundedAngle = Math.round(angle) * -1;

    let lastUpdate = 0;

    function updateRotation(timestamp) {
      if (timestamp - lastUpdate > 32) {
        pointerRotation.style.transform = `rotate(${angle}deg)`;
        lastUpdate = timestamp;
      }
      requestAnimationFrame(updateRotation);
    }

    updateRotation();

    if (angle < 60) {
      fsr_2.className = "fsr-UnicaMonoStandby";
      fsr_3.className = "fsr-UnicaStandby";

      fsr_1.classList.remove("fsr-UnicaSoftStandby");
      fsr_1.classList.add("fsr-UnicaSoftActive");
      lbl.style.fontFamily = "unicaSoft";
      currentFont = "unicaSoft";
    } else if (angle < 120) {
      fsr_1.className = "fsr-UnicaSoftStandby";
      fsr_3.className = "fsr-UnicaStandby";

      fsr_2.classList.remove("fsr-UnicaMonoStandby");
      fsr_2.classList.add("fsr-UnicaMonoActive");
      lbl.style.fontFamily = "unicaMono";
      currentFont = "unicaMono";
    } else if (angle < 180) {
      fsr_1.className = "fsr-UnicaSoftStandby";
      fsr_2.className = "fsr-UnicaMonoStandby";

      fsr_3.classList.remove("fsr-UnicaStandby");
      fsr_3.classList.add("fsr-UnicaActive");
      lbl.style.fontFamily = "unica";
      currentFont = "unica";
    } else if (angle < 240) {
      fsr_2.className = "fsr-UnicaMonoStandby";
      fsr_3.className = "fsr-UnicaStandby";

      fsr_1.classList.remove("fsr-UnicaSoftStandby");
      fsr_1.classList.add("fsr-UnicaSoftActive");
      lbl.style.fontFamily = "unicaSoft";
      currentFont = "unicaSoft";
    } else if (angle < 300) {
      fsr_1.className = "fsr-UnicaSoftStandby";
      fsr_3.className = "fsr-UnicaStandby";

      fsr_2.classList.remove("fsr-UnicaMonoStandby");
      fsr_2.classList.add("fsr-UnicaMonoActive");
      lbl.style.fontFamily = "unicaMono";
      currentFont = "unicaMono";
    } else {
      fsr_2.className = "fsr-UnicaMonoStandby";
      fsr_3.className = "fsr-UnicaStandby";

      fsr_3.classList.remove("fsr-UnicaStandby");
      fsr_3.classList.add("fsr-UnicaActive");
      lbl.style.fontFamily = "unica";
      currentFont = "unica";
    }

    //ValueReader
    const valueA0_1 = document.getElementById("propertyValue-Sa1");
    const valueA0_2 = document.getElementById("propertyValue-Sa2");
    const valueA0_3 = document.getElementById("propertyValue-mws-number");

    if (valueA0_1) {
      let text = valueA0_1.textContent.trim();
      let text1 = valueA0_2.textContent.trim();
      let text2 = valueA0_2.textContent.trim();
      let unit = text.replace(/[0-9]+/, "");
      let unit1 = text1.replace(/[0-9]+/, "");
      let unit2 = text2.replace(/[0-9]+/, "");

      const roundedAngle = Math.round(angle);
      const radians = Math.round((roundedAngle * Math.PI) / 180); // ✅ convert degrees → radians

      valueA0_1.textContent = roundedAngle + unit;
      valueA0_2.textContent = radians + unit1;
      valueA0_3.textContent = radians + "%";
      valueA0_1.style.backgroundColor = "red";
      valueA0_2.style.backgroundColor = "red"; //🔴
    }
  } else {
    //BIG Number 12
    num1 = document.getElementById("fruitNumber-1");
    num1.textContent = "➀";
  }

  //M2: ROT: Font Size
  if (ids.includes(2) && laststicker) {
    //BIG Number 21
    num2 = document.getElementById("fruitNumber-2");
    num2.textContent = "➋";

    const detection = detections.find((det) => det.id === 2);
    if (!detection) return;

    let angle = angle2DFromCorners(detection);
    if (angle < 0) angle += 360;

    const lbl = laststicker.sticker.querySelector(".label");
    if (!lbl) return;

    // FONT SCALING
    const minSize = 10;
    const maxSize = 55;
    const size = minSize + (maxSize - minSize) * (angle / 360);

    lbl.style.fontSize = `${size}px`;

    //ValueReader
    const valueM2_1 = document.getElementById("propertyValue-Mo");

    if (valueM2_1) {
      let text3 = valueM2_1.textContent.trim();
      let unit = text3.replace(/[0-9]+/, "");

      const roundedSize = Math.round(size);

      valueM2_1.textContent = roundedSize + unit;
      valueM2_1.style.backgroundColor = "red"; //🔴
    }
  } else {
    //BIG Number 22
    num2 = document.getElementById("fruitNumber-2");
    num2.textContent = "➁";
  }

  if (ids.includes(3) && laststicker) {
    //BIG Number 31
    num3 = document.getElementById("fruitNumber-3");
    num3.textContent = "➌";

    const detection = detections.find((det) => det.id === 3);
    if (!detection) return;

    let angle = angle2DFromCorners(detection);
    if (angle < 0) angle += 360;

    const lbl = laststicker.sticker.querySelector(".label");
    if (!lbl) return;

    // Mapping WinkelSkalierung
    // 0° = 0.5x
    // 180° = 1.5x
    // 360° = 2x
    const minScale = 0.5;
    const maxScale = 2;
    const scale = minScale + (maxScale - minScale) * (angle / 360);

    gsap.to(laststicker.sticker, {
      scale: scale,
      duration: 0.1,
      ease: "sine.inOut",
    });

    //ValueReader
    const valueM2_2 = document.getElementById("propertyValue-Fr");

    if (valueM2_2) {
      let text4 = valueM2_2.textContent.trim();
      let unit = text4.replace(/[0-9]+/, "");

      const roundedScale = Math.round(scale);

      valueM2_2.textContent = roundedScale + unit;
      valueM2_2.style.backgroundColor = "red"; //🔴
    }
  } else {
    //BIG Number 32
    num3 = document.getElementById("fruitNumber-3");
    num3.textContent = "➂";
  }

  // r:A0P1: ITALIC
  // ---- Distanz berechnen & Slant anwenden ----
  if (ids.includes(0) && ids.includes(1) && laststicker) {
    const det0 = detections.find((d) => d.id === 0);
    const det1 = detections.find((d) => d.id === 1);

    const dx = det0.center.x - det1.center.x;
    const dy = det0.center.y - det1.center.y;

    distAP = Math.hypot(dx, dy);
    //CALB1
    const minDist = calibrMin;
    const maxDist = calibrMax;
    let minVal, maxVal, minValWght, maxValWght;

    //DIFFR PARAMETERS ITALIC
    if (currentFont === "unicaSoft") {
      minVal = 0;
      maxVal = 10;
    } else if (currentFont === "unicaMono") {
      minVal = 0.1;
      maxVal = 1;
    } else if (currentFont === "unica") {
      minVal = 1;
      maxVal = 24;
    }

    let ital = (distAP - minDist) / (maxDist - minDist);
    ital = Math.max(0, Math.min(1, ital));
    ital = minVal + ital * (maxVal - minVal);

    // const lbl = sticker.querySelector(".label");
    const lbl = laststicker.sticker.querySelector(".label");
    if (lbl) {
      // lbl.style.fontVariationSettings = `"wght" ${wght.toFixed(2)}`;
      if (currentFont === "unica") {
        italValue = ital.toFixed(2);
      } else {
        italValue = ital.toFixed(2);
      }
    }

    //ValueReader
    const valueA0P1 = document.getElementById("propertyValue-42");

    if (valueA0P1) {
      let text5 = valueA0P1.textContent.trim();
      let unit = text5.replace(/[0-9]+/, "");

      const roundedItal = Math.round(ital);

      valueA0P1.textContent = roundedItal + unit;
      valueA0P1.style.backgroundColor = "red"; //🔴
    }
  } else {
    distAP = undefined;
  }

  // r:A0M2: WEIGHT
  if (ids.includes(0) && ids.includes(2) && laststicker) {
    const det0 = detections.find((d) => d.id === 0);
    const det1 = detections.find((d) => d.id === 2);

    const dx = det0.center.x - det1.center.x;
    const dy = det0.center.y - det1.center.y;
    distAM = Math.hypot(dx, dy);

    const minDist = calibrMin;
    const maxDist = calibrMax;

    let minVal, maxVal, minValWght, maxValWght;

    // DIFFR PARAMETERS WGHT
    if (currentFont === "unicaSoft") {
      minValWght = 57;
      maxValWght = 228;
    } else if (currentFont === "unicaMono") {
      minValWght = 300;
      maxValWght = 700;
    } else if (currentFont === "unica") {
      minValWght = 32;
      maxValWght = 228;
    }

    let wght = (distAM - minDist) / (maxDist - minDist);
    wght = Math.max(0, Math.min(1, wght));
    wght = minValWght + wght * (maxValWght - minValWght);

    // const lbl = sticker.querySelector(".label");
    const lbl = laststicker.sticker.querySelector(".label");
    if (lbl) {
      wghtValue = wght.toFixed(2);
    }

    //ValueReader
    const valueA0M2 = document.getElementById("propertyValue-41");

    if (valueA0M2) {
      let text6 = valueA0M2.textContent.trim();
      let unit = text6.replace(/[0-9]+/, "");

      const roundedWght = Math.round(wght);

      valueA0M2.textContent = roundedWght + unit;
      valueA0M2.style.backgroundColor = "red"; //🔴
    }
  } else {
    distAM = undefined;
  }

  // r:A0B3: FONT COLOR
  if (ids.includes(0) && ids.includes(3) && laststicker) {
    const det0 = detections.find((d) => d.id === 0);
    const det1 = detections.find((d) => d.id === 3);

    const dx = det0.center.x - det1.center.x;
    const dy = det0.center.y - det1.center.y;
    const distAB = Math.hypot(dx, dy); // Distanz berechnen
    const lbl = laststicker.sticker.querySelector(".label");

    const valueA0B3 = document.getElementById("propertyValue-21");

    //ValueReader

    if (lbl) {
      if (distAB < (calibrMin + calibrMax) / 2) {
        lbl.style.color = "white";
        valueA0B3.textContent.trim();
        valueA0B3.textContent = "White";
        valueA0B3.style.backgroundColor = "red"; //🔴
        // lbl.style.webkitTextStroke = ".5px black"; // Outline hinzufügen
      } else {
        lbl.style.color = "black";
        valueA0B3.textContent.trim();
        valueA0B3.textContent = "Black";
        valueA0B3.style.backgroundColor = "red"; //🔴
        // lbl.style.webkitTextStroke = "0px"; // Outline entfernen
      }
    }
  }

  // r:B31P: stroke on / off
  if (ids.includes(3) && ids.includes(1) && laststicker) {
    const det0 = detections.find((d) => d.id === 3);
    const det1 = detections.find((d) => d.id === 1);

    const dx = det0.center.x - det1.center.x;
    const dy = det0.center.y - det1.center.y;
    const distAB = Math.hypot(dx, dy);

    const valueB31P = document.getElementById("propertyValue-12");

    const border = laststicker.sticker.querySelector("#borderPath");
    // border.style.display = "none"; // Border ausblenden
    //ValueReader
    if (border) {
      const hideDist = (calibrMin + calibrMax) / 2; // <--- Abstandsschwelle anpassen
      if (distAB < hideDist) {
        border.style.display = "none"; // Border ausblenden
        valueB31P.textContent = "Transparent";
        valueB31P.style.backgroundColor = "red"; //🔴
      } else {
        border.style.display = "block"; // Border anzeigen
        valueB31P.textContent = "Solid";
        valueB31P.style.backgroundColor = "red"; //🔴
      }
    }
  }

  //COMBINING VAR SETTINGS

  if (laststicker) {
    const lbl = laststicker.sticker.querySelector(".label");
    if (lbl) {
      const settings = [];
      if (italValue !== null) {
        // unicaSoft/unicaMono nutzen ital, unica nutzt slnt
        settings.push(
          currentFont === "unica"
            ? `"slnt" ${italValue}`
            : `"ital" ${italValue}`
        );
      }
      if (wghtValue !== null) settings.push(`"wght" ${wghtValue}`);
      if (settings.length)
        lbl.style.fontVariationSettings = settings.join(", ");
    }
  }

  // INT0: Placing Stickers, ind. Swtiches
  //CALIBRATION1 PLACING EVENT:
  detections.forEach((det) => {
    const tagwidth = tagPixelWidth(det);
    if (det.id === 0) {
      if (tagwidth > 80 && switch0) {
        createSticker();
        switch0 = false;
      } else if (tagwidth < 80) switch0 = true;
    }

    if (det.id === 1) {
      if (tagwidth > 100 && switch1) {
        createSticker();
        switch1 = false;
      } else if (tagwidth < 90) switch1 = true;
    }
  });

  // PLACING STICKERS
  if (ids.includes(0) && laststicker) {
    num4 = document.getElementById("fruitNumber-4");
    num4.textContent = "➍";

    const detection = detections.find((det) => det.id === 0);
    const angle = angle2DFromCorners(detection);
    // angle = Math.round(angle);
    gsap.to(laststicker.sticker, { rotation: angle, duration: 0.2 });

    const tagwidth = tagPixelWidth(detection);
    // console.log("tagwidth:", tagwidth);

    // MOVING STICKER
    // if (tagwidth < 85) {
    //   const c0 = detection.corners[0];
    //   const container = document.querySelector(".sticker-canvas");

    //   const percX = ((c0.x / container.clientWidth) * 100) / 2;
    //   const percY = (c0.y / container.clientHeight) * 100;

    //   laststicker.sticker.style.left = `${percX}%`;
    //   laststicker.sticker.style.top = `${percY}%`;
    // }
  } else {
    num4 = document.getElementById("fruitNumber-4");
    num4.textContent = "➃";
  }
}

loop();
