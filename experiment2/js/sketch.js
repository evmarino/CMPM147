// sketch.js - Generative, living impression using p5.js. 
// Various cherry blossom trees regenerating and creating landscape.
// Various times of day represented through the sun cycle, controlled by horizontal mouse movement.

// Author: Evelyn Marino 

// Date: April 14, 2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

let seed = 239;
let trees = [];

const grassColor = "#028a0f";
const skyColor = "#ecf5ff";
const leavesColorPink = "rgba(255, 105, 180, 1)";
const leavesColorWhite = "rgba(255,183,206,1)";
const sunColor = "#FFE484";

let baseWidth = 400;
let baseHeight = 200;
let scaleW, scaleH;

function setup() {
  let canvasContainer = select('#canvas-container');
  let canvas = createCanvas(canvasContainer.elt.clientWidth, canvasContainer.elt.clientHeight);
  canvas.parent('canvas-container');

  scaleW = width / baseWidth;
  scaleH = height / baseHeight;

  // Buttons
  let reimagineBtn = select('#reimagine');
  let fullscreenBtn = select('#fullscreen');
  let exitFullscreenBtn = select('#exit-fullscreen');

  if (reimagineBtn) {
    reimagineBtn.mousePressed(() => {
      seed++;
    });
  }

  if (fullscreenBtn && exitFullscreenBtn) {
    fullscreenBtn.mousePressed(() => {
      fullscreen(true);
    });

    exitFullscreenBtn.mousePressed(() => {
      fullscreen(false);
    });
  }

  // Watch for fullscreen changes
  document.addEventListener("fullscreenchange", () => {
    const fs = fullscreen();
    if (fs) {
      fullscreenBtn.hide();
      exitFullscreenBtn.show();
    } else {
      fullscreenBtn.show();
      exitFullscreenBtn.hide();
    }
    resizeScreen(); // adjusts canvas size
  });

  angleMode(DEGREES);
 
  let treeCount = 15;
  let spacing = width / treeCount;
  
  let minY = height * 0.55 // stays away from sun
  let maxY = height * 0.7; // above grass
  
  for (let i = 0; i < treeCount; i++) {
    let x = spacing * i + spacing / 2;
    let y = random(minY, maxY);
    trees.push(new Trees(x, y));
  }

}
function resizeScreen() {
  const containerRect = select('#canvas-container').elt.getBoundingClientRect();
  resizeCanvas(containerRect.width, containerRect.height);
  scaleW = width / baseWidth;
  scaleH = height / baseHeight;

  //redo tree positions
  trees = [];
  let treeCount = 15;
  let spacing = width / treeCount;
  let minY = height * 0.55;
  let maxY = height * 0.7;

  for (let i = 0; i < treeCount; i++) {
    let x = spacing * i + spacing / 2;
    let y = random(minY, maxY);
    trees.push(new Trees(x, y));
  }
  redraw();
}
function draw() {
  background(skyColor)
  randomSeed(seed);
  noStroke();

  //fill(skyColor);
  //rect(0, 0, width, height / 2);

  sunCycle();

  fill(grassColor);
  rect(0, height / 2, width, height / 2);

  for (let i = -5 * scaleW; i <= width + 5 * scaleW; i += 5 * scaleW) {
    push();
    translate(i, 0);
    grassBlades();
    pop();
  }

  for (let tree of trees) {
    tree.display();
  }
}

function windowResized() {
  
  resizeScreen();
  }

