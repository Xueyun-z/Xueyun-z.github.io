

// let tempo;
// let machine;

// function setup() {
//   createCanvas(windowWidth, windowHeight);
//   angleMode(RADIANS);
//   rectMode(CENTER);
//   noStroke();
//   userStartAudio();

//   tempo = new TempoClock(90);
//   machine = new MachineSystem([3, 4, 5, 6, 7, 8, 9, 12], tempo);
// }


// function draw() {
//   background("#e1ab23ff");
//   machine.updateAndDisplay();
// }

// // ---------------- TEMPO CLOCK ----------------
// class TempoClock {
//   constructor(BPM) {
//     this.BPM = BPM;
//     this.startTime = millis();
//   }

//   getElapsedBeats() {
//     let elapsed = (millis() - this.startTime) / 1000.0;
//     return elapsed * (this.BPM / 60.0); 
//   }
// }

// // ---------------- MACHINE SYSTEM ----------------
// class MachineSystem {
//   constructor(ratios, tempo) {
//   this.tempo = tempo;
//   this.systems = [];
//   this.lowpass = new p5.LowPass();
//   this.lowpass.freq(400);
//   this.lowpass.res(1);

//   
//   let colorset1 = [
//     color(255, 220, 50),
//     color(255, 170, 90),
//     color(240, 130, 160),
//     color(220, 100, 255)
//   ];
//   let colorset2 = [
//     color(90, 150, 255),
//     color(130, 200, 255),
//     color(180, 255, 150),
//     color(100, 255, 200)
//   ];

//   
//   const E_BASS = [82.41, 103.83, 123.47, 155.56];
//   const E_BASS_HIGH = [164.81, 207.65, 246.94, 311.13];

//   let spacing = height / (ratios.length + 1);

//   for (let i = 0; i < ratios.length; i++) {
//     let y = spacing * (i + 1);
//     let osc = new p5.Oscillator("triangle");
//     let freqSet = i < 4 ? E_BASS : E_BASS_HIGH;
//     osc.freq(freqSet[i % freqSet.length]);
//     osc.amp(0);
//     osc.start();
//     osc.disconnect();
//     osc.connect(this.lowpass);

//     let c = i < 4 ? colorset1[i % 4] : colorset2[i % 4];
//     this.systems.push(new MachineLine(width / 6, y, 45, ratios[i], c, osc));
//   }
// }

//   updateAndDisplay() {
//     let totalBeats = this.tempo.getElapsedBeats();
//     for (let s of this.systems) {
//       s.update(totalBeats);
//       s.display();
//     }
//   }
// }

// // ---------------- MACHINE LINE ----------------
// class MachineLine {
//   constructor(x, y, w, ratio, c, osc) {
//     this.origin = createVector(x, y);
//     this.w = w;
//     this.ratio = ratio;
//     this.c = c;
//     this.osc = osc;

//     this.flash = 0;
//     this.bounce = 0;
//     this.lastTriggerBeat = -1;
//   }

//   update(globalBeats) {
//     // derive phase and angle
//     let localBeats = globalBeats * this.ratio / 4.0;
//     this.phase = localBeats % 1.0;
//     this.angle = this.phase * TWO_PI;

//    
//     let currentBeat = floor(localBeats);
//     if (currentBeat !== this.lastTriggerBeat) {
//       this.lastTriggerBeat = currentBeat;
//       this.trigger();
//     }
//   }


//   trigger() {
//     this.osc.amp(0.4, 0.005);
//     this.osc.amp(0, 0.25);
//     this.flash = 10;
//     this.bounce = random(-8, -12);
//   }

//   display() {
//     let x = this.w * sin(this.angle);
//     let y = this.w * cos(this.angle);
//     let offset = 200;

//     // arms + structure
//     fill(50);
//     ellipse(this.origin.x, this.origin.y, this.w * 2);
//     fill(255);
//     ellipse(this.origin.x + x, this.origin.y + y, 10);

//     fill(this.c);
//     ellipse(this.origin.x + offset, this.origin.y, this.w * 3);
//     fill(255);
//     ellipse(this.origin.x + x + offset, this.origin.y + y, 10);

//     stroke(0);
//     strokeWeight(2);
//     line(this.origin.x, this.origin.y, this.origin.x + x, this.origin.y + y);
//     line(
//       this.origin.x + x,
//       this.origin.y + y,
//       this.origin.x + offset + x,
//       this.origin.y + y
//     );
//     line(
//       this.origin.x + offset,
//       this.origin.y,
//       this.origin.x + offset + x,
//       this.origin.y + y
//     );
//     noStroke();

