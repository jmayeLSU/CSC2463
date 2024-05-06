let port;
let connectB;
let x, y, sw;

function setup() {
  port = createSerial();
  createCanvas(400, 400);
  connectB = createButton('Connect');
  connectB.mousePressed(connect);
}

function draw() {
  let str = port.readUntil('\n');
  if(str.length>0){
    
    [x,y,sw] = str.split(' ');
  }
  let R = map(x,0,1023,0,255);
  let G = map(y,0,1023,0,255);
  let B = map(abs(x-y),0,1023,0,255);
  background(R,G,B);
}

function connect() {
  if(!port.opened()) {
    port.open('Arduino',9600);
  }
  else {
    port.close();
  }
}
function mousePressed() {
  port.write("1\n");
}
function mouseReleased() {
  port.write("0\n");
}