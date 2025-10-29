import { getDetections } from "./assets/video_process.js";

// APPLE: x,y = Pos, Rot = Rot

// PEAR: x = c:sticker, y = c:stroke, Rot = Font

// BANANA: x = strokeweight, y =stroke on/off, Rot = Size

// MANGO: x = Ita, y = Wght, Rot = width

//CALIBRATE THESE VALUES
let calibrMin = 220;
let calibrMax = 550;
let placeDistance = 80;

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
let labelnames = ["Doux", "Viva", "Bombo", "Fresco", "Bio", "Sol"];
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
  "#ff8200",
  "#ff4124",
  "#00be36",
  "#f4f5f5",
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
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 105 58.03">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <path id="stickersvg" d="M104,1v56.03h-40.91c0-2.92-1.18-5.56-3.1-7.48-1.92-1.92-4.56-3.1-7.49-3.1s-5.57,1.18-7.49,3.1-3.1,4.56-3.1,7.48H1V1h40.91c0,5.84,4.74,10.57,10.59,10.57,2.92,0,5.57-1.18,7.49-3.1,1.92-1.91,3.1-4.56,3.1-7.48h40.91Z" fill="${ranFill}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 2) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 117.44 64.8">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <path id="stickersvg" d="M116.44,16.7v31.4c-8.68,0-15.72,7.03-15.72,15.7H16.72c0-8.67-7.04-15.7-15.72-15.7v-31.4c8.68,0,15.72-7.03,15.72-15.7h84c0,8.67,7.04,15.7,15.72,15.7h0Z" fill="${ranFill}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 3) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 116.44 92.91">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <polygon id="stickersvg" points="58.22 1.52 68.08 12.75 83.22 5.97 85.86 19.43 103.27 18.44 98.15 31.46 114.4 36.46 102.54 46.46 114.4 56.46 98.15 61.46 103.27 74.48 85.86 73.48 83.22 86.95 68.08 80.16 58.22 91.4 48.36 80.16 33.22 86.95 30.59 73.48 13.17 74.48 18.29 61.46 2.05 56.46 13.9 46.46 2.05 36.46 18.29 31.46 13.17 18.44 30.59 19.43 33.22 5.97 48.36 12.75 58.22 1.52" fill="${ranFill}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 4) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 91.88 91.88">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <circle id="stickersvg" cx="45.94" cy="45.94" r="44.94" fill="${ranFill}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 5) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 114.35 91.88">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <ellipse id="stickersvg" cx="57.18" cy="45.94" rx="56.18" ry="44.94" fill="${ranFill}"/>
    </g>
  </g>
</svg>`;
    } else if (ranSvg === 6) {
      svg = `<svg id="Ebene_2" data-name="Ebene 2" viewBox="0 0 114.35 91.88">
  <g id="Ebene_1-2" data-name="Ebene 1">
    <g>
      <rect id="stickersvg" x="1" y="1" width="112.35" height="89.88" fill="${ranFill}"/>
    </g>
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
  spawnSound.currentTime = 0;
  spawnSound.play();

  let ranSvg = Math.floor(Math.random() * 7 + 1);
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

  const distDiv = document.getElementById("distDisplay");
  distDiv.innerHTML = ""; // CLEAR

  const p = document.createElement("p");
  p.textContent = `longlabel: ${longlabel}, posX: ${posabsX} / ${posabsXreal}, posY: ${posabsY} / ${posabsYreal}`;
  distDiv.appendChild(p);

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
    //     const tagwidth = tagPixelWidth(det);
    //     const c0 = det.corners[0];
    //     const angle = angle2DFromCorners(det);
    //     const p = document.createElement("p");
    //     p.textContent = `Tag ${det.id}, tagwidth=${tagwidth.toFixed(1)},
    // corner0=(${c0.x.toFixed(1)}, ${c0.y.toFixed(1)}),
    // rotation=${angle.toFixed(1)}°`;
    //     p.style.whiteSpace = "pre-line";
    //     distDiv.appendChild(p);
  });

  // const pDist = document.createElement("p");
  // pDist.textContent = `distAP: ${distAP}, font:${currentFont} \n distAM: ${distAM} `;
  // pDist.style.whiteSpace = "pre-line";
  // distDiv.appendChild(pDist);

  //A0: ROT: Sticker
  if (ids.includes(1) && laststicker) {
    const detection = detections.find((det) => det.id === 1);
    if (!detection) return;

    let angle = angle2DFromCorners(detection);
    if (angle < 0) angle += 360;

    const lbl = laststicker.sticker.querySelector(".label");
    if (!lbl) return;

    if (angle < 60) {
      lbl.style.fontFamily = "unicaSoft";
      currentFont = "unicaSoft";
    } else if (angle < 120) {
      lbl.style.fontFamily = "unicaMono";
      currentFont = "unicaMono";
    } else if (angle < 180) {
      lbl.style.fontFamily = "unica";
      currentFont = "unica";
    } else if (angle < 240) {
      lbl.style.fontFamily = "unicaSoft";
      currentFont = "unicaSoft";
    } else if (angle < 300) {
      lbl.style.fontFamily = "unicaMono";
      currentFont = "unicaMono";
    } else {
      lbl.style.fontFamily = "unica";
      currentFont = "unica";
    }
  }
  //M2: ROT: Font Size
  if (ids.includes(2) && laststicker) {
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
  }

  if (ids.includes(3) && laststicker) {
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
    if (lbl) {
      if (distAB < (calibrMin + calibrMax) / 2) {
        lbl.style.color = "white";
        // lbl.style.webkitTextStroke = ".5px black"; // Outline hinzufügen
      } else {
        lbl.style.color = "black";
        // lbl.style.webkitTextStroke = "0px"; // Outline entfernen
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
  }

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
    if (shape) {
      shape.setAttribute("fill", fillColor);
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

  // INT0: Placing Stickers, ind. Swtiches
  //CALIBRATION1 PLACING EVENT:
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
            lbl.style.fontSize = `${Math.floor(Math.random() * 66) + 20}px`;
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
