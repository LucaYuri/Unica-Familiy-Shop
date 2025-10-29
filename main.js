import { getDetections } from "./assets/video_process.js";

// APPLE: x,y = Pos, Rot = Rot

// PEAR: x = c:sticker, y = c:stroke, Rot = Font

// BANANA: x = strokeweight, y =stroke on/off, Rot = Size

// MANGO: x = Ita, y = Wght, Rot = width

//CALIBRATE THESE VALUES
let calibrMin = 100;
let calibrMax = 400;

// desk setup
let placeDistance = 35;

// presentation setup
// let placeDistance = 40;

let stickers = [];
let ranRotDir;
let svg;
let laststicker = null;
let tomato;
let tomatoX;
let tomatoY;
// let switchSticker = false;
let switch0 = true;
let switch1 = true;
let switch2 = true;
let switch3 = true;
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
let wdthValue = null;
let labelnames = [
  "Gold",
  "Viva",
  "Bombo",
  "Fresco",
  "Bio",
  "Sale",
  "NEW",
  "BIO",
  "Expiry",
  "USE BY\n2310",
  "KG",
  "***",
  // "0.75₿",
  "1.23£",
  "CHF",
  "CHF\n13.–",
  "CHF\n0.70",
  "CHF\n0.69",
  "WALTER©",
  "yuri©",
  "50%",
  "30%",
  "99.99%",
  "*",
  "UFS",
  "*.*",
];
let labelnamesLong = [
  "Soft\nDelight",
  "Fresh\nEnergy",
  "Not\nBio",
  "Max\nHavalar",
  "Pure\nNature",
  "Gold\nWarm",
  "Fair\nTrade",
  "Verde\nVita",
];
let longlabel = true;
let ranFill;
let colorfills = [
  "#FF69B4",
  "#ff4124",
  "#00be36",
  "#f7f7f7ff",
  "#4df5ed",
  "#e5f100",
];
let colorstrokes = [
  "#ff8200",
  "#ff4124",
  "#00be36",
  "#f4f5f5",
  "#4df5ed",
  "#e5f100",
  ...Array(10).fill("#000000"),
];
let posabsX;
let posabsY;
let posabsXreal;
let posabsYreal;
let lineHeight;
let spawnSound = new Audio("beep.wav");
let spawnInterval = null;
let num1, num2, num3, num4;

