let n = 80;
let cols, rows;
let maze = [];
let unexplored = [];
let current;
let sets = [];


function setup() {
    createCanvas(400, 400);
    cols = floor(width/n);
    rows = floor(width/n);

    for(y = 0; y < rows; y++){
        for (x = 0; x < cols; x++){
            newcell = new cell(x,y);
            newcell.setnum = sets.length;
            maze.push(newcell);
            sets.push([newcell.pos]);
            
        }
    }

    unexplored = maze;
    current = maze[parseInt(random(0,cols*rows))];
}

function draw() {
    if(unexplored.length > 0){
        if(!current.explored){
            var currentset = sets[current.setnum];
            var next = current.next();
            var nextset;
            if(next != null){
                nextset = sets[next.setnum];
                for(i = 0; i < nextset.length; i++){
                    maze[nextset[i]].setnum = current.setnum;
                    print(nextset[i]);
                    currentset.push(nextset[i]);
                }
                sets.splice(next.setnum,1);
                deleteEdge(current,next);

            }
            else if(sets.lenght>1){
                current.explored = true;
                index = unexplored.indexOf(current);
                unexplored.splice(index,1);
            }
        }
        current = unexplored[parseInt(random(0,unexplored.length))];
        background(220);
    }
    for(i = 0; i < maze.length; i++){
        maze[i].display();
    }
}

function deleteEdge(cell, nextCell){
    xOff = nextCell.x - cell.x;
    yOff = nextCell.y - cell.y;
    if(xOff == 1){
        cell.edges[1] = false;
        nextCell.edges[3] = false;
    }
    if(xOff == -1){
        cell.edges[3] = false;
        nextCell.edges[1] = false;
    }
    if(yOff == 1){
        cell.edges[2] = false;
        nextCell.edges[0] = false;
    }
    if(xOff == -1){
        cell.edges[0] = false;
        nextCell.edges[2] = false;
    }
}

class cell{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.pos = y*cols + x;
        this.edges = [true,true,true,true];
        this.explored = false;
        this.setnum;
        this.up = null;
        this.down = null;
        this.left = null;
        this.right = null;

        if(this.x > 0){
            this.left = this.y*cols + (this.x-1);
        }
        if(this.x+1 < cols){
            this.right = this.y*cols + (this.x+1);
        }
        if(this.y > 0){
            this.up = (this.y-1)*cols + this.x;
        }
        if(this.y+1 < rows){
            this.down = (this.y+1)*cols + this.x;
        }
    }

    joined(nextCell){
        for(var i = 0; i < sets.length; i++){
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
        var xPos = this.x * n;
        var yPos = this.y * n;
        stroke('black');
        if(this.edges[0]){
            line(xPos, yPos, xPos + n, yPos);
        }
        if(this.edges[1]){
            line(xPos + n, yPos, xPos + n, yPos + n);
        }
        if(this.edges[2]){
            line(xPos, yPos + n, xPos + n, yPos + n);
        }
        if(this.edges[3]){
            line(xPos, yPos + n, xPos, yPos);
        }
    }
}