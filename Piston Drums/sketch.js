
let systems = [];
let colorset;
let rhythmRatios = [3, 4, 6, 8]; 
let BPM = 90; 
let beatDuration; 
let globalAngle = 0; 
let lowpass;                          
const E_BASS = [82.41, 103.83, 123.47, 155.56]; 


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  rectMode(CENTER);
  noStroke();
  userStartAudio();

  lowpass = new p5.LowPass();
lowpass.freq(400);   
lowpass.res(1);      


  
  beatDuration = 100 / BPM;

  colorset = [
    color(255, 220, 50),
    color(90, 150, 255),
    color(220, 130, 160),
    color(180, 255, 150)
  ];

  let spacing = height / (rhythmRatios.length + 1);
  for (let i = 0; i < rhythmRatios.length; i++) {
    let y = spacing * (i + 1);
    systems.push(
      new MachineLine(width / 6, y, 50, rhythmRatios[i], colorset[i], i)
    );
  }
}

function draw() {
  background("#e1ab23ff");

 
  let secondsPerFrame = 1 / 60; 
  globalAngle += (TWO_PI / (beatDuration * rhythmRatios[0] * 60));

  for (let s of systems) {
    s.display();
  }


}



class MachineLine {
  constructor(x, y, w, ratio, c, index) {
    this.origin = createVector(x, y);
    this.w = w;
    this.ratio = ratio;
    this.c = c;
    this.index = index;
    this.osc = new p5.Oscillator('triangle');           
this.osc.freq(E_BASS[index % E_BASS.length]);   
this.osc.amp(0);
this.osc.start();
this.osc.disconnect();                          
this.osc.connect(lowpass);

    this.flash = 0;
    this.bounce = 0;
  }

  display() {
  
    let angle = (globalAngle * this.ratio) % TWO_PI;

    let x = this.w * sin(angle);
    let y = this.w * cos(angle);
    let offset = 200;

 
    fill(50);
    ellipse(this.origin.x, this.origin.y, this.w * 2);
    fill(255);
    ellipse(this.origin.x + x, this.origin.y + y, 10);

    fill(this.c);
    ellipse(this.origin.x + offset, this.origin.y, this.w * 3);
    fill(255);
    ellipse(this.origin.x + x + offset, this.origin.y + y, 10);

    // connecting arms
    stroke(0);
    strokeWeight(2);
    line(this.origin.x, this.origin.y, this.origin.x + x, this.origin.y + y);
    line(this.origin.x + x, this.origin.y + y, this.origin.x + offset + x, this.origin.y + y);
    line(this.origin.x + offset, this.origin.y, this.origin.x + offset + x, this.origin.y + y);
    noStroke();

    // piston bar
    let barStartX = this.origin.x + offset + x;
    let barY = this.origin.y + y + this.bounce;
    let barEndX = barStartX + 100;

    fill(lerpColor(this.c, color(255), 0.2));
    rectMode(CORNER);
    rect(barStartX, barY - 5, 100, 10, 3);

    // drum
    let drumY = this.origin.y;
    let drumX = this.origin.x + offset + this.w + 100;
    fill(255, 180, 80);
    rect(drumX, drumY, 20, 40, 4);

   
    let cycle = (angle / TWO_PI) * this.ratio; 
    let beatPhase = cycle % 1.0;
    if (beatPhase < 0.02) {
    
      if (this.flash === 0) {
        this.osc.amp(0.4, 0.005);
        this.osc.amp(0, 0.25);
        this.flash = 10;
        this.bounce = random(-8, -12);
      }
    }

  
    if (this.flash > 0) this.flash--;
    this.bounce *= 0.9;

    if (this.flash > 0) {
      fill(255, 80, 80, 200);
      ellipse(drumX + 10, drumY, 25);
    }
  }
}


