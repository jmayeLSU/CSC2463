//maze
let cols, rows;
let maze = [];
let unexplored = [];
let current;
let sets = [];

//player 
let playerX;
let playerY;
let playerPos;
let moveTime = 0;
let moveDelay = 300;
let frame = 0;

//treasure
let order = [];
let collected = [false,false,false,false];
let collectIndex = 0;

//pixels per cell
let n = 50;

//ARDUINO
let port;
let bx=0, by=0, sw=0;
let pressed = false;

//gamestates
let gamestate = 0;
let win = false;
let wins = 0;
let message = 'You grabbed the wrong Treasure!';

//menu
let menuY = 100;
let timer = 60;
let currentTime;
let gameoverTime;

//sprite
let playersheet;

//sound
let gain = new Tone.Gain(0.1);
let synth = new Tone.Synth().connect(gain);
let menusynth = new Tone.MonoSynth().connect(gain);
let musicsynth = new Tone.MembraneSynth().connect(gain);
musicsynth.volume.value = -5;
synth.volume.value = -10;
gain.toDestination();

function preload(){
    playersheet = loadImage('assets/player.png')
}

function setup() {
    createCanvas(500, 500+menuY);
    setupMaze();
    randomOrder();
    setupConnect();
    
    playerX = parseInt(cols/2);
    playerY = parseInt(rows/2);
    playerPos = (playerY)*cols + playerX;
}

function draw() {
    background(220);
    GameMenu();
    checkPlayer();
    button.center('horizontal');
    if(gamestate == 0){
        StartScreen();
        return;
    }
    if(gamestate == 2){
        StopScreen();
        return;
    }
    displayMaze();
    displayTreasures();
    displayPlayer();
    UpdateTimer();
}

function setupConnect(){
    port = createSerial();
    button = createButton('Connect');
    button.position(0, height);
    button.mousePressed(connect);
}

function connect() {
    if(!port.opened()) {
        port.open('Arduino',9600);
    }
    else {
        port.close();
    }
}

function deleteEdge(cell, nextCell){
    let xOff = nextCell.x - cell.x;
    let yOff = nextCell.y - cell.y;

    //remove right edge
    if(xOff == 1){
        cell.edges[1] = false;
        nextCell.edges[3] = false;
    }
    //removbe left edge
    if(xOff == -1){
        cell.edges[3] = false;
        nextCell.edges[1] = false;
    }
    //remove bottom edge
    if(yOff == 1){
        cell.edges[2] = false;
        nextCell.edges[0] = false;
    }
    //remove top edge
    if(yOff == -1){
        cell.edges[0] = false;
        nextCell.edges[2] = false;
    }
}

function findPos(x,y){
    if (x < 0 || y < 0 || x > cols-1 || y > rows-1) {
        return null;
      }
      return x + y * cols;
}

class cell{

    constructor(x,y){
        this.x = x;
        this.y = y;
        this.pos = y*cols + x;
        this.edges = [true,true,true,true];
        this.explored = false;
        this.top = findPos(x,y-1);
        this.right = findPos(x+1,y);
        this.down = findPos(x,y+1);
        this.left = findPos(x-1,y);
    }

    joined(nextCell){
        for(let i = 0; i < sets.length; i++){
            if(sets[i].includes(this.pos) && sets[i].includes(nextCell.pos)){
                return true;
            }
        }
        return false;
    }

    next(){
        let canjoin = [];
        if(this.up != null && !this.joined(this.up) && this.edges[0]){
            canjoin.push(this.up);
        }
        if(this.right != null && !this.joined(this.right) && this.edges[1]){
            canjoin.push(this.right);
        }
        if(this.down != null && !this.joined(this.down) && this.edges[2]){
            canjoin.push(this.down);
        }
        if(this.left != null && !this.joined(this.left) && this.edges[3]){
            canjoin.push(this.left);
        }
        if(canjoin.length>0){
            return maze[canjoin[parseInt(random(0,canjoin.length))]];
        }
        return null;
    }

    display(){
        let xPos = this.x * n;
        let yPos = this.y * n + menuY;
        stroke('black');
        //top
        if(this.edges[0]){
            line(xPos, yPos, xPos + n, yPos);
        }
        //right
        if(this.edges[1]){
            line(xPos + n, yPos, xPos + n, yPos + n);
        }
        //down
        if(this.edges[2]){
            line(xPos, yPos + n, xPos + n, yPos + n);
        }
        //left
        if(this.edges[3]){
            line(xPos, yPos + n, xPos, yPos);
        }
    }
}