//     // piston bar
//     let barStartX = this.origin.x + offset + x;
//     let barY = this.origin.y + y + this.bounce;
//     fill(lerpColor(this.c, color(255), 0.2));
//     rectMode(CORNER);
//     rect(barStartX, barY - 5, 100, 10, 3);

//     // drum body
//     let drumX = this.origin.x + offset + this.w + 100;
//     let drumY = this.origin.y;
//     fill(255, 180, 80);
//     rect(drumX, drumY, 20, 40, 4);

//     // flash light
//     if (this.flash > 0) {
//       fill(255, 80, 80, 200);
//       ellipse(drumX + 10, drumY, 25);
//       this.flash--;
//     }

//     // bounce decay
//     this.bounce *= 0.9;
//   }
// }






let tempo;
let leftMachine;
let rightMachine;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(RADIANS);
  rectMode(CENTER);
  noStroke();
  userStartAudio();

  tempo = new TempoClock(90); 

  const ratios = [3, 4, 5, 6, 7, 8, 9, 12];

  
  leftMachine = new MachineSystem(ratios, tempo, {
    baseX: width / 6,
    colorsetType: 1,
    panRange: [-0.4, 0.0],side:"left",mirrored: false,
    octave:0,
  });


  rightMachine = new MachineSystem(ratios, tempo, {
    baseX: width * 5 / 6,
    colorsetType: 2,
    panRange: [0.0, 0.4],
    side:"right",mirrored: true,
    octave:1,
  });
}

function draw() {
  background("#e1ab23ff");
  let beats = tempo.getElapsedBeats();
  leftMachine.updateAndDisplay(beats);
  rightMachine.updateAndDisplay(beats);
}

function keyPressed() {
  // Left group  (W / S)
  if (key === 'W' || key === 'w') leftMachine.volume = constrain(leftMachine.volume + 0.1, 0, 1.5);
  if (key === 'S' || key === 's') leftMachine.volume = constrain(leftMachine.volume - 0.1, 0, 1.5);

  // Right group (Arrow Up / Arrow Down)
  if (keyCode === UP_ARROW)   rightMachine.volume = constrain(rightMachine.volume + 0.1, 0, 1.5);
  if (keyCode === DOWN_ARROW) rightMachine.volume = constrain(rightMachine.volume - 0.1, 0, 1.5);
}




class TempoClock {
  constructor(BPM) {
    this.BPM = BPM;
    this.startTime = millis();
  }
  getElapsedBeats() {
    let elapsed = (millis() - this.startTime) / 1000.0;
    return elapsed * (this.BPM / 60.0);
  }
}


class MachineSystem {
  constructor(ratios, tempo, config) {
    this.side = config.side || "left";  
    this.volume = this.side === "left" ? 0.8 : 1.0;  
    this.volume = (config && config.side === "left") ? 0.8 : 1.0;
    this.tempo = tempo;
    this.systems = [];

    this.baseX = config.baseX;
    this.colorsetType = config.colorsetType;
    this.octave = config.octave || 0;
    this.panRange = config.panRange;
    this.mirrored = config.mirrored || false;

    this.lowpass = new p5.LowPass();
    this.lowpass.freq(400);
    this.lowpass.res(1);

   
    const colorset1 = [
      color(255, 220, 50),
      color(255, 170, 90),
      color(240, 130, 160),
      color(220, 100, 255),
    ];
    const colorset2 = [
      color(90, 150, 255),
      color(130, 200, 255),
      color(180, 255, 150),
      color(100, 255, 200),
    ];
    const colors =
      this.colorsetType === 1
        ? [...colorset1, ...colorset1]
        : [...colorset2, ...colorset2];

   //  Left = E major, Right = B major 
const CHORD_LEFT = [82.41, 103.83, 123.47, 155.56];   // E, G#, B, D#
const CHORD_RIGHT = [246.94, 311.13, 369.99, 466.16];   // B, D#, F#, A#
// C Minor Chord would be: C, D#, G, A# (261.63, 311.13, 392.00, 466.16)
// F# 7sus4 Chord would be: F#, A#, C#, E (369.99, 466.16, 554.37, 659.26)
// B Major Chord would be: B, D#, F#, A# (246.94, 311.13, 369.99, 466.16)

const freqSet = this.octave === 1 ? CHORD_RIGHT : CHORD_LEFT;



    let spacing = height / (ratios.length + 1);

    for (let i = 0; i < ratios.length; i++) {
      let y = spacing * (i + 1);
      let osc = new p5.Oscillator("triangle");
     let baseFreq = freqSet[i % freqSet.length];

// lift up right, leave left untouched
if (this.octave === 1) baseFreq *= 1.0;

osc.freq(baseFreq);

      osc.amp(0);
      osc.start();
      osc.disconnect();
      osc.connect(this.lowpass);
      let panVal = map(
        i,
        0,
        ratios.length - 1,
        this.panRange[0],
        this.panRange[1]
      );
      osc.pan(panVal);
      let c = colors[i % colors.length];
      this.systems.push(
        new MachineLine(this.baseX, y, 45, ratios[i], c, osc, this.mirrored,this)
      );
    }
  }

