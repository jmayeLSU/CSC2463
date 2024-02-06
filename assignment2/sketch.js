let colors


function setup() {
  createCanvas(400, 400);
  
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


}

function draw() {
  background(220);
  let cx = 0;
  let cy = 0;
  stroke('white');
  for(let i = 0; i < colors.length; i++) {
    fill(colors[i]);
    rect(cx,cy,25,25);
    cy +=25;
  }
}
