let handpose;
let video;
let hands = [];
let pentatonicScale = ["C4", "D4", "E4", "G4", "A4"]; 
let synth = new Tone.Synth().toDestination(); 

let collisionIndex = 10;


let x = 100;
let y = 100;
let speedX = 5;
let speedY = 8;

function preload() {
  handpose = ml5.handPose({ flipHorizontal: true });
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  

  handpose.detectStart(video, getHandsData);
}



let lastCollisionTime = 0; 
const collisionCooldown = 300; 

function draw() {
  push();
  scale(-1,1);
  translate(-width, 0);
  image(video, 0, 0, width, height);
  pop();
  drawGrid(8, 6);


  for (let hand of hands) {
    let indexFinger = hand.index_finger_tip;
    let thumb = hand.thumb_tip;

    let centerX = (indexFinger.x + thumb.x) / 2;
    let centerY = (indexFinger.y + thumb.y) / 2;

    let distance = dist(indexFinger.x, indexFinger.y, thumb.x, thumb.y);

    // finger ellipse code from lecture
    if (distance < 50) { 
      noStroke();
      fill(0, 0, 255, 150);
      ellipse(centerX, centerY, distance);

      let gridX = floor(centerX / (width / 8));
      let gridY = floor(centerY / (height / 6));

      playNoteFromGrid(gridX, gridY);
    }

    // Hand collision
    if (x > indexFinger.x && x < indexFinger.x + 50 && y > indexFinger.y && y < indexFinger.y + 50) {
      let currentTime = millis();
      if (currentTime - lastCollisionTime > collisionCooldown) {
        speedX *= -1;
        speedY *= -1;
        playNoteFromGrid(x, y);
        lastCollisionTime = currentTime;
        collisionIndex = collisionIndex * 3;
      }
    }
    // if(collisionIndex >= 255) {
    //   playNoteFromGrid(x++, y++);
    // }
  }

  ellipseRadius = 80;
  fill(collisionIndex, 0, 0);
  ellipse(x, y, ellipseRadius);


  // Border collision
  let currentTime = millis();
  if (x + (ellipseRadius / 2) > width || x < 0 + (ellipseRadius / 2)) {
    if (currentTime - lastCollisionTime > collisionCooldown) {
      speedX *= -1;
      playNoteFromGrid(x, y);
      lastCollisionTime = currentTime; 
    }
  }
  if (y + (ellipseRadius / 2) > height|| y < 0 + (ellipseRadius / 2)) {
    if (currentTime - lastCollisionTime > collisionCooldown) {
      speedY *= -1;
      playNoteFromGrid(x, y);
      lastCollisionTime = currentTime; 
    }
  }

  x += speedX;
  y += speedY;
}


function drawGrid(cols, rows) {
  stroke(255, 150); 
  for (let i = 0; i <= cols; i++) {
    line(i * width / cols, 0, i * width / cols, height);
  }
  for (let j = 0; j <= rows; j++) {
    line(0, j * height / rows, width, j * height / rows);
  }
}

function playNoteFromGrid(x, y) {
  let noteIndex = (x + y * 8) % pentatonicScale.length;
  let note = pentatonicScale[noteIndex];
  
  synth.triggerAttackRelease(note, "8n");
}

function getHandsData(results) {
  hands = results;
}
