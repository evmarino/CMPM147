// sketch.js - Alternate Worlds, procedurally generated world maps 
// Author: Evelyn Marino
// Date: 4/21/2025

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
  constructor(param1, param2) {
    this.property1 = param1;
    this.property2 = param2;
  }

  myMethod() {
    // code to run when method is called
  }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  //canvasContainer = $("#canvas-container");
  //let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  // canvas.parent("canvas-container");

  // resize canvas is the page is resized

  // create an instance of the class
  // myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function () {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  background(220);
  // call a method on the instance
  myInstance.myMethod();

  // Set up rotation for the rectangle
  push(); // Save the current drawing context
  translate(centerHorz, centerVert); // Move the origin to the rectangle's center
  rotate(frameCount / 100.0); // Rotate by frameCount to animate the rotation
  fill(234, 31, 81);
  noStroke();
  rect(-125, -125, 250, 250); // Draw the rectangle centered on the new origin
  pop(); // Restore the original drawing context

  // The text is not affected by the translate and rotate
  fill(255);
  textStyle(BOLD);
  textSize(140);
  text("p5*", centerHorz - 105, centerVert + 40);
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
  // code to run when mouse is pressed
}


// shared 4×4 bitmask lookup
const lookup = [
  [0, 0], [1, 0], [2, 0], [3, 0],
  [0, 1], [1, 1], [2, 1], [3, 1],
  [0, 2], [1, 2], [2, 2], [3, 2],
  [0, 3], [1, 3], [2, 3], [3, 3],
];

// helper functions
function gridCheck(grid, i, j, target) {
  return !(i < 0 || j < 0 || i >= grid.length || j >= grid[0].length)
    && grid[i][j] === target;
}

function gridCode(grid, i, j, target) {
  let code = 0;
  if (gridCheck(grid, i - 1, j, target)) code |= 1;
  if (gridCheck(grid, i + 1, j, target)) code |= 2;
  if (gridCheck(grid, i, j + 1, target)) code |= 4;
  if (gridCheck(grid, i, j - 1, target)) code |= 8;
  return code;
}

function drawContext(p, grid, i, j, target, baseTi, baseTj) {
  const code = gridCode(grid, i, j, target),
    [dti, dtj] = lookup[code];
  p.placeTile(i, j, baseTi + dti, baseTj + dtj);
}

// Overworld  
const overworldSketch = p => {
  let seed = 0,
    numCols = 30,
    numRows = 20,
    grid = [];
  const tiTuft = 10, tjTuft = 0;
  const baseTiWater = 0, baseTjWater = 15;

  p.preload = () => {
    p.tileset = p.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png"
    );
  };

  p.setup = () => {
    p.createCanvas(16 * numCols, 16 * numRows)
      .parent("overworld-container");
    p.noSmooth();
    p.select("#overworld-reseed").mousePressed(reseed);
    reseed();
  };

  function reseed() {
    seed += 1109;
    p.randomSeed(seed);
    p.noiseSeed(seed);
    grid = generateGrid(numCols, numRows);
  }

  p.draw = () => {
    p.randomSeed(seed);
    drawGrid(grid);
  };

  function generateGrid(numCols, numRows) {
    let g = [];
    for (let y = 0; y < numRows; y++) {
      g.push(Array(numCols).fill("_"));
    }
    //river
    for (let x = 0; x < numCols; x++) {
      const t = x / (numCols - 1),
        rawY = p.noise(t * 2) * numRows,
        midY = p.floor(rawY);
      for (let dy = -1; dy <= 2; dy++) {
        const y = p.constrain(midY + dy, 0, numRows - 1);
        g[y][x] = "~";
      }
    }
    // grass banks
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        if (
          g[i][j] === "_" &&
          (j < 3 || j > numCols - 4) &&
          p.random() < 0.25
        ) {
          g[i][j] = "T";
        }
      }
    }
    // edge markers
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numCols; x++) {
        if (g[y][x] === "~") {
          [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dy, dx]) => {
            const ny = y + dy, nx = x + dx;
            if (
              ny >= 0 && ny < numRows &&
              nx >= 0 && nx < numCols &&
              g[ny][nx] === "_"
            ) {
              g[ny][nx] = "u";
            }
          });
        }
      }
    }
    return g;
  }

  function drawGrid(grid) {
    p.background(128);
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const c = grid[i][j];
        if (c === "_") {
          p.placeTile(i, j, p.floor(p.random(4)), 0);
          if (p.random() < 0.03) {
            const x0 = 16 * j + p.random(2, 14),
              y0 = 16 * i + p.random(2, 14);
            p.noStroke();
            p.fill(255, 255, 255, p.random(80, 150));
            p.ellipse(x0, y0, p.random(4, 8), p.random(4, 8));
          }
        }
        else if (c === "~") {
          if (p.random() < 0.1) {
            p.placeTile(i, j, 1, 14);
          } else {
            p.placeTile(i, j, 0, 14);
          }
        }
        else if (c === "T") {
          drawContext(p, grid, i, j, "T", 16, 0);
        }
        else if (c === "u") {
          p.placeTile(i, j, tiTuft, tjTuft);
        }
      }
    }
    p.push();
    p.noStroke();
    const shine = p.map(p.sin(p.millis() / 1000), -1, 1, 100, 20);
    p.fill(255, 255, 255, shine);
    p.rect(0, 0, p.width, p.height);
    p.pop();
  }

  p.placeTile = (i, j, ti, tj) =>
    p.image(p.tileset, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
};

