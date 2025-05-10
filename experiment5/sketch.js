/* exported preload, setup, draw */

let dropper, slider, rate, restart, memory,
    activeScore, bestScore, fpsCounter;

let bestDesign, currentDesign, currentScore,
    currentInspiration, currentCanvas,
    currentInspirationPixels;

let mutationCount = 0;

function preload() {
    
    dropper = document.getElementById("dropper");
    slider = document.getElementById("slider");
    rate = document.getElementById("rate");
    restart = document.getElementById("restart");
    memory = document.getElementById("memory");
    activeScore = document.getElementById("activeScore");
    bestScore = document.getElementById("bestScore");
    fpsCounter = document.getElementById("fpsCounter");

    // load inspirations 
    let all = getInspirations();
    all.forEach((insp, i) => {
        insp.image = loadImage(insp.assetUrl);
        let opt = document.createElement("option");
        opt.value = i; opt.text = insp.name;
        dropper.appendChild(opt);
    });

    dropper.onchange = () => inspirationChanged(all[dropper.value]);
    restart.onclick = () => inspirationChanged(all[dropper.value]);
    currentInspiration = all[0];
}

function inspirationChanged(next) {
    currentInspiration = next;
    currentDesign = undefined;
    currentScore = -Infinity;
    
    memory.innerHTML = "";
    document.getElementById("reference").innerHTML = "";
    document.getElementById("active").innerHTML = "";
    document.getElementById("best").innerHTML = "";
    slider.value = 100;
    rate.innerText = slider.value;
    activeScore.innerText = "–";
    bestScore.innerText = "–";
    // rebuild
    setup();
}

function setup() {

    slider.addEventListener("input", () => {
        rate.innerText = slider.value;
    });
   
    pixelDensity(1);

    // scale down to 1/4 of natural resolution
    let w = currentInspiration.image.width / 2;
    let h = currentInspiration.image.height / 2;

    //Reference img
    let refDiv = document.getElementById("reference");
    let refImg = document.createElement("img");
    refImg.src = currentInspiration.assetUrl;
    refImg.alt = currentInspiration.name;
    refImg.style.maxWidth = "100%";
    refDiv.appendChild(refImg);

    // Active canvas
    currentCanvas = createCanvas(w, h);
    currentCanvas.parent("active");

    // initialize designs & capture target pixels
    currentScore = -Infinity;
    currentDesign = initDesign(currentInspiration);
    bestDesign = currentDesign;
    image(currentInspiration.image, 0, 0, w, h);
    loadPixels();
    currentInspirationPixels = pixels.slice();
}

function evaluate() {
    loadPixels();
    let error = 0;
    const n = pixels.length;
    for (let i = 0; i < pixels.length; i++) {
        error += sq(pixels[i] - currentInspirationPixels[i]);
    }
    let mse = error / n;
    // maximum possible squared difference
    const maxMSE = 255 * 255;
    // similarity from 0 to 1 
    let similarity = 1 - (mse / maxMSE);
    return constrain(similarity, 0, 1);
}
function memorialize() {
    let url = currentCanvas.canvas.toDataURL();
    let img = document.createElement("img");
    img.classList.add("memory");
    img.src = url;
    img.width = currentCanvas.width;
    img.height = currentCanvas.height;
    img.title = currentScore.toFixed(3);

    // displays best
    document.getElementById("best").innerHTML = "";
    document.getElementById("best").appendChild(img.cloneNode());

    // fps strip
    img.width /= 2;
    img.height /= 2;
    memory.insertBefore(img, memory.firstChild);
    if (memory.childNodes.length > memory.dataset.maxItems) {
        memory.removeChild(memory.lastChild);
    }
}

function draw() {
    rate.innerText = slider.value;
    if (!currentDesign) return;

    // mutate from best
    randomSeed(mutationCount++);
    let candidate = JSON.parse(JSON.stringify(bestDesign));
    mutateDesign(candidate, currentInspiration, slider.value / 100);

    // render
    randomSeed(0);
    renderDesign(candidate, currentInspiration);
    let score = evaluate();

    
    activeScore.innerText = score.toFixed(3);
    fpsCounter.innerText = Math.round(frameRate());

   
    if (score > currentScore) {
        currentScore = score;
        bestDesign = candidate;
        bestScore.innerText = currentScore.toFixed(3);
        memorialize();
    }
    if (frameCount % 30 === 0)
        pushMemoryOnly();
}

function initDesign(inspiration) {
    const N = 64;              
    const cells = new Array(N * N);
    for (let i = 0; i < cells.length; i++) {
        
        cells[i] = random(255);
    }
    return { N, cells };
}
function renderDesign(design, inspiration) {
    noStroke();
    const { N, cells } = design;
    const cellW = width / N;
    const cellH = height / N;

    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            const idx = x + y * N;
            fill(cells[idx], 200);  //opacity
            // draw circle centered in the cell
            ellipse(
                x * cellW + cellW * 0.5,
                y * cellH + cellH * 0.5,
                cellW, cellH
            );
        }
    }
}
function mutateDesign(design, inspiration, rate) {
    const { cells } = design;
    for (let i = 0; i < cells.length; i++) {
        //random gauss
        //stdev ~ rate*range/20
        cells[i] = constrain(
            randomGaussian(cells[i], (rate * 255) / 20),
            0, 255
        );
    }
}
function pushMemoryOnly() {
    const url = currentCanvas.canvas.toDataURL();
    const thumb = document.createElement("img");
    thumb.classList.add("memory");
    thumb.src = url;
    // half‐size 
    thumb.width = currentCanvas.width / 2;
    thumb.height = currentCanvas.height / 2;

    memory.insertBefore(thumb, memory.firstChild);
    if (memory.childNodes.length > memory.dataset.maxItems) {
        memory.removeChild(memory.lastChild);
    }
}