function setupMaze() {
    cols = parseInt(width/n);
    rows = parseInt((height-menuY)/n);
    
    for(let y = 0; y < rows; y++){
        for (let x = 0; x < cols; x++){
            let newcell = new cell(x,y);
            maze.push(newcell);
            sets.push([newcell.pos]);
            
        }
    }

    unexplored = maze;
    let start = parseInt(random(0,(cols*rows)));
    current = maze[start];
    createMaze();
}

function createMaze(){
    while(sets.length > 1){
        if(!current.explored){
            let next = current.next();
            let currentset;
            let joinset;
            let joinsetIndex;
            if(next != null){
                for(let i = 0; i < sets.length; i++){
                    if(sets[i].includes(current.pos)){
                        currentset = sets[i];
                    }
                    else if(sets[i].includes(next.pos)){
                        joinset = sets[i];
                        joinsetIndex = i;
                    }
                }

                if(joinset != null){
                    for(let i = 0; i < joinset.length; i++){
                        currentset.push(joinset[i]);
                    }
                    sets.splice(joinsetIndex,1);
                    deleteEdge(current,next);
                }
            }
            else if (sets.length > 1){
                current.explored = true;
                unexplored = unexplored.filter(cell => cell.pos != current.pos);
            }
        }
        current = unexplored[parseInt(random(0,unexplored.length))];
    }
}

function displayMaze(){
    strokeWeight(10);
    for(let i = 0; i < maze.length; i++){
        maze[i].display();
    }
}

function displayPlayer(){   
    strokeWeight(5);
    fill('yellow');
    let size = n-10
    let off = parseInt((n-size)/2);
    //rect((playerX*n)+off,(playerY*n)+off+menuY,size,size);
    if(frame == 4) frame = 0;
    let xoff = 64*frame;
    image(playersheet,(playerX*n)+off,(playerY*n)+off+menuY,size,size,0+xoff,0,64,64);
}

function checkPlayer(){
    let str = port.readUntil('\n');
    let xMove = 0;
    let yMove = 0;
    if(str.length>0){
        
        [bx,by,sw] = str.split(' ');
        if(bx < 100) xMove = -1;
        else if (bx > 900) xMove = 1
        else xMove = 0;

        if(by < 100) yMove = -1;
        else if (by > 900) yMove = 1
        else yMove = 0;
    }
    
    if(!pressed){
        if(sw==1) {
          buttonPress();
        }
    }
    if(sw==0){
        pressed = false;
    }
    if(moveTime+moveDelay < millis()){    
        updatePos(xMove,yMove);
    }
}

function updatePos(x,y){
    if(gamestate != 1) return;

    playerCell = maze[playerPos];
    if(y == -1){
        if(!playerCell.edges[0]){
            playerY--;
            moveTime = millis();
            frame++;
        }
        else wallNoise();
    }
    else if(x == 1){
        if(!playerCell.edges[1]){
            playerX++;
            moveTime = millis();
            frame++;
        }
        else wallNoise();
    }
    else if(y == 1){
        if(!playerCell.edges[2]){
            playerY++;
            moveTime = millis();
            frame++;
        }
        else wallNoise();
    }
    else if(x == -1){
        if(!playerCell.edges[3]){
            playerX--;
            moveTime = millis();
            frame++;
        }
        else wallNoise();
    }
    playerPos = (playerY)*cols + playerX;
    
}

function displayTreasures(){
    let size = n/2
    let off = parseInt((n-size)/2);
    strokeWeight(5);
    //top left
    if(!collected[0]){
        fill('red');
        rect(off,off+menuY,size,size);
    }

    //top right
    if(!collected[1]){
        fill('blue');
        rect(((cols-1)*n)+off,off+menuY,size,size);
    }
    //bottom left
    if(!collected[2]){
        fill('green');
        rect(off,((rows-1)*n)+off+menuY,size,size);
    }
    //bottom right
    if(!collected[3]){
        fill('purple');
        rect(((cols-1)*n)+off,((rows-1)*n)+off+menuY,size,size);
    }
}

function randomOrder(){
    let treasures = ['TL','TR','BL','BR']
    while(treasures.length > 0){
        let nextTreasure = parseInt(random(0,treasures.length));
        order.push(treasures[nextTreasure]);
        treasures.splice(nextTreasure,1);
    }
    print("treasures",order[0],order[1],order[2],order[3]);
}

