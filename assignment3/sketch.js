let spelunky;
let green;
let viking;
let snail;
let yeti;
let characters;

function preload() {
  //preload all spritesheets
  spelunky = loadImage("sprites/SpelunkyGuy.png");
  green = loadImage("sprites/Green.png");
  viking = loadImage("sprites/Viking.png");
  snail = loadImage("sprites/Snail.png");
  yeti = loadImage("sprites/Yeti.png");

  
}
function setup() {
  createCanvas(400, 400);

  //setup each character and store in character array
  characters = [
    new Character(spelunky,50,50),
    new Character(green,150,50),
    new Character(viking,250,50),
    new Character(snail,150,150,80,80,4),
    new Character(yeti,150,300,160,162,6,[1,0])
  ];
}

function draw() {
  background(220);
  
  //if right arrow is down
  if(keyIsDown(39)){
    //set all charcters to walk to the right
    characters.forEach((Character) => {
      Character.walkRight();
    });
  }
  //if left arrow is down
  else if(keyIsDown(37)){
    //put all sprites in the run animation facing the left
    characters.forEach((Character) => {
      Character.walkLeft();
    });
  }
  //no valid input
  else{
    characters.forEach((Character) => {
      Character.stand();
    });
  }
}

class Character{
  /*
  Constructor to setup the spelunky sprites. Only works with splunky styled spritesheets
  img: spritesheet 
  x: x-coordinate on canvas 
  y: y-coordinate on canvas
  w: width of sprite
  h: height of sprite
  n: number of frames in run animation
  c: [row,column] location of first frame of walking on spritesheet
  */
  constructor(img, x, y, w, h, n, c){
    
    //base character spritesheets have base values and do not need all arguments
    if(w == undefined) w = 80;
    if(h == undefined) h = w;
    if(n == undefined) n = 8;
    if(c == undefined) c = [0,1];

    //create sprite
    this.sprite = new Sprite(x,y,w,h);

    //supply spritesheet
    this.sprite.spriteSheet = img;

    //number of frames before next frame of animation
    this.sprite.anis.frameDelay = 3;

    //add animations from spritesheet
    this.sprite.addAnis({

      // stand animation is frame 0 of row 0
      stand: {row: 0, frames: 1},

      //walk animation is frames 1-8 of row 0
      walk: {row: c[0], col: c[1], frames: n}
    });
    //turn off collision 
    this.sprite.collider = 'none';
    //set start animation to stand
    this.sprite.changeAni("stand");
  }


  //set character to walk facing right
  walkRight(){
    this.sprite.changeAni("walk");
    this.sprite.scale.x = 1;
    this.sprite.vel.x = 2;
  }

  //set character to walk facing left
  walkLeft(){
    this.sprite.changeAni("walk");
    this.sprite.scale.x = -1;
    this.sprite.vel.x = -2;
  }

  //set character to stand
  stand(){
    this.sprite.changeAni("stand");
    this.sprite.vel.x = 0;
  }

}