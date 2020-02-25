const segmentSize = 20;
const fieldSize = 800;
const interval = 10;
const distance = 2;
let unit = "px";
let field = document.getElementById('field');
let snakeObj = null;
let snakeVis = document.getElementById('snake');
let timer = null;



function Segment(color) {
    this.w = segmentSize;
    this.h = this.w;
    this.x = 0;
    this.y = 0;
    this.c = color;

    this.setPos = function(i, x, y) {
        console.log('setting position');
        let element = snakeVis.children[i];
        element.style.left = x + unit;
        element.style.top = y + unit;
    }
}

function Snake() {
    this.segments = [new Segment("#00ff00")];

    console.log(this.segments);
    console.log(this.segments.length);
    this.head = this.segments[0];
    this.direction = "";

    this.changeDirection = function(event) {

    	console.log(this.segments);
        console.log("changing direction");
        switch (event.key) {
            case "ArrowLeft":
                this.direction = "left";
                break;
            case "ArrowRight":
                this.direction = "right";
                break;
            case "ArrowUp":
                this.direction = "up";
                break;
            case "ArrowDown":
                this.direction = "down";
                break;
            default:
                break;
        }

    console.log(this.direction);

    }
    this.die = function() { clearInterval(timer); }
    this.move = function() {

        let x = parseInt(document.getElementById('head').style.left);
        let y = parseInt(document.getElementById('head').style.top);

        console.log(`x: ${x} y: ${y}`);

        switch (this.direction) {
            case "left":
                x = x - distance;
                break;
            case "right":
                x = x + distance;
                break;
            case "up":
                y = y - distance;
                break;
            case "down":
                y = y + distance;
                break;
            default:
                return;
        }

        //console.log("moving");

        // if (x < 0 ||
        //     y < 0 ||
        //     x > fieldSize - segmentSize ||
        //     y > fieldSize - segmentSize) {
        //     this.die();
        // } 


        // for (let i=0; i<this.segments.length; i++) {
        // }


    	console.log(this.segments);
        this.segments[0].setPos(0, x, y);
       
    }
}






function isTouching(thing1, thing2) {
    let rect1 = thing1.getBoundingClientRect();
    let rect2 = thing2.getBoundingClientRect();

    if (rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom) {
        return true;
    } else {
        return false;
    }
}

function initialize() {
    field.style.width = fieldSize + unit;
    field.style.height = fieldSize + unit;
    snakeObj = new Snake();

    window.addEventListener('keydown', snakeObj.changeDirection);
    timer = setInterval(snakeObj.move, interval);


    snakeVis.innerHTML += `<div id="head" class="segment" 
    	style="position: relative; width: ${snakeObj.head.w + unit}; 
    	height: ${snakeObj.head.h + unit}; background-color: ${snakeObj.head.c};"></div>`;

    snakeObj.head.setPos(0, fieldSize / 2, fieldSize / 2);
}

initialize();