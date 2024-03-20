let basefreq = 200;
let endfreq = 2000;
let gain = new Tone.Gain(0.1); //lovers volume
let noise = new Tone.Noise('pink');
let filter = new Tone.Filter(basefreq,'highpass');
noise.connect(filter);
filter.connect(gain);

let synth = new Tone.Synth().connect(gain);
let lfo = new Tone.LFO(40, 200, 400).connect(synth.frequency);

gain.toDestination();

function preload(){
  pic = loadImage('assets/lightsaber.jpeg')
  lfo.start();
}


function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // change background image on mouse press
  if(mouseIsPressed == true){
    background(pic);
  }
  else{
    fill('black');
    textAlign(CENTER);
    text('click me!',200,200);
  }
}

function mousePressed() {

  //plays start noise
  noise.fadeOut = 0.3;
  noise.start();
  noise.stop('+0.5')

  //plays humming noise while mouse is held down
  filter.frequency.rampTo(endfreq,0.25);
  synth.triggerAttack('C4','+0.1',0.1);
}

function mouseReleased() {  
  
  //stops any current noise 
  noise.stop();

  //ramps in reverse as an ending noise
  noise.fadeOut = 0.3;
  noise.start();
  noise.stop();
  filter.frequency.rampTo(basefreq,0.25);

  //end humming noise
  synth.triggerRelease();
}