function sunCycle() {
  fill(sunColor);
  noStroke();

  let quarter = width / 4;

  if (mouseX < quarter) {
    for (let x = 0; x < width; x++) {
      let sunsetBegin = color(255, 237, 188);
      let sunsetEnd = color(137, 207, 240);
      let amt = map(x, 0, width, 0, 1);
      let gradColor = lerpColor(sunsetBegin, sunsetEnd, amt);
      stroke(gradColor);
      line(x, 0, x, height / 2);
    }
    ellipse(quarter * 0.5, 30 * scaleH, 33, 33);

  } else if (mouseX < quarter * 2) {
    for (let y = 0; y < height; y++) {
      let sunsetBegin = color(255, 237, 188);
      let sunsetEnd = color(137, 207, 240);
      let amt = map(y, 0, height, 0, 1);
      let gradColor = lerpColor(sunsetBegin, sunsetEnd, amt);
      stroke(gradColor);
      line(0, y, width, y);
    }
    ellipse(quarter * 1.5, 30 * scaleH, 33, 33);

  } else if (mouseX < quarter * 3) {
    for (let x = 0; x < width; x++) {
      let sunsetBegin = color(235, 161, 93);
      let sunsetEnd = color(137, 207, 240);
      let amt = map(x, 0, width, 1, 0);
      let gradColor = lerpColor(sunsetBegin, sunsetEnd, amt);
      stroke(gradColor);
      line(x, 0, x, height / 2);
    }
    ellipse(quarter * 2.5, 30 * scaleH, 33, 33);

  } else {
    ellipse(quarter * 3.5, 30 * scaleH, 33, 33);

    for (let y = 0; y < height; y++) {
      let sunsetBegin = color(177, 186, 211);
      let sunsetEnd = color(211, 71, 71);
      let amt = map(y, 0, height, 0, 1);
      let gradColor = lerpColor(sunsetBegin, sunsetEnd, amt);
      stroke(gradColor);
      line(0, y, width, y);
    }

    for (let x = 0; x < width; x++) {
      let sunsetBegin = color(117, 125, 157);
      let sunsetEnd = color(7, 55, 99);
      let amt = map(x, 0, width, 1, 0);
      let gradColor = lerpColor(sunsetBegin, sunsetEnd, amt);
      stroke(gradColor);
      line(x, 0, x, height / 2);
    }

    fill("white");
    noStroke();
    ellipse(width * 0.0475, 30 * scaleH, 33, 33);

    fill(color(7, 55, 99));
    noStroke();
    ellipse(width * 0.0425, 25 * scaleH, 33, 33);
  }
}

class Trees {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  display() {
    randomSeed(seed + int(this.x));
    push();
    translate(this.x, this.y);
    stroke(70, 50, 40);
    strokeWeight(1.5);
    scale(1); 
    this.branch(40);
    pop();
  }

  branch(len) {
    line(0, 0, 0, -len);
    translate(0, -len);
    rotate(random(-2, 2));
    if (len > 5) {
      if (random() < 0.9) {
        push();
        rotate(random(-20, -5));
        this.branch(len * random(0.7, 0.8));
        pop();
      }
      if (random() < 0.9) {
        push();
        rotate(random(5, 20));
        this.branch(len * random(0.7, 1));
        pop();
      }
    } else {
      this.makeLeaves();
    }
  }

  makeLeaves() {
    for (let angle = 0; angle < 360; angle += 90) {
      push();
      rotate(angle + random(-5, 5));
      translate(0, -5);
      strokeWeight(0.3);
      fill(random([leavesColorPink, leavesColorWhite]));
      let size = random(4, 6);
      ellipse(0, 0, size, size * 1.5);
      pop();
    }
  }
}

function branch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);
  rotate(random(-2, 2));
  if (len > 5) {
    if (random() < 0.9) {
      push();
      rotate(random(-25, -10));
      branch(len * random(0.7, 0.8));
      pop();
    }
    if (random() < 0.9) {
      push();
      rotate(random(10, 25));
      branch(len * random(0.7, 1));
      pop();
    }
  } else {
    makeLeaves();
  }
}

function makeLeaves() {
  for (let angle = 0; angle < 360; angle += 90) {
    push();
    rotate(angle + random(-5, 5));
    translate(0, -5);
    strokeWeight(0.3);
    fill(random([leavesColorPink, leavesColorWhite]));
    let size = random(4, 6);
    ellipse(0, 0, size, size * 1.5);
    pop();
  }
}

function grassBlades() {

// Blade 1
  push();
  translate(40, height - 30); 
  scale(-0.7, 1.5); 
  rotate(-45);
  noStroke();
  fill(0, 100, 0);
  beginShape(TRIANGLES); 
  vertex(-35, 20);
  vertex(60, 80);
  vertex(60, 40);
  endShape(CLOSE);
  pop();

  // Blade 2
  push();
  translate(1 * scaleW, height - 30);
  scale(0.4, 1.5); 
  rotate(-45);
  noStroke();
  fill(0, 100, 0);
  beginShape(TRIANGLES); 
  vertex(30, 20);
  vertex(-40, -60);
  vertex(50, 0);
  endShape(CLOSE);
  pop();
}
