/* exported getInspirations, initDesign, renderDesign, mutateDesign */

function getInspirations() {
    return [
        {
            name: "Interstellar",
            assetUrl: "img/Interstellar.jpg",
            credit: "User image ‘Interstellar.jpg’"
        },
        {
            name: "Tron",
            assetUrl: "img/Tron.jpg",
            credit: "User image ‘Tron.jpg’"
        },
        {
            name: "Sinners",
            assetUrl: "img/Sinners.jpg",
            credit: "User image ‘Sinners.jpg’"
        }
    ];
}

function initDesign(inspiration) {
    // Start designs differently per image
    let design = {};
    if (inspiration.name === "Interstellar") {
        design.radius = random(width * 0.2, width * 0.8);
    } else if (inspiration.name === "Tron") {
        design.startAngle = random(TWO_PI);
        design.endAngle = design.startAngle + random(HALF_PI, PI);
        design.thickness = random(4, 20);
    } else if (inspiration.name === "Sinners") {
        design.w = random(width * 0.2, width * 0.8);
        design.h = random(height * 0.2, height * 0.8);
    }
    return design;
}

function renderDesign(design, inspiration) {
    background(255);
    noStroke();
    if (inspiration.name === "Interstellar") {
        fill(0);
        ellipse(width / 2, height / 2, design.radius, design.radius);
    } else if (inspiration.name === "Tron") {
        noFill();
        stroke(0);
        strokeWeight(design.thickness);
        arc(
            width / 2, height / 2,
            width * 0.8, height * 0.8,
            design.startAngle, design.endAngle
        );
    } else if (inspiration.name === "Sinners") {
        rectMode(CENTER);
        fill(0);
        rect(width / 2, height / 2, design.w, design.h);
    }
}

function mutateDesign(design, inspiration, rate) {
    // Gaussian tweaks helper
    function mut(val, min, max) {
        return constrain(
            randomGaussian(val, (rate * (max - min)) / 10),
            min, max
        );
    }
    if (inspiration.name === "Interstellar") {
        design.radius = mut(design.radius, width * 0.1, width * 0.9);
    } else if (inspiration.name === "Tron") {
        design.startAngle = (design.startAngle + randomGaussian(0, rate * 0.2)) % TWO_PI;
        design.endAngle = (design.endAngle + randomGaussian(0, rate * 0.2)) % TWO_PI;
        design.thickness = mut(design.thickness, 1, 50);
    } else if (inspiration.name === "Sinners") {
        design.w = mut(design.w, width * 0.1, width * 1.0);
        design.h = mut(design.h, height * 0.1, height * 1.0);
    }
}
