let colors;
let selectedCol;
let dragging;

function setup() {
  createCanvas(600, 400);
  background(220);
  colors = [
    color('red'), 
    color('orange'), 
    color('yellow'), 
    color('green'),
    color('cyan'),
    color('blue'),
    color('purple'),
    color('brown'),
    color('white'),
    color('black'),
  ];
  selectedCol = color('red');
  dragging = false;
}

function draw() {
  let cx = 0;
  let cy = 0;
  stroke('white');
  for(let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    rect(cx,cy,25,25);
    cy +=25;
  }
}

function mouseClicked() {
  if(mouseX < 25 && mouseY < 250) {
    selectedCol = colors[(Math.floor(mouseY/25))];
  }
}

function mouseDragged() {
  stroke(selectedCol);
  strokeWeight(10);
  line(pmouseX,pmouseY,mouseX,mouseY);
  strokeWeight(1);
}


