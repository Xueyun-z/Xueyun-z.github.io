let numLayers = 7;
let numPetals = 32;
let maxRadius;
let t = 0;
let paused = false;


let palettes = [
  ["#F72585", "#7209B7", "#3A0CA3", "#4361EE", "#4CC9F0", "#FFD60A"],
  ["#FF5F6D", "#FFC371", "#FFD8A8", "#FFB6B9", "#FDCB82", "#FAEBD7"]
];
let currentPalette = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  angleMode(RADIANS);
  colorMode(RGB);
  maxRadius = min(width, height) * 0.45;
  strokeWeight(2.5);
}

function draw() {
  if (paused) return;

  background(5, 5, 15, 25);
  translate(width / 2, height / 2);
  blendMode(ADD);

 
  let rotSpeed = map(mouseX, 0, width, 0.1, 1.5);   
  let noiseStrength = map(mouseY, 0, height, 0.2, 1); 

  t += 0.015;

  
  drawMandala(rotSpeed, noiseStrength, 1);
  drawMandala(-rotSpeed, noiseStrength, -1);

  blendMode(BLEND);
}

function drawMandala(rotSpeed, noiseStrength, dir) {
  push();
  rotate(t * rotSpeed * 0.3 * dir);

  for (let layer = 0; layer < numLayers; layer++) {
    let radius = map(layer, 0, numLayers - 1, maxRadius * 0.15, maxRadius);
    let layerOffset = t * (0.8 + layer * 0.15);
    let palette = palettes[currentPalette];
    let col = color(palette[layer % palette.length]);
    stroke(red(col), green(col), blue(col), 200);

    beginShape();
    for (let i = 0; i <= numPetals; i++) {
      let angle = map(i, 0, numPetals, 0, TWO_PI);
      let n = noise(layer * 0.5, i * 0.1, t * 0.5);
      let wave = sin(angle * 4 + layerOffset) * 0.3 + n * noiseStrength - 0.3;
      let r = radius * (1 + wave * 0.4 * dir);
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  pop();
}


function mousePressed() {
  currentPalette = (currentPalette + 1) % palettes.length; 
}

function keyPressed() {
  if (key === ' ') paused = !paused; 
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  maxRadius = min(width, height) * 0.45;
}


