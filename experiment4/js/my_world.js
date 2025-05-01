"use strict";

/* eslint-env browser */
/* global
  XXH,
  noiseSeed, randomSeed,
  createP, createSelect, select,
  textFont, textSize, textAlign, textStyle,
  CENTER, BOTTOM, BOLD,
  noStroke, stroke, fill,
  push, pop,
  beginShape, endShape, vertex, CLOSE,
  ellipse, background, text,
  screenToWorld, worldToScreen, camera_offset,
  mousePressed, mouseReleased, mouseIsPressed, mouseX, mouseY,
  p3_preload, p3_setup, p3_worldKeyChanged,
  p3_tileWidth, p3_tileHeight, p3_tileClicked,
  p3_drawBefore, p3_drawTile, p3_drawSelectedTile, p3_drawAfter
*/

const TMDB_KEY = '6cc4dac634c0d8cf603757eb4d332374';

let worldSeed, tw, th;
let lastKey = "";
let activeKey = null;

// Movie Cube State
let recs = {};

// Ant Generator State
let antPath = [];
const maxLen = 20;
const stepRate = 8;
let antAlive, killer;

// Dot Generator State
let cleaned = {};

const generators = {
  movie: {
    preload() {},
    setup() {
      textFont('Courier New');
      textSize(12);
      textAlign(CENTER, BOTTOM);
      textStyle(BOLD);
      let p = createP("Last recommendation: ");
      p.id("lastRec");
      p.parent("container");
    },
    worldKeyChanged(key) {
      worldSeed = XXH.h32(key, 0);
      noiseSeed(worldSeed);
      randomSeed(worldSeed);
      recs = {};
    },
    tileWidth() { return 32; },
    tileHeight() { return 16; },
    tileClicked(i, j) {
      const key = `${i},${j}`;
      if (!recs[key]) {
        const page = Math.floor(Math.random() * 500) + 1;
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&page=${page}`;
        fetch(url)
          .then(r => r.json())
          .then(data => {
            const results = Array.isArray(data.results) ? data.results : [];
            const pick = results[Math.floor(Math.random() * results.length)] || {};
            recs[key] = pick.title
              ? `${pick.title} (${pick.release_date?.slice(0, 4)})`
              : "No rec available";
            select("#lastRec").html(`Last recommendation: ${recs[key]}`);
          })
          .catch(err => {
            console.error("TMDB fetch error:", err);
            recs[key] = "Fetch error";
            select("#lastRec").html(`Last recommendation: ${recs[key]}`);
          });
      }
    },
    drawBefore() {},
    drawTile(i, j) {
      noStroke();
      const key = `${i},${j}`;
      if (mouseIsPressed && activeKey !== null && key !== activeKey) {
        fill(0);
      } else {
        const h = XXH.h32(`tile:${i},${j}`, worldSeed);
        fill(h & 0xFF, (h >>> 8) & 0xFF, (h >>> 16) & 0xFF);
      }
      push();
      beginShape();
      vertex(-tw, 0); vertex(0, th);
      vertex(tw, 0);  vertex(0, -th);
      endShape(CLOSE);

      if (recs[key]) {
        noStroke();
        fill(255);
        text(recs[key], 0, -th - 4);
      }
      pop();
    },
    drawSelectedTile(i, j) {
      noFill();
      stroke(0, 255, 0, 128);
      beginShape();
      vertex(-tw, 0); vertex(0, th);
      vertex(tw, 0);  vertex(0, -th);
      endShape(CLOSE);
    },
    drawAfter() {}
  },

  ant: {
    preload() {},
    setup() {},
    worldKeyChanged(key) {
      worldSeed = XXH.h32(key, 0);
      noiseSeed(worldSeed);
      randomSeed(worldSeed);
      antAlive = true;
      killer = null;
      antPath = [{ x: 0, y: 0 }];
    },
    tileWidth() { return 32; },
    tileHeight() { return 16; },
    tileClicked(i, j) {
      if (!antAlive) return;
      const head = antPath[0];
      if (i === head.x && j === head.y) {
        antAlive = false;
        killer = { x: i, y: j, t: frameCount };
      }
    },
    drawBefore() {
      background(237, 201, 175);
    },
    drawTile(i, j) {
      noStroke();
      fill(237, 201, 175);
      push();
      beginShape();
      vertex(-tw, 0); vertex(0, th);
      vertex(tw, 0);  vertex(0, -th);
      endShape(CLOSE);
      if (XXH.h32(`rock:${i},${j}`, worldSeed) % 20 === 0) {
        fill(150, 100, 50);
        push();
        translate(0, th * 0.2);
        ellipse(0, 0, tw * 0.4, th * 0.2);
        pop();
      }
      pop();
    },
    drawSelectedTile(i, j) {},
    drawAfter() {
      if (antAlive && frameCount % stepRate === 0) {
        const head = antPath[0];
        const ang = noise(head.x * 0.1, head.y * 0.1, frameCount * 0.01) * TWO_PI;
        const dxr = cos(ang), dyr = sin(ang);
        let dx = 0, dy = 0;

        if (abs(dxr) > abs(dyr)) {
          dx = (dxr > 0) ? 1 : -1;
          dy = 0;
        } else {
          dy = (dyr > 0) ? 1 : -1;
          dx = 0;
        }

        antPath.unshift({ x: head.x + dx, y: head.y + dy });
        if (antPath.length > maxLen) antPath.pop();
      }

      antPath.forEach((seg, idx) => {
        const [sx, sy] = worldToScreen([seg.x, seg.y], [camera_offset.x, camera_offset.y]);
        push();
        translate(-sx, sy + th * 0.1);
        noStroke();
        fill(80, 50, 30, map(idx, 0, maxLen, 200, 50));
        const w = map(idx, 0, maxLen, tw * 0.3, tw * 0.1),
              h = w * 0.4;
        ellipse(0, 0, w, h);
        pop();
      });

      if (antAlive) {
        const head = antPath[0];
        const [hx, hy] = worldToScreen([head.x, head.y], [camera_offset.x, camera_offset.y]);
        push();
        translate(-hx, hy);
        noStroke();
        fill(0);
        ellipse(0, 0, tw * 0.6, th * 0.4);
        ellipse(-tw * 0.25, 0, tw * 0.3, th * 0.25);
        stroke(0);
        strokeWeight(2);
        [-1, 1].forEach(s => {
          line(-tw * 0.2, 0, -tw * 0.6, s * th * 0.2);
          line(0, 0, tw * 0.2, s * th * 0.25);
          line(tw * 0.2, 0, tw * 0.6, s * th * 0.2);
        });
        pop();
      } else if (killer) {
        const age = frameCount - killer.t;
        if (age < 30) {
          const [sx, sy] = worldToScreen([killer.x, killer.y], [camera_offset.x, camera_offset.y]);
          push();
          translate(-sx, sy);
          noStroke();
          fill(255, 0, 0, map(1 - age / 30, 0, 1, 255, 0));
          ellipse(0, 0, tw * 0.8, th * 0.8);
          pop();
        }
      }
    }
  },

  dot: {
    preload() {},
    setup() {},
    worldKeyChanged(key) {
      worldSeed = XXH.h32(key, 0);
      noiseSeed(worldSeed);
      randomSeed(worldSeed);
      cleaned = {};
    },
    tileWidth() { return 32; },
    tileHeight() { return 16; },
    tileClicked(i, j) {
      cleaned[`${i},${j}`] = true;
    },
    drawBefore() {
      background(0);
    },
    drawTile(i, j) {
      const h = XXH.h32(`tile:${i},${j}`, worldSeed);
      noStroke();
      fill((h & 1) ? 255 : 0);
      push();
      beginShape();
      vertex(-tw, 0); vertex(0, th);
      vertex(tw, 0);  vertex(0, -th);
      endShape(CLOSE);
      pop();
      const key = `${i},${j}`;
      if (!cleaned[key] && h % 6 === 0) {
        fill(h & 0xFF, (h >>> 8) & 0xFF, (h >>> 16) & 0xFF, 200);
        ellipse(0, 0, tw * 0.6, th * 0.6);
      }
    },
    drawSelectedTile(i, j) {},
    drawAfter() {}
  }
};

// Current
let current = generators.movie;

function p3_preload() {
  Object.values(generators).forEach(g => g.preload());
}

function p3_setup() {
  let label = createP("Generator:").parent("container");
  let sel = createSelect().parent(label);
  sel.option("Movie Cube", "movie");
  sel.option("Ant Killer", "ant");
  sel.option("Dot Destroyer", "dot");
  sel.changed(() => {
    current = generators[sel.value()];
    rebuildWorld(lastKey);
  });
  current.setup();
  let fsButton = select('#fullscreen-button');
  fsButton.mousePressed(() => {
    let fs = fullscreen();
    fullscreen(!fs);
  });
}

function p3_worldKeyChanged(key) {
  lastKey = key;
  current.worldKeyChanged(key);
  tw = current.tileWidth();
  th = current.tileHeight();
}

function mousePressed() {
  const [i, j] = screenToWorld([0 - mouseX, mouseY], [camera_offset.x, camera_offset.y]);
  activeKey = `${i},${j}`;
  p3_tileClicked(i, j);
}

function mouseReleased() {
  activeKey = null;
}

function p3_tileWidth() { return tw; }
function p3_tileHeight() { return th; }
function p3_tileClicked(i, j) { current.tileClicked(i, j); }
function p3_drawBefore() { current.drawBefore(); }
function p3_drawTile(i, j) { current.drawTile(i, j); }
function p3_drawSelectedTile(i, j) { current.drawSelectedTile(i, j); }
function p3_drawAfter() { current.drawAfter(); }