function buttonPress(){
    pressed = true;
    if(gamestate == 0){
        StartGame();
        return;
    }
    if(gamestate == 2){
        restart();
        if(gameoverTime + 1 < second())
        {
            gamestate = 0;
        }
        return;
    }
        

    //Top left
    if(playerPos == 0 && !collected[0]){
        if(order[collectIndex]=='TL'){
            collected[0] = true;
            collectIndex++;
            outColor();
            grabNoise()
        }
        else{
            EndGame();
        }
    }
    //Top Right
    else if(playerPos == cols-1 && !collected[1]){
        if(order[collectIndex]=='TR'){
            collected[1] = true;
            collectIndex++;
            outColor();
            grabNoise()
        }
        else{
            EndGame();
        }
    }
    //Bottom Left
    else if(playerPos == cols*(rows-1) && !collected[2]){
        if(order[collectIndex]=='BL'){
            collected[2] = true;
            collectIndex++;
            outColor();
            grabNoise()
        }
        else{
            EndGame();
        }
    }
    //Bottom Right
    else if(playerPos == ((cols*rows)-1) && !collected[3]){
        if(order[collectIndex]=='BR'){
            collected[3] = true;
            collectIndex++;
            outColor();
            grabNoise()
        }
        else{
            EndGame();
        }
    }
    WinCheck();
}

function StartScreen(){
    strokeJoin(ROUND);
    textAlign(CENTER);
    stroke('black');
    fill('yellow');
    strokeCap;
    strokeWeight(10);
    textSize(40);
    text("FOUR TREASURE MAZE",width/2,height/2-20)
    fill('white');
    textSize(50);
    text("PRESS\nTO START",width/2,height/2+40);
    textSize(20);
}

function WinCheck(){
    if(collectIndex == 4){
        win = true;
        wins++;
        message = 'You WON!';
        EndGame();
    }
}
function StopScreen(){
    strokeJoin(ROUND);
    textAlign(CENTER);
    stroke('black');
    fill('white');
    strokeCap;
    strokeWeight(10);
    textSize(50);
    text("GAME OVER",width/2,225+menuY);
    textSize(20);
    strokeWeight(5);
    text(message,width/2, 270+menuY);
}

function GameMenu(){
    fill('black');
    rect(0,0,width,100);
    tSize = 30;
    textSize(tSize);
    textStyle(BOLD);
    fill('white');
    textAlign(LEFT);
    text('TREASURES: ' , 30, 5 + tSize);
    tSize = 60;
    textSize(tSize);
    text(collectIndex , 100, 30 + tSize);
    tSize = 30;
    textSize(tSize);
    text('TIME: ', 350, 5 + tSize)
    tSize = 60;
    textSize(tSize);
    text(timer , 360, 30 + tSize);
}

function UpdateTimer(){
    if(currentTime != second()){
        currentTime = second();
        timer--;
        
        if(timer < 11 && timer > 1){  
            synth.triggerAttackRelease('C3',0.1);
        }
    }
    if(timer == 0){
        message = 'You ran out of time!';
        EndGame()
    }
}   

function grabNoise(){
    switch(collectIndex){
        case 1: synth.triggerAttackRelease('C5',0.1); break;
        case 2: synth.triggerAttackRelease('D5',0.3); break;
        case 3: synth.triggerAttackRelease('E5',0.5); break;
    }
}

function wallNoise(){
    synth.triggerAttackRelease('G3',0.05); 
}

function startJingle(){
    Tone.Transport.stop();
    Tone.Transport.clear();
    music = new Tone.Sequence((time, note) => 
    {musicsynth.triggerAttackRelease(note, 0.1, time);},
    [['C3', 'A3'], ['B3','E3','A3'],['E3','G3']],1.5).start(0);
    Tone.Transport.start();
}

function stopJingle(){
    music.stop();
    Tone.Transport.stop();
    end = new Tone.Sequence((time, note) => 
    {menusynth.triggerAttackRelease(note, 0.1, time);},
    [['D4', 'A4'], ['D4','G4'],'D4','E4','C4',['E3','G3']]).start(0);
    end.loop = 0;
    Tone.Transport.start();
}

function EndGame(){
    port.write("0 0 0\n");
    stopJingle();
    gamestate = 2;
    gameoverTime = second();
}

function StartGame(){
    gamestate = 1;
    startJingle();
    currentTime = second();
    
    outColor();
}

function outColor(){
    if(collectIndex==4) {
        port.write("0 0 0\n");
        return;
    }
    let treasure = order[collectIndex];
    if(treasure == 'TL'){
        port.write("100 0 0\n");
    }
    else if(treasure == 'TR'){
        port.write("0 0 100\n");
    }
    else if(treasure == 'BL'){
        port.write("0 100 0\n");
    }
    else if(treasure == 'BR'){
        port.write("100 0 100\n");
    }
}

function restart(){
    timer = 60;
    if(wins){
        n = 25;
        timer = 70;
    }
    win = false;
    order = [];
    collected = [false,false,false,false];
    collectIndex = 0;
    message = 'You grabbed the wrong Treasure!';

    maze = [];
    sets = [];
    setupMaze();
    randomOrder();
    frame = 0;
    
    playerX = parseInt(cols/2);
    playerY = parseInt(rows/2);
    playerPos = (playerY)*cols + playerX;
}