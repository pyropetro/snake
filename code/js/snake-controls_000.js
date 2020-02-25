const segmentSize = 20;
const fieldSize = 800
const interval = 10;
const distance = 2;
let unit = "px";
let head = document.getElementById('head');
let field = document.getElementById('field');
let timer = setInterval(move, interval);
let direction = "";


function Segment(x, y) {
	this.w = segmentSize;
	this.h = w;
	this.x = x;
	this.y = y;
}

function setSize(element, w, h = w) {
    element.style.width = w + unit;
    element.style.height = h + unit;
}

function setPos(element, x, y) {
    element.style.left = x + unit;
    element.style.top = y + unit;
}

function changeDirection(event) {

    console.log("changing direction");

    switch (event.key) {
        case "ArrowLeft":
            direction = "left";
            break;
        case "ArrowRight":
            direction = "right";
            break;
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
        default:
            break;
    }
}

function move() {
    console.log("moving");

    let x = parseInt(head.style.left);
    let y = parseInt(head.style.top);


    switch (direction) {
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


    if (x < 0 ||
    	y < 0 || 
    	x > fieldSize - segmentSize ||
    	y > fieldSize - segmentSize) {
        die();
    }
    else {
        setPos(head, x, y);
    }
}

function die() {
    clearInterval(timer);
}

function isTouching(thing1, thing2) {
	let rect1 = thing1.getBoundingClientRect();
	let rect2 = thing2.getBoundingClientRect();

    if (rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom) {
    	return true;
    }
    else { 
    	return false; 
    }
}

function initialize() {
    setSize(field, fieldSize);
    setSize(head, segmentSize);
    setPos(head, fieldSize / 2, fieldSize / 2);

    window.addEventListener('keydown', changeDirection);
}

initialize();