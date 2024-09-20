 // only finger ellipses


let handpose;
let video;
let hands = [];
let pentatonicScale = ["C4", "D4", "E4", "G4", "A4"]; 
let synth = new Tone.Synth().toDestination(); 

function preload() {
  handpose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handpose.detectStart(video, getHandsData);
}

function draw() {
  image(video, 0, 0, width, height);
  
 
  drawGrid(8, 6);

  for (let hand of hands) {
    let indexFinger = hand.index_finger_tip;
    let thumb = hand.thumb_tip;

    let centerX = (indexFinger.x + thumb.x) / 2;
    let centerY = (indexFinger.y + thumb.y) / 2;

    let distance = dist(indexFinger.x, indexFinger.y, thumb.x, thumb.y);

    
    if (distance < 50) { 
      noStroke();
      fill(0, 0, 255, 150);
      ellipse(centerX, centerY, distance);

      
      let gridX = floor(centerX / (width / 8));
      let gridY = floor(centerY / (height / 6));

      
      playNoteFromGrid(gridX, gridY);
    }
  }
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
