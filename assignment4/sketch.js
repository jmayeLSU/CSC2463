let bug;
let bugs;
let score = 0;
let frame = 0;
let gameover = false;
let speed = 1;

//number of bugs in the gamew
const nbugs = 50;

//timer starts at 30 seconds
let timer = 30;

// constants for end of game screen
const x1 = 0, y1 = 50, x2 = 400, y2 = 450; 

function preload() {
  //preload all spritesheets
  bug = loadImage("assets/bug.png");

  
}

function setup() {
  createCanvas(x2, y2);
  time = second();
  angleMode(DEGREES)
 
  //put n bugs on the canvas
  bugs = [];
  for(i = 0; i < nbugs; i++){
    bugs[i] = new Bug();
  }
}

function draw() {

  //stop the game when the timer hits 0
  if(timer == 0){
    if(!gameover){
      strokeJoin(ROUND);
      textAlign(CENTER);
      stroke('black');
      strokeCap
      strokeWeight(10);
      text("GAME OVER",200,225,);
      textSize(20)
      text("SCORE: " + score, 200,260)
      gameover = true;
    }
    return;
  }

  //tick down timer every second
  if(time != second()){
    time = second();
    timer--;
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

  //call for each bug to move
  bugs.forEach((bug) => {
    bug.move();
  });

  //count each frame for animations
  frame++;
}

function mouseClicked(){

  for(bug of bugs){
    
    //mark bug dead when clicked on
    if(abs(bug.x - mouseX) <= 16 && abs(bug.y - mouseY) <= 16){

      if(!bug.dead){
        //increment score
        score++;
        speed += 1/(nbugs-score);
        bug.dead = true;

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