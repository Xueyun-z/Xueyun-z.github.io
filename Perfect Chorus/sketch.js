
const TYPE_DATA = {
  cow:      { color: [210,230,255], bounceSpeed: 0.9 },
  cat:      { color: [255,220,140], bounceSpeed: 0.8 },
  gas:      { color: [230,230,230], bounceSpeed: 0.7 },
  chick:    { color: [255,255,180], bounceSpeed: 1.2 },
  ghost:    { color: [240,240,255], bounceSpeed: 0.5 },
  clapping: { color: [255,190,210], bounceSpeed: 1.1 },
  monkey:   { color: [240,200,150], bounceSpeed: 0.9 }
};

const VOICE_DATA = {
  cow:      { wave:"sine", baseFreq:262, vol:0.22, env:[0.02,0.22,0.1,0.35] },
  cat:      { wave:"sine", baseFreq:392, vol:0.14, env:[0.005,0.10,0.0,0.15] },
  chick:    { wave:"sine", baseFreq:440, vol:0.12, env:[0.001,0.05,0.0,0.09] },
  gas:      { wave:"sine", baseFreq:294, vol:0.18, env:[0.01,0.12,0.0,0.10] },
  ghost:    { wave:"sine", baseFreq:330, vol:0.20, env:[0.18,0.40,0.25,0.70] },
  clapping: { wave:"sine", baseFreq:523, vol:0.16, env:[0.002,0.03,0.0,0.05] },
  monkey:   { wave:"sine", baseFreq:196, vol:0.20, env:[0.01,0.15,0.0,0.25] }
};




let ceilingY;
let floorY;
let cloud;
let chorusMembers = [];
let startButton;

let imgs = {};

