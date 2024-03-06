

let notes;

let synth = new Tone.PolySynth(Tone.Synth);

let shift = new Tone.PitchShift(0);
let feedback = new Tone.FeedbackDelay('8n',0);
let frequency = new Tone.FrequencyShifter(0);

let sslider, fslider, frslider;

synth.connect(shift);
shift.connect(feedback);
feedback.connect(frequency);
frequency.toDestination();

function setup() {
  createCanvas(400, 400);
  notes = {
    'a' : 'B3',
    's' : 'C4',
    'd' : 'D4',
    'f' : 'E4',
    'g' : 'F4',
    'h' : 'G4',
    'j' : 'A4',
    'k' : 'B4',
    'q' : 'Bb3',
    'e' : 'Db4',
    'r' : 'Eb4',
    'y' : 'Gb4',
    'u' : 'Ab4',
    'i' : 'Bb4'
  }
  
  stroke('black');
  fill('white');
  
  sslider = createSlider(-6,6,0,1);
  sslider.position(200,50);
  sslider.mouseMoved(()=> shift.pitch = sslider.value());
  fslider = createSlider(0,0.9,0,0.1);
  fslider.position(200,100);
  fslider.mouseMoved(()=> feedback.feedback.value = fslider.value());
  text('Feedback Delay:' + fslider.value(),100,50);

  frslider = createSlider(-99,99,0,1);
  frslider.position(200,150);
  frslider.mouseMoved(()=> frequency.frequency.value = frslider.value());


  a = 0
  background(220);
  stroke('black');
  for(i = 0; i < 9; i++){
    fill('white');
    
    rect((20+40*i),200,40,160);

    if(i>0){
      ch = Object.keys(notes)[i-1].toUpperCase();
      fill('black');
      textAlign(CENTER);
      textSize(20);
      text(ch,(20+40*i)+20,350);
    }
    if([1,3,4,6,7,8].includes(i)){
      bh = Object.keys(notes)[8+a].toUpperCase();
      a++;
      fill('black');
      rect((20+40*i)-10,200,20,80);

      fill('white');
      text(bh,(20+40*i),270)
    }
  }
  
}


function keyPressed(){
  synth.triggerAttack(notes[key]);
}

function keyReleased(){
  synth.triggerRelease(notes[key],'+0.1');
}

function draw() {
  fill(220);
  stroke(220);
  rect(0,0,400,180);
  fill('black');
  textAlign(LEFT);
  text('Pitch Shift:\t' + sslider.value(),63,65);
  text('Feedback Delay:\t' + fslider.value(),8,115);
  text('Frequency Shift:\t' + frslider.value(),12,165);
}