new p5(overworldSketch);


// Dungeon 
const dungeonSketch = p => {
  let seed = 0,
    numCols = 30,
    numRows = 20,
    grid = [];
  const tiBrick = 0, tjBrick = 1;
  const tiShelf = 0, tjShelf = 7;

  p.preload = () => {
    p.tileset = p.loadImage(
      "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png"
    );
  };

  p.setup = () => {
    p.createCanvas(16 * numCols, 16 * numRows)
      .parent("dungeon-container");
    p.noSmooth();
    p.select("#dungeon-reseed").mousePressed(reseed);
    reseed();
  };

  function reseed() {
    seed += 1109;
    p.randomSeed(seed);
    grid = generateGrid(numCols, numRows);
  }

  p.draw = () => {
    p.randomSeed(seed);
    p.background(128);
    drawGrid(grid);
  };

  function generateGrid(numCols, numRows) {
    let g = [];
    for (let y = 0; y < numRows; y++) {
      g.push(Array(numCols).fill("."));
    }
    const w = p.floor(p.random(4, numCols / 2));
    const h = p.floor(p.random(4, numRows / 2));
    const sc = p.floor(p.random(1, numCols - w - 1));
    const sr = p.floor(p.random(1, numRows - h - 1));
    for (let y = sr; y < sr + h; y++) {
      for (let x = sc; x < sc + w; x++) {
        g[y][x] = ".";
      }
    }
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numCols; x++) {
        if (g[y][x] === "_" && p.random() < 0.10) g[y][x] = "b";
      }
    }
    for (let y = 0; y < numRows; y++) {
      for (let x = 0; x < numCols; x++) {
        if (g[y][x] === "." && p.random() < 0.05) g[y][x] = "S";
      }
    }
    return g;
  }

  function drawGrid(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const c = grid[i][j];
        if (c === "_") {
          p.placeTile(i, j, p.floor(p.random(4)), 0);
        }
        else if (c === "b") {
          p.placeTile(i, j, tiBrick, tjBrick);
        }
        else if (c === "S") {
          p.placeTile(i, j, tiShelf, tjShelf);
        }
        else if (c === ".") {
          drawContext(p, grid, i, j, ".", 4, 0);
          if (p.random() < 0.04) {
            const x0 = 16 * j + p.random(2, 14),
              y0 = 16 * i + p.random(2, 14);
            p.noStroke();
            p.fill(200, 230, 255, p.random(180, 255));
            p.ellipse(x0, y0, p.random(3, 8), p.random(3, 8));
          }
        }
      }
    }
    p.noStroke();
    p.fill(
      0, 0, 0,
      p.map(p.sin(p.millis() / 1000), -1, 1, 20, 80)
    );
    p.rect(0, 0, p.width, p.height);
  }

  p.placeTile = (i, j, ti, tj) =>
    p.image(p.tileset, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
};

new p5(dungeonSketch);