  updateAndDisplay(beats) {
    for (let s of this.systems) {
      s.update(beats);
      s.display();
    }
  }
}


class MachineLine {
  constructor(x, y, w, ratio, c, osc, mirrored = false, system = null) {
    
    this.origin = createVector(x, y);
    this.w = w;
    this.ratio = ratio;
    this.c = c;
    this.osc = osc;
    this.mirrored = mirrored;
    this.system = system;
    this.flash = 0;
    this.bounce = 0;
    this.lastTriggerBeat = -1;
    this.muted = false;
  }

  update(globalBeats) {
    // identical rhythm to left group
    let localBeats = (globalBeats * this.ratio) / 4.0;
    this.phase = localBeats % 1.0;
    this.angle = this.phase * TWO_PI;

    let currentBeat = floor(localBeats);
    if (currentBeat !== this.lastTriggerBeat) {
      this.lastTriggerBeat = currentBeat;
      this.trigger();
    }
  }

  trigger() {
    if (this.muted) return;
    this.osc.amp(0.4 * this.system.volume, 0.005);
    this.osc.amp(0, 0.25);
    this.flash = 10;
    this.bounce = random(-8, -12);
  }

  display() {
  
  let x = this.w * sin(this.angle);
  let y = this.w * cos(this.angle);
  let offset = 200;

  push();

  // flip drawing direction for right group
  if (this.mirrored) {
    translate(this.origin.x * 2, 0);
    scale(-1, 1);
  }

  // left spindle
  fill(50);
  ellipse(this.origin.x, this.origin.y, this.w * 2);
  fill(255);
  ellipse(this.origin.x + x, this.origin.y + y, 10);

  // right spindle
  fill(this.c);
  ellipse(this.origin.x + offset, this.origin.y, this.w * 3);
  fill(255);
  ellipse(this.origin.x + x + offset, this.origin.y + y, 10);

  // connecting arms
  stroke(0);
  strokeWeight(2);
  line(this.origin.x, this.origin.y, this.origin.x + x, this.origin.y + y);
  line(
    this.origin.x + x,
    this.origin.y + y,
    this.origin.x + offset + x,
    this.origin.y + y
  );
  line(
    this.origin.x + offset,
    this.origin.y,
    this.origin.x + offset + x,
    this.origin.y + y
  );
  noStroke();

  // piston bar
  let barStartX = this.origin.x + offset + x;
  let barY = this.origin.y + y + this.bounce;
  fill(lerpColor(this.c, color(255), 0.2));
  rectMode(CORNER);
  rect(barStartX, barY - 5, 100, 10, 3);

  // drum body
  let drumX = this.origin.x + offset + this.w + 100;
  let drumY = this.origin.y;
  fill(this.muted ? color(150) : color(255, 180, 80)); 
  rect(drumX, drumY, 20, 40, 4);

  // flash light
  if (this.flash > 0) {
    fill(255, 80, 80, 200);
    ellipse(drumX + 10, drumY, 25);
    this.flash--;
  }

  this.bounce *= 0.9;
  pop();
}
}

function mousePressed() {
  // check both groups
  let all = [...leftMachine.systems, ...rightMachine.systems];
  
  for (let i = 0; i< all.length; i++) {

    let line = all[i];
    let offset = 200;
    let drumX = line.origin.x + offset + line.w + 100;
    let drumY = line.origin.y;

    // mirror correction
    // if (line.mirrored) {
    //   // translate its local X into the flipped coordinate
    //   drumX = width - (line.origin.x - offset - line.w - 100);
    // }

    // if (
    //   mouseX > drumX &&
    //   mouseX < drumX + 20 &&
    //   mouseY > drumY  &&
    //   mouseY < drumY + 40
    // ) {
    //   line.muted = !line.muted;
    //   return; // stop after first hit
    // }

    if(i == 10){
      line.muted = !line.muted;
      return;
    }

    //  if (
    //   //i>8 &&
    //   mouseX < width - drumX &&
    //   mouseX > width - (drumX + 20) &&
    //   mouseY > drumY  &&
    //   mouseY < drumY + 40
    // ) {
    //   line.muted = !line.muted;

    //   print(i);
    //   return; // stop after first hit
    // }
  
  
  }

    
    
}

