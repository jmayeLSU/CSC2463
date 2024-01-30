function setup() {
  createCanvas(300, 850);
}

function draw() {
  background(220);
  offx = 50; //offset x
  offy = 50; //offset y
  fill('#77F23B');
  noStroke();
  rect(offx,offy,200,100);

  //Example 1
  fill('white');
  stroke('black');
  strokeWeight(1);
  circle(offx+50,offy+50,80);
  rect(offx+110,offy+10,80,80);

  //Example 2
  offy = offy + 150;
  //background
  noStroke();
  rect(offx,offy,200,200);

  x = offx + 100;
  y = offy + 110;
  r = 38;
  size = 100;
  //red circle
  fill(255,0,0,70);
  circle(x,y-r,size);
  //green circle
  fill(0,255,0,70);
  circle(x+(cos(30)*r),y+(sin(30)*r),size);
  //blue circle
  fill(0,0,255,70);
  circle(x-(cos(30)*r),y+(sin(30)*r),size);

  //Example 3
  offy = offy + 250;
  //background
  fill('black');
  rect(offx,offy,200,100);
  //pacman
  fill('#FFF84A');
  circle(offx+50,offy+50,80);
  fill('black');
  triangle(offx,offy,offx,offy+100,offx+50,offy+50);
  //ghost
  fill('#EA412C');
  rect(offx+110,offy+50,80,40);
  circle(offx+150,offy+50,80);
  fill('white');
  circle(offx+130,offy+50,25);
  circle(offx+170,offy+50,25);
  fill('#0044F7');
  circle(offx+130,offy+50,15);
  circle(offx+170,offy+50,15);

  //star thing idk
  offy = offy + 150;
  //blue background
  fill('#000081');
  rect(offx,offy,200,200)
  //green circle
  fill('#008000');
  stroke('white');
  strokeWeight(3);
  circle(offx+100,offy+100,100);
  //red star
  fill(255,0,0);
  x = offx+100;
  y = offy+100;
  r2 = 50*0.381966; //radius * golden ratio
  angleMode(DEGREES);
  beginShape(TESS);
  vertex(x,y-50);
  vertex(x+(r2*cos(54)),y-(r2*sin(54)));
  vertex((x+cos(18)*50),(y-sin(18)*50));
  vertex(x+(r2*cos(18)),y+(r2*sin(18)));
  vertex(x+(sin(36)*50),(y+cos(36)*50));
  vertex(x,y+r2);
  vertex(x-(sin(36)*50),(y+cos(36)*50));
  vertex(x-(r2*cos(18)),y+(r2*sin(18)));
  vertex(x-(cos(18)*50),(y-sin(18)*50));
  vertex(x-(r2*cos(54)),y-(r2*sin(54)));
  endShape(CLOSE);
}