function preload() {
  imgs.cat  = loadImage('Assets/Images/cat.png');
  imgs.chick  = loadImage('Assets/Images/chick.png');
  imgs.clapping = loadImage('Assets/Images/clapping.png');
  imgs.cow  = loadImage('Assets/Images/cow.png');
  imgs.gas = loadImage('Assets/Images/gas.png');
  imgs.ghost = loadImage('Assets/Images/ghost.png');
  imgs.monkey = loadImage('Assets/Images/monkey.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ceilingY = 300;
  floorY = height - 100;
  cloud = { x: width / 2, y: ceilingY - 130, r: 200 };
  
   startButton = createButton('Enable Sound');
  startButton.position(20, 60);
  startButton.mousePressed(() => {
    getAudioContext().resume().then(() => {
      console.log('AudioContext is now running');
      startButton.remove(); 
    });
  });

  let clearButton = createButton("Clear All");
  clearButton.position(20, 20);
  clearButton.mousePressed(clearChorus);
  clearButton.style("padding", "8px 14px");
  clearButton.style("border-radius", "8px");
  clearButton.style("background", "#ffffff80");
  clearButton.style("border", "1px solid #666");
  clearButton.style("cursor", "pointer");
  clearButton.style("font-family", "system-ui");
  
  userStartAudio();
  getAudioContext().resume();

}

function draw() {
  background(250);

  for (let i = 0; i < height; i++) {
    let c = lerpColor(color("#366ABD"), color("#6A9BE9"), i / height);
    stroke(c);
    line(0, i, width, i);
  }
  // ceiling
  stroke(100);
  strokeWeight(1);
  line(0, ceilingY, width, ceilingY);

  // floor
  stroke(150);
  strokeWeight(10);
  line(0, floorY, width, floorY);

  // cloud
  noStroke();
  fill(230);
  drawCloud(cloud.x, cloud.y, cloud.r);

  chorusMembers = chorusMembers.filter(m => !isNaN(m.x) && !isNaN(m.y));

  for (let m of chorusMembers) {
    m.update();
  }

  handleCollisions();

  for (let m of chorusMembers) {
    m.draw();
  }
}

function drawCloud(x, y, r) {
  fill(215);
  ellipse(x + 15, y + 10, r * 1.6, r * 1.1);
  fill(230);
  ellipse(x, y, r * 1.6, r);
  ellipse(x - r * 0.6, y, r, r * 0.8);
  ellipse(x + r * 0.6, y, r, r * 0.8);
  ellipse(x - r * 0.2, y - r * 0.35, r, r * 0.8);
  ellipse(x + r * 0.2, y - r * 0.35, r, r * 0.8);
}


function playVoice(type) {
  if (getAudioContext().state !== "running") return;

  const v = VOICE_DATA[type];
  if (!v) return;

  let src;
  if (v.wave === "noise") {
    src = new p5.Noise('white');
  } else {
    src = new p5.Oscillator('sine'); 
    const jitter = random(0.97, 1.03);
    src.freq(v.baseFreq * jitter);
  }

  const env = new p5.Envelope();
  env.setADSR(...v.env);
  env.setRange(v.vol, 0);

 
  src.amp(env);
  src.connect();       
  src.start();
  env.play();
  src.stop(0.6);
}


class bouncer {
  constructor(x, y, type = "cow") {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = TYPE_DATA[type].bounceSpeed * 8;
    this.r = random(20, 80);

    this.type = type;
    this.spec = TYPE_DATA[type];

    this.cycleSpeed = this.spec.bounceSpeed;

    this.touchingFloor = false;
    this.touchingCeiling = false;
  }

  update() {
 
  this.x += this.vx;
  this.y += this.vy;

  
  if (this.y + this.r > floorY) {
    this.y = floorY - this.r;
    this.vy = -abs(this.vy);  
    this.makeSound();
  }

 
  if (this.y - this.r < ceilingY) {
    this.y = ceilingY + this.r;
    this.vy = abs(this.vy);   
    this.makeSound();
  }

  
  if (this.x - this.r < 0 || this.x + this.r > width) {
    this.vx *= -1;
  }

  
  this.y = constrain(this.y, ceilingY + this.r, floorY - this.r);
}


  makeSound() {
    playVoice(this.type);
  }
  draw() {
  noStroke();
  const img = imgs[this.type];
  if (img && img.width > 0) {
    let bounceScale = map(abs(this.vy), 0, 10, 0.9, 1.1, true);
    imageMode(CENTER);
    image(img, this.x, this.y, this.r * 2 * bounceScale, this.r * 2 * bounceScale);
  }
}
}

 function handleCollisions() {
  for (let i = 0; i < chorusMembers.length; i++) {
    for (let j = i + 1; j < chorusMembers.length; j++) {
      let a = chorusMembers[i];
      let b = chorusMembers[j];

      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let distBetween = sqrt(dx * dx + dy * dy);
      let minDist = a.r + b.r;

      if (distBetween < minDist *0.95) {
        let overlap = minDist - distBetween;
        let nx = dx / distBetween;
        let ny = dy / distBetween;
        a.makeSound();
        setTimeout(()=> b.makeSound(),100);

        a.x -= nx * (overlap / 2);
        a.y -= ny * (overlap / 2);
        b.x += nx * (overlap / 2);
        b.y += ny * (overlap / 2);
        if (random() < 0.5) a.makeSound();
        else b.makeSound();
        let tempVy = a.vy;
        a.vy = b.vy;
        b.vy = tempVy;

        a.vx += random(-0.5, 0.5);
        b.vx += random(-0.5, 0.5);
      }
    }
  }
}

function mousePressed() {
  const d = dist(mouseX, mouseY, cloud.x, cloud.y);
  if (d < cloud.r * 1.2) {
    ensureAudio(); 
    
    
    if (Object.keys(imgs).length === Object.keys(TYPE_DATA).length) {
      const types = Object.keys(TYPE_DATA);
      const chosen = random(types);
      chorusMembers.push(new bouncer(cloud.x, cloud.y + 50, chosen));
    } else {
      console.warn("Images not fully loaded yet!");
    }
  }
}

function ensureAudio() {
  let ctx = getAudioContext();
  if (ctx.state !== "running") {
    ctx.resume().then(() => console.log("Audio resumed"));
  }
}

function clearChorus() {
  chorusMembers = [];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  floorY = height - 100;

  if (cloud) { 
    cloud.x = width / 2;
  }
}
