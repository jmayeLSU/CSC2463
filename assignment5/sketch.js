let sounds;
let left, right, up, down, a, correct;
let vol = new Tone.Volume();
let combination = "";

function preload() {
  //preload all sounds
  sounds = new Tone.Players({
    A : "assets/ANote.mp3",
    Left : "assets/LeftNote.mp3",
    Right : "assets/RightNote.mp3",
    Up : "assets/UpNote.mp3",
    Down : "assets/DownNote.mp3",
    correct : "assets/Correct.mp3"
  })
  //connect dist to sound and to audio
  
  sounds.connect(vol);
  vol.toDestination();
}


function setup() {

  createCanvas(400, 400);
  background(220);

  let scale = 30;
  let cx = 220 - 15;
  let cy = 180 - 15;
  let spacing = 25
  // buttons
  left = createButton('◀');
  up = createButton('▲');
  right = createButton('▶');
  down = createButton('▼');

  //general formatting
  buttons = [left, right, up, down];
  buttons.forEach((button) => {
    button.style('background-color','yellow');
    button.style('border-radius:100px');
    button.size(scale,scale);
  });
  
  right.position(cx+spacing,cy);
  left.position(cx-spacing,cy);
  up.position(cx,cy-spacing);
  down.position(cx,cy+spacing);


  //a button
  a = createButton('A');
  ax = cx - 5; ay = cy - 5;
  a.style('font');
  a.style('background-color:DodgerBlue');
  a.style('border-radius:100px');
  a.size(50,50);
  a.position(ax-50,ay+50);

  //distortion slider
  vx = 200; vy = 370;
  vslide = createSlider(-30,10,-10);
  vslide.position(vx-vslide.width/2,vy -vslide.height/2);
  textAlign(CENTER,CENTER);
  textSize(20);
  text("Volume",vx , vy-20);

  //button clicking
  left.mouseClicked(() => {
    sounds.player('Left').start();
    combination += '◀';
  });
  right.mouseClicked(() => {
    sounds.player('Right').start();
    combination += '▶';
  });
  up.mouseClicked(() => {
    sounds.player('Up').start();
    combination += '▲';
  });
  down.mouseClicked(() => {
    sounds.player('Down').start();
    combination += '▼';
  });
  a.mouseClicked(() => {
    sounds.player('A').start();
    combination += 'A';
  });
  
  //slider dragging
  vslide.mouseMoved (() => vol.volume.value = vslide.value());

  //text
  textAlign(CENTER,CENTER);
  textSize(35);
  textStyle(BOLD)
  text("OCARINA SAMPLER",200,50);
}
function draw() {
  //easter egg 
  if(combination.includes("◀▲▶◀▲▶") || 
    combination.includes("▲◀▶▲◀▶") ||
    combination.includes("▼▶◀▼▶◀") ||
    combination.includes("▶▼▲▶▼▲") ||
    combination.includes("▶A▼▶A▼") ||
    combination.includes("A▼▲A▼▲") ||
    combination.includes("A▲◀▶◀▶") ||
    combination.includes("▼A▼A▶▼▶▼") ||
    combination.includes("A▼▶▶◀") ||
    combination.includes("A▼A▶▼A") ||
    combination.includes("◀▶▶A◀▶▼") ||
    combination.includes("▲▶▲▶◀▲")){

      sounds.player('correct').start(0.8)
      combination = "";
  }

}