class Sticker {
  constructor(stickerText, ranSvg) {
    this.sticker = document.createElement("div");
    this.sticker.classList.add("sticker-holder");

    let textHolder = document.createElement("div");
    textHolder.classList.add("label");
    textHolder.textContent = stickerText;

    //random POS

    posabsX = Math.floor(Math.random() * 100);
    posabsY = Math.floor(Math.random() * 100);

    const x = posabsX > 80 ? posabsX - 60 : posabsX;
    const y = posabsY > 80 ? posabsY - 10 : posabsY;

    this.sticker.style.left = x + "%";
    this.sticker.style.top = y + "%";

    posabsXreal = this.sticker.style.left = x + "%";
    posabsYreal = this.sticker.style.top = y + "%";

    // this.sticker.style.left = Math.floor(Math.random() * 100 - 30) + "%";
    // this.sticker.style.top = Math.floor(Math.random() * 100 - 30) + "%";

    // posabsX = this.sticker.style.left;
    // posabsY = this.sticker.style.top;

    // RANDOM ROT
    let ranRotDir = Math.floor(Math.random() * 2);
    if (ranRotDir === 0) {
      this.sticker.style.rotate = Math.floor(Math.random() * 30) + "deg";
    } else {
      this.sticker.style.rotate = Math.floor(Math.random() * -30) + "deg";
    }

    ranFill = colorfills[Math.floor(Math.random() * colorfills.length)];
    let ranStrCol =
      colorstrokes[Math.floor(Math.random() * colorstrokes.length)];

    if (ranSvg === 1) {
      // ranSvg = 4;
      svg = `<svg id="stkr-2_Red_" viewBox="0 0 685 560">
  
  <path id="stickersvg" d="M655,110v340h-248.3c0-17.7-7.2-33.8-18.8-45.4-11.6-11.6-27.7-18.8-45.4-18.8s-33.8,7.2-45.4,18.8-18.8,27.6-18.8,45.4H30V110h248.3c0,35.4,28.8,64.2,64.2,64.2s33.8-7.2,45.4-18.8c11.6-11.6,18.8-27.6,18.8-45.4h248.3Z" fill="${ranFill}"/>
  <path id="blursvg" d="M655,110v340h-248.3c0-17.7-7.2-33.8-18.8-45.4-11.6-11.6-27.7-18.8-45.4-18.8s-33.8,7.2-45.4,18.8-18.8,27.6-18.8,45.4H30V110h248.3c0,35.4,28.8,64.2,64.2,64.2s33.8-7.2,45.4-18.8c11.6-11.6,18.8-27.6,18.8-45.4h248.3Z" fill="${ranFill}"/>

  </svg>`;
    } else if (ranSvg === 2) {
      svg = `<svg id="stkr-3_Green_" viewBox="0 0 685 560">
      <polygon id="stickersvg" points="342.5 30 397.4 92.5 481.6 54.8 496.2 129.7 593.1 124.1 564.7 196.6 655 224.4 589.1 280 655 335.6 564.7 363.4 593.1 435.9 496.2 430.4 481.6 505.2 397.4 467.5 342.5 530 287.6 467.5 203.4 505.2 188.8 430.4 91.9 435.9 120.3 363.4 30 335.6 95.9 280 30 224.4 120.3 196.6 91.9 124.1 188.8 129.7 203.4 54.8 287.6 92.5 342.5 30" fill="${ranFill}"/>
  <polygon id="blursvg" points="342.5 30 397.4 92.5 481.6 54.8 496.2 129.7 593.1 124.1 564.7 196.6 655 224.4 589.1 280 655 335.6 564.7 363.4 593.1 435.9 496.2 430.4 481.6 505.2 397.4 467.5 342.5 530 287.6 467.5 203.4 505.2 188.8 430.4 91.9 435.9 120.3 363.4 30 335.6 95.9 280 30 224.4 120.3 196.6 91.9 124.1 188.8 129.7 203.4 54.8 287.6 92.5 342.5 30" fill="${ranFill}"/>

</svg>`;
    } else if (ranSvg === 3) {
      svg = `<svg id="stkr-4_White_" viewBox="0 0 685 560">
 
  <circle id="stickersvg" class="st0" cx="342.5" cy="280" r="250" fill="${ranFill}"/>
 <circle     id="blursvg" class="st0" cx="342.5" cy="280" r="250" fill="${ranFill}"/>

</svg>`;
    } else if (ranSvg === 4) {
      svg = `<svg id="stkr-5_Cyan_" viewBox="0 0 685 560">

  <ellipse id="stickersvg"  class="st0" cx="342.5" cy="280" rx="312.5" ry="250" fill="${ranFill}"/>
    <ellipse id="blursvg" class="st0" cx="342.5" cy="280" rx="312.5" ry="250" fill="${ranFill}"/>

</svg>`;
    } else if (ranSvg === 5) {
      svg = `<svg id="Layer_1"  viewBox="0 0 685 560">
  <rect id="stickersvg" class="st0" x="30" y="30" width="625" height="500" fill="${ranFill}"/>
    <rect id="blursvg" class="st0" x="30" y="30" width="625" height="500" fill="${ranFill}"/>

</svg>`;
    } else if (ranSvg === 6) {
      svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 690 580">  
  <g id="stkr-6">
    <path id="stickersvg" d="M657.5,205v170c-47,0-85.1,38.1-85.1,85H117.6c0-46.9-38.1-85-85.1-85v-170c47,0,85.1-38.1,85.1-85h454.8c0,46.9,38.1,85,85.1,85Z" fill="${ranFill}"/>
  <path id="blursvg" d="M657.5,205v170c-47,0-85.1,38.1-85.1,85H117.6c0-46.9-38.1-85-85.1-85v-170c47,0,85.1-38.1,85.1-85h454.8c0,46.9,38.1,85,85.1,85Z" fill="${ranFill}"/>
  </g>
</svg>`;
    }

    this.sticker.innerHTML = textHolder.outerHTML + svg;
  }

  animate() {
    // gsap.to(this.sticker, {
    //   rotate: "+=8deg",
    //   duration: 3,
    //   repeat: -1,
    //   yoyo: true,
    //   ease: "sine.inOut",
    // });
  }

  moveLast() {
    laststicker = stickers[stickers.length - 1];
    // console.log(laststicker);
  }

  appendTo(parent) {
    parent.appendChild(this.sticker);
  }
}

// document.getElementById("s1-trigger").addEventListener("click", () => {
//   //RANDOM label name from array
//   createSticker();
// });

// CON SOLEEE LOOOOGERRRRR
// document.getElementById("s2-trigger").addEventListener("click", () => {
//   checkLast(laststicker);
//   // console.log(tomatoX, tomatoY);
// });

// document.getElementById("s3-trigger").addEventListener("click", () => {
//   stickers = [];
//   clear();
// });

function clear() {
  document.querySelector(".sticker-canvas").innerHTML = "";
}

function checkLast(last) {
  // console.log(last);
}

// document.getElementById("s4-trigger").addEventListener("click", () => {
//   gsap.to(laststicker.sticker, { scale: 3, duration: 0 });
// });

// document.getElementById("size-slider").addEventListener("input", (e) => {
//   const scaleValue = Number(e.target.value);
//   gsap.to(laststicker.sticker, { scale: scaleValue, duration: 0.2 });
// });

function createSticker() {
  spawnSound.currentTime = 0;
  spawnSound.play();
  spawnSound.volume = 0.3;

  let ranSvg = Math.floor(Math.random() * 6 + 1);
  // let ranSvg = 6;

  let labelArray = ranSvg === 5 || ranSvg === 6 ? labelnamesLong : labelnames;
  let randomLabel = labelArray[Math.floor(Math.random() * labelArray.length)];

  let sticker = new Sticker(randomLabel, ranSvg);
  sticker.appendTo(document.querySelector(".sticker-canvas"));
  sticker.animate();
  stickers.push(sticker);

  laststicker = stickers[stickers.length - 1];
  if (stickers.length > 10) {
    stickers = [];
    clear();
  }
  // if (stickers.length > 8) {
  //   const first = stickers.shift(); // ersten Sticker aus dem Array entfernen
  //   if (first && first.sticker) first.sticker.remove(); // aus dem DOM löschen
  // }
}

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

  updatePointers(ids);

  //debug new

  // const distDiv = document.getElementById("distDisplay");
  // distDiv.innerHTML = ""; // CLEAR

  // const p = document.createElement("p");
  // p.textContent = `longlabel: ${longlabel}, posX: ${posabsX} / ${posabsXreal}, posY: ${posabsY} / ${posabsYreal}`;
  // distDiv.appendChild(p);

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

  //A0: ROT: Sticker
  if (ids.includes(1) && laststicker) {
    num1 = document.getElementById("fruitNumber-1");
    num1.textContent = "➊";

    //FontSelectionRegions
    const fsr_1 = document.getElementById("fsr-UnicaSoft");
    const fsr_2 = document.getElementById("fsr-UnicaMono");
    const fsr_3 = document.getElementById("fsr-Unica");

    const detection = detections.find((det) => det.id === 1);
    if (!detection) return;

    let angle = angle2DFromCorners(detection);
    if (angle < 0) angle += 360;

    const lbl = laststicker.sticker.querySelector(".label");
    if (!lbl) return;

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
    // const valueA0_1 = document.getElementById("propertyValue-Sa1");
    // const valueA0_2 = document.getElementById("propertyValue-Sa2");
    // const valueA0_3 = document.getElementById("propertyValue-mws-number");

    // if (valueA0_1) {
    //   let text = valueA0_1.textContent.trim();
    //   let text1 = valueA0_2.textContent.trim();
    //   let text2 = valueA0_2.textContent.trim();
    //   let unit = text.replace(/[0-9]+/, "");
    //   let unit1 = text1.replace(/[0-9]+/, "");
    //   let unit2 = text2.replace(/[0-9]+/, "");

    //   const roundedAngle = Math.round(angle);
    //   const radians = Math.round((roundedAngle * Math.PI) / 180); // ✅ convert degrees → radians

    //   valueA0_1.textContent = roundedAngle + unit;
    //   valueA0_2.textContent = radians + unit1;
    //   valueA0_3.textContent = radians + "%";
    // }
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
    const minSize = 20;
    const maxSize = 85;
    const size = minSize + (maxSize - minSize) * (angle / 360);

    lbl.style.fontSize = `${size}px`;

    const valueM2_1 = document.getElementById("propertyValue-Mo");

    if (valueM2_1) {
      let text3 = valueM2_1.textContent.trim();
      let unit = text3.replace(/[0-9]+/, "");

      const roundedSize = Math.round(size);

      valueM2_1.textContent = roundedSize + unit;
      // valueM2_1.style.backgroundColor = "red"; //🔴
    }
  } else {
    //BIG Number 22
    num2 = document.getElementById("fruitNumber-2");
    num2.textContent = "➁";
  }

  if (ids.includes(3) && laststicker) {
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
      const vibeScale = scale * 100;
      const roundedScale = Math.round(vibeScale);

      valueM2_2.textContent = roundedScale + unit;
      // valueM2_2.style.backgroundColor = "red"; //🔴
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

    //ValueReader
    const valueA0P1 = document.getElementById("propertyValue-42");

    if (valueA0P1) {
      let text5 = valueA0P1.textContent.trim();
      let unit = text5.replace(/[0-9]+/, "");

      const roundedItal = Math.round(ital);

      valueA0P1.textContent = roundedItal + unit;
    }

    const lbl = laststicker.sticker.querySelector(".label");
    if (lbl) {
      if (currentFont === "unica") {
        italValue = ital.toFixed(2);
      } else {
        italValue = ital.toFixed(2);
      }
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

    // ValueReader BUG
    const valueA0M2 = document.getElementById("propertyValue-41");

    if (valueA0M2) {
      const text6 = valueA0M2.textContent.trim();
      const unit = text6.replace(/[0-9.]+/g, "").trim(); // clean unit

      if (typeof wght === "number" && !isNaN(wght)) {
        const roundedWght = Math.round(wght);
        valueA0M2.textContent = roundedWght + unit;
      } else {
        console.warn("⚠️ Invalid wght value:", wght);
        valueA0M2.textContent = "-";
      }

      // valueA0M2.style.backgroundColor = "red"; // 🔴
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
      } else {
        lbl.style.color = "black";
        valueA0B3.textContent.trim();
        valueA0B3.textContent = "Black";
      }
    }
  }
  // r:B31P: line heihgt
  if (ids.includes(3) && ids.includes(1) && laststicker) {
    const det0 = detections.find((d) => d.id === 3);
    const det1 = detections.find((d) => d.id === 1);

    const dx = det0.center.x - det1.center.x;
    const dy = det0.center.y - det1.center.y;
    const distAP = Math.hypot(dx, dy);

    const minDist = calibrMin;
    const maxDist = calibrMax;

    const minLH = 20;
    const maxLH = 80;

    // Normalisierung
    let t = (distAP - minDist) / (maxDist - minDist);
    t = Math.max(0, Math.min(1, t));

    // Mapping auf line-height
    lineHeight = minLH + t * (maxLH - minLH);
    const lbl = laststicker.sticker.querySelector(".label");

    if (lbl) {
      lbl.style.lineHeight = `${lineHeight}px`;
    }
    const valueB31P = document.getElementById("propertyValue-12");

    valueB31P.textContent = Math.round(lineHeight) + "₩";
  }
  // COLOR STICKER
  // r:B3M2: width + fill
  if (ids.includes(3) && ids.includes(2) && laststicker) {
    const det0 = detections.find((d) => d.id === 3);
    const det1 = detections.find((d) => d.id === 2);

    const dx = det0.center.x - det1.center.x;
    const dy = det0.center.y - det1.center.y;
    distAP = Math.hypot(dx, dy);

    const minDist = calibrMin;
    const maxDist = calibrMax;

    const minVal = 1;
    const maxVal = 100;

    let wdth = (distAP - minDist) / (maxDist - minDist);
    wdth = Math.max(0, Math.min(1, wdth));
    wdth = minVal + wdth * (maxVal - minVal);
    wdthValue = wdth.toFixed(2);

    const colorIndex = Math.max(
      0,
      Math.min(
        colorfills.length - 1,
        Math.floor(
          ((distAP - minDist) / (maxDist - minDist)) * colorfills.length
        )
      )
    );
    const fillColor = colorfills[colorIndex];

    const shape = laststicker.sticker.querySelector("#stickersvg");
    const blur = laststicker.sticker.querySelector("#blursvg");

    if (shape) {
      shape.setAttribute("fill", fillColor);
      blur.setAttribute("fill", fillColor);
    }
  }

  // r:M2P1: Blendmode
  if (ids.includes(1) && ids.includes(2) && laststicker) {
    const det0 = detections.find((d) => d.id === 1);
    const det1 = detections.find((d) => d.id === 2);

    const dx = det0.center.x - det1.center.x;
    const dy = det0.center.y - det1.center.y;
    const distAP = Math.hypot(dx, dy);

    const minDist = calibrMin;
    const maxDist = calibrMax;

    // Distanz normalisieren
    let t = (distAP - minDist) / (maxDist - minDist);
    t = Math.max(0, Math.min(1, t));

    let mode = "1";
    if (t < 0.25) mode = "1";
    else if (t < 0.5) mode = ".9";
    else mode = "1";

    laststicker.sticker.style.opacity = mode;

    const valueopa = document.getElementById("propertyValue-11");

    valueopa.textContent = mode;
  }

  //COMBINING VAR SETTINGS

  if (laststicker) {
    const lbl = laststicker.sticker.querySelector(".label");
    if (lbl) {
      const settings = [];
      if (italValue !== null) {
        settings.push(
          currentFont === "unica"
            ? `"slnt" ${italValue}`
            : `"ital" ${italValue}`
        );
      }
      if (wghtValue !== null) settings.push(`"wght" ${wghtValue}`);
      if (wdthValue !== null) settings.push(`"wdth" ${wdthValue}`);
      if (settings.length)
        lbl.style.fontVariationSettings = settings.join(", ");
    }
  }
  //sticker rotation
  if (ids.includes(0) && laststicker) {
    num4 = document.getElementById("fruitNumber-4");
    num4.textContent = "➍";
    const detection = detections.find((det) => det.id === 0);
    const angle = angle2DFromCorners(detection);

    gsap.to(laststicker.sticker, { rotation: angle, duration: 0.2 });

    const pointerRotation = document.getElementById("pointerRotation");
    pointerRotation.style.transform = `rotate(${angle}deg)`;

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

      // ⬇️ Nur für Anzeige: Winkel immer 0–360
      let roundedAngle = Math.round(angle) * -1;
      if (roundedAngle < 0) roundedAngle += 360;

      const radians = Math.round((roundedAngle * Math.PI) / 180);

      console.log(roundedAngle);

      valueA0_1.textContent = roundedAngle + unit;
      valueA0_2.textContent = radians + unit1;
      valueA0_3.textContent = radians + "%";
    }
  } else {
    num4 = document.getElementById("fruitNumber-4");
    num4.textContent = "➃";
  }

  // INT0: Placing Stickers, ind. Swtiches
  // CALIBRATION1 PLACING EVENT:
  // BUG
  detections.forEach((det) => {
    const tagwidth = tagPixelWidth(det);
    if (det.id === 0) {
      if (tagwidth > placeDistance && switch0) {
        createSticker();
        switch0 = false;
      } else if (tagwidth < placeDistance) switch0 = true;
    }

    if (det.id === 1) {
      if (tagwidth > placeDistance && switch1) {
        createSticker();
        switch1 = false;
      } else if (tagwidth < placeDistance) switch1 = true;
    }

    if (det.id === 2) {
      if (tagwidth > placeDistance && switch2) {
        createSticker();
        switch2 = false;
      } else if (tagwidth < placeDistance) switch2 = true;
    }
    if (det.id === 3) {
      if (tagwidth > placeDistance && switch3) {
        createSticker();
        switch3 = false;
      } else if (tagwidth < placeDistance) switch3 = true;
    }
  });

  // PLACING STICKERS
  // --- PROGRAMM 2: Abstand Tag 4 & 5 steuert Spawnrate + random Font Settings + Sound Loop + Animated wdth/italic/wght ---
  const tag4 = detections.find((d) => d.id === 4);
  const tag5 = detections.find((d) => d.id === 5);

  if (!window.parcSound) {
    window.parcSound = new Audio("parc.wav");
    window.parcSound.loop = true;
    window.parcSound.volume = 0.7;
  }

  if (tag4 && tag5) {
    const dx = tag4.center.x - tag5.center.x;
    const dy = tag4.center.y - tag5.center.y;
    const dist45 = Math.hypot(dx, dy);

    const minDist = 100;
    const maxDist = 800;
    const minInterval = 5000;
    const maxInterval = 10;

    let t = (dist45 - minDist) / (maxDist - minDist);
    t = Math.max(0, Math.min(1, t));

    const intervalTime = maxInterval - t * (maxInterval - minInterval);

    if (window.parcSound.paused) window.parcSound.play();

    if (!spawnInterval || Math.abs(spawnInterval.time - intervalTime) > 100) {
      if (spawnInterval) clearInterval(spawnInterval.id);

      const id = setInterval(() => {
        createSticker();

        if (laststicker) {
          const lbl = laststicker.sticker.querySelector(".label");
          if (lbl) {
            // Zufällige Font Size & Line Height
            lbl.style.fontSize = `${Math.floor(Math.random() * 40) + 20}px`;
            lbl.style.lineHeight = `${Math.floor(Math.random() * 51) + 30}px`;

            // Zufällige Font Family
            const fonts = ["unicaSoft", "unicaMono", "unica"];
            const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
            lbl.style.fontFamily = randomFont;
            currentFont = randomFont;

            // Basiswerte
            const baseWdth = (Math.random() * (80 - 20) + 20).toFixed(2);
            const baseItal =
              randomFont === "unica"
                ? (Math.random() * (12 - 2) + 2).toFixed(2)
                : (Math.random() * (1 - 0.1) + 0.1).toFixed(2);

            let baseWght, minWght, maxWght;
            if (randomFont === "unicaSoft") {
              minWght = 57;
              maxWght = 228;
            } else if (randomFont === "unicaMono") {
              minWght = 300;
              maxWght = 700;
            } else {
              minWght = 32;
              maxWght = 228;
            }
            baseWght = (Math.random() * (maxWght - minWght) + minWght).toFixed(
              2
            );

            // Setze initial
            const initialSettings = [];
            initialSettings.push(
              randomFont === "unica"
                ? `"slnt" ${baseItal}`
                : `"ital" ${baseItal}`
            );
            initialSettings.push(`"wght" ${baseWght}`);
            initialSettings.push(`"wdth" ${baseWdth}`);
            lbl.style.fontVariationSettings = initialSettings.join(", ");

            // --- 🔁 Animations-Objekt ---
            const animObj = {
              ital: parseFloat(baseItal),
              wdth: parseFloat(baseWdth),
              wght: parseFloat(baseWght),
            };

            // Animations-Bereiche
            const italMax = randomFont === "unica" ? 20 : 1;
            const italMin = randomFont === "unica" ? 0 : 0;
            const wdthMin = 20,
              wdthMax = 100;

            // Wght-Bereich
            const wghtMin = minWght;
            const wghtMax = maxWght;

            // --- GSAP-Animation für alle drei Achsen ---
            gsap.to(animObj, {
              ital: italMax,
              wdth: wdthMax,
              wght: wghtMax,
              duration: 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              onUpdate: () => {
                const animSettings = [];
                animSettings.push(
                  randomFont === "unica"
                    ? `"slnt" ${animObj.ital.toFixed(2)}`
                    : `"ital" ${animObj.ital.toFixed(2)}`
                );
                animSettings.push(`"wght" ${animObj.wght.toFixed(2)}`);
                animSettings.push(`"wdth" ${animObj.wdth.toFixed(2)}`);
                lbl.style.fontVariationSettings = animSettings.join(", ");
              },
            });
          }
        }
      }, intervalTime);

      spawnInterval = { id, time: intervalTime };
      console.log(`Dist: ${dist45.toFixed(1)} → ${Math.round(intervalTime)}ms`);
    }
  } else {
    if (spawnInterval) {
      clearInterval(spawnInterval.id);
      spawnInterval = null;
    }
    if (window.parcSound && !window.parcSound.paused) {
      window.parcSound.pause();
      window.parcSound.currentTime = 0;
    }
  }
}

loop();

function updatePointers(ids) {
  const xyPointers = [
    { id: 0, el: document.getElementById("xyPointer") },
    { id: 1, el: document.getElementById("xyPointer-1") },
    { id: 2, el: document.getElementById("xyPointer-2") },
    { id: 3, el: document.getElementById("xyPointer-3") },
  ];

  const detections = getDetections();
  const canvas = document.getElementById("out_canvas");
  const container = document.getElementById("XYPointer-container");

  const scaleX = container.offsetWidth / canvas.width;
  const scaleY = container.offsetHeight / canvas.height;

  xyPointers.forEach(({ id, el }) => {
    if (!el) return;

    const det = detections.find((d) => d.id === id);

    if (det && ids.includes(id)) {
      el.style.display = "block";

      // Canvas-Koordinaten (z.B. 1280×720) auf das Containerdiv mappen
      const x = det.center.x * scaleX;
      const y = det.center.y * scaleY;

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.transform = "translate(-50%, -50%)";
    } else {
      el.style.display = "none";
    }
  });
}
