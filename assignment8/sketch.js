let bug;
let bugs;
let score = 0;
let frame = 0;
let gamestart = false;
let gameover = false;
let speed = 1;

//number of bugs in the gamew
const nbugs = 50;

//timer starts at 30 seconds
let timer = 30;

//delays game for jingle
let delay = 3;

let time = 0;
// constants for end of game screen
const x1 = 0, y1 = 50, x2 = 400, y2 = 450; 


let gain = new Tone.Gain(0.1);
let synth = new Tone.Synth().connect(gain);
let menusynth = new Tone.Synth().connect(gain);
let musicsynth = new Tone.Synth().connect(gain);
musicsynth.volume.value = -5;
synth.volume.value = -10;
gain.toDestination();




function preload() {
  //preload all spritesheets
  bug = loadImage("assets/bug.png");

  
}

function setup() {
  createCanvas(x2, y2);
  angleMode(DEGREES);
 
  //put n bugs on the canvas
  bugs = [];
  for(i = 0; i < nbugs; i++){
    bugs[i] = new Bug();
  }
  
 
}

function draw() {

  
  if(gameover){
    return;
  }
  
  

  //reset background
  background(220);

  //setup scoreboard
  fill('black');
  rect(0,0,400,50);
  tSize = 20;
  textSize(tSize);
  textStyle(BOLD);
  fill('white');
  textAlign(LEFT);
  text('TIME: ' + timer, 10, 5 + tSize);
  text('SCORE: ' + score, 10, 25 + tSize);
  tSize = 40;
  textSize(tSize);
  textAlign(RIGHT);
  text((nbugs-score) +' BUGS', 390, 40)

  

  //NEW: game start menu
  if(!gamestart){

    strokeJoin(ROUND);
    textAlign(CENTER);
    stroke('black');
    strokeCap;
    strokeWeight(10);
    text("CLICK TO START",200,225,);
    textSize(20);
    return;
  }
  //delays game until start jingle finishes
  if(delay > 0){
    if(time != second()){
      time = second();
      delay--;
    }
    //plays game music when game starts
    if(delay == 0){
      seq.stop();
      Tone.Transport.stop();
      Tone.Transport.clear();
      music = new Tone.Sequence((time, note) => 
      {musicsynth.triggerAttackRelease(note, 0.1, time);},
      [['G3', 'A3'], ['G3','E3'],['D3','E3','C3']],1.5).start(0);
      Tone.Transport.start();
    }
    return;
  }

  

  //call for each bug to move
  bugs.forEach((bug) => {
    bug.move();
  });

  //count each frame for animations
  frame++;

  
  //stop the game when the timer hits 0
  if(timer == 0){
    strokeJoin(ROUND);
    textAlign(CENTER);
    stroke('black');
    strokeCap;
    strokeWeight(10);
    text("GAME OVER",200,225,);
    textSize(20);
    text("SCORE: " + score, 200,260)
    gameover = true;

    //NEW: end jingle
    music.stop();
    Tone.Transport.stop();
    end = new Tone.Sequence((time, note) => 
    {menusynth.triggerAttackRelease(note, 0.1, time);},
    [['G4', 'A4'], 'G4','E4','D4','E4','C4']).start(0);
    end.loop = 0;
    Tone.Transport.start();
    
    return;
  }
  
  //tick down timer every second
  if(time != second()){
    time = second();
    if(timer < 11 && timer > 1){  
      musicsynth.volume.value = -14;
      menusynth.triggerAttackRelease('C3',0.1);
    }
    timer--;
  }
}

function mouseClicked(){


  //Click to start game
  if(!gamestart){
     //start jingle
     seq = new Tone.Sequence((time, note) => 
      {menusynth.triggerAttackRelease(note, 0.1, time);},
       [['C4', 'E4'], 'D4', 'E4', 'G4', 'A4', 'G4']).start(0);
     seq.loop = 0;
     Tone.Transport.start();
     gamestart = true;
     time = second();
    return;
  }

  if(gameover || delay > 0){
    return;
  }

  for(bug of bugs){
    
    //mark bug dead when clicked on
    if(abs(bug.x - mouseX) <= 16 && abs(bug.y - mouseY) <= 16){

      if(!bug.dead){
        //increment score
        score++;
        speed = 1 + 0.1*score;
        bug.dead = true;

        //NEW: bug dead sound.
        num = int(score/10);
        switch(num){
          //sound changes every 10 + score
          case 0: synth.triggerAttackRelease('C5',0.1); break;
          case 1: synth.triggerAttackRelease('D5',0.1); break;
          case 2: synth.triggerAttackRelease('E5',0.1); break;
          case 3: synth.triggerAttackRelease('F5',0.1); break;
          default: synth.triggerAttackRelease('G5',0.1); break;
        }
        // return to prevent clicking on multiple bugs at once
        return;
      }
    }
  }
}

class Bug{

  //base constructor for bug
  constructor(){
    this.dead = false;
    this.spritesheet = bug;
    this.x = int(random(x1+32,x2-32));
    this.y = int(random(y1+32,y2-32));
    this.rotation = int(random(0,360));
    this.sx = 0;
    this.sy = 0;
    this.sprite = image(this.spritesheet,this.x-16,this.y-16,32,32,this.sx,this.sy,this.sx+32,this.sy+32);

  }

  
  move(){

    //if dead display the dead sprite
    if(this.dead){
      push();
      translate(this.x,this.y);
      rotate(this.rotation);
      this.sprite = image(this.spritesheet,-16,-16,32,32,256,this.sy,32,32);
      pop();
      return;
    }

    //make bug move in apprpriate direction
    this.x += cos(this.rotation)*speed; 
    this.y += sin(this.rotation)*speed;

    //if bug reaches end of screen set new rotation
    if(this.x <= x1+16){
      this.rotation = int(random(-80,80));
    }
    else if(this.x >= x2-16){
      this.rotation = int(random(100,260));
    }

    if(this.y <= y1+16){
      this.rotation = int(random(10,170));
    }
    else if(this.y >= y2-16){
      this.rotation = int(random(190,350));
    }

    //move index down spritesheet every n frames
    if(frame % 5 == 0){
      this.sx += 32;
      if(this.sx >= 256)
      {this.sx = 0;}
    }

    //place bug sprite
    //use push + pop so that translate and rotate can be used
    push();
    translate(this.x,this.y);
    rotate(this.rotation);
    this.sprite = image(this.spritesheet,-16,-16,32,32,this.sx,this.sy,32,32);
    pop();
  }
  
}