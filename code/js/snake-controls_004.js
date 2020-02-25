//  Globals
let unit = "px";
let field = null;
let snake = null;
let moveTimer = null;
let newSegment = null;
let score = 0;
const pointsPerSegment = 10;

// Field class
class Field {
    constructor() {
        this.size = 800;
        this.fieldVis = document.getElementById('field');
        console.log(`creating field obj of size ${this.size + unit}`);
    }

    draw() {
        console.log('drawing field');
        this.fieldVis.style.width = this.size + unit;
        this.fieldVis.style.height = this.size + unit;
    }
}


// Segment class
class Segment {
    constructor(x = 0, y = x, id = '', color = '#fff') {
        this.size = 20;
        this.x = x;
        this.y = y;
        this.id = id;
        this.color = color;
    }

    draw(canvas) {
        console.log('drawing segment on ' + canvas);
        let htmlString = `class="segment" style="width: ${this.size + unit}; height: ${this.size + unit}; background-color: ${this.color}; left: ${this.x + unit}; top: ${this.y + unit};"`;

        if (this.id != '') {
            console.log('id: ' + this.id);
            canvas.innerHTML += `<div id="${this.id}" ${htmlString} ></div>`;
        } else {
            canvas.innerHTML += `<div ${htmlString} ></div>`;
        }

    }

    move() {

    }
}


//Head class, extends Segemnt - detect when it bumps into wall, Segment on the field, or Segment in Snake's tail
class Head extends Segment {
    constructor(x, y = x) {
        super(x, y, 'head', '#00ff00');
        console.log(this);
        this.track = [];
        this.trackMax = this.size;
    }


}

// Snake object - array of Segments, moves around on Field. First segment is a Head, which is added in the cosntructor
class Snake {
    constructor(x, y = x) {
        console.log(`creating snake at (${x}, ${y})`);
        this.segments = [new Head(x, y)];
        this.head = this.segments[0];
        this.snakeVis = null;
        this.moveDirection = "";
        this.moveInterval = 10;
        this.moveDistance = 2;
        //this.moveTimer = null;



    }

    draw(canvas) {
        console.log('drawing snake');
        for (let i = 0; i < this.segments.length; i++) {
            this.segments[i].draw(this.snakeVis);
        }
    }

    changeDirection(event) {
        console.log("changing direction");

        if (this.segments.length == 1) {
            switch (event.key) {
                case "ArrowLeft":
                    this.moveDirection = "left";
                    break;
                case "ArrowRight":
                    this.moveDirection = "right";
                    break;
                case "ArrowUp":
                    this.moveDirection = "up";
                    break;
                case "ArrowDown":
                    this.moveDirection = "down";
                    break;
                default:
                    break;
            }
        } else {
            if (event.key == 'ArrowLeft' && this.moveDirection != 'right') {
                this.moveDirection = 'left';
            } else if (event.key == 'ArrowRight' && this.moveDirection != 'left') {
                this.moveDirection = 'right';
            } else if (event.key == 'ArrowUp' && this.moveDirection != 'down') {
                this.moveDirection = 'up';
            } else if (event.key == 'ArrowDown' && this.moveDirection != 'up') {
                this.moveDirection = 'down';
            } else {
                return;
            }
        }


    }


    move() {
        //console.log('moving');
        let lastX = 0;
        let lastY = 0;
        let currentX = 0;
        let currentY = 0;

        //console.log('trackMax: ' + this.head.trackMax);
        //console.log('length: ' + this.segments.length);

        if (this.head.track.length >= this.head.trackMax ) {
                    this.head.track.pop();
                    console.log('popped');
                }

        for (let i = 0; i < this.segments.length; i++) {
            //console.log('moving segment ' + (i + 1));

            currentX = this.segments[i].x;
            currentY = this.segments[i].y;

            if (i == 0) {

                this.head.track.unshift([currentX, currentY]);

                switch (this.moveDirection) {
                    case "left":
                        this.segments[i].x -= this.moveDistance;
                        break;
                    case "right":
                        this.segments[i].x += this.moveDistance;
                        break;
                    case "up":
                        this.segments[i].y -= this.moveDistance;
                        break;
                    case "down":
                        this.segments[i].y += this.moveDistance;
                        break;
                    default:
                        break;
                }
            } else {
                // this.segments[i].x = lastX;
                // this.segments[i].y = lastY;

                let multiplier = this.head.size / this.moveDistance;
                let index = i * multiplier;

                this.segments[i].x = this.head.track[index][0];
                this.segments[i].y = this.head.track[index][1];
            }

            // lastX = currentX;
            // lastY = currentY;

            if (this.outOfBounds() || (i > 2 && this.isTouching(this.segments[i]))) {
                this.die();
                return;
            } else if (this.isTouching(newSegment)) {
                this.collect();
            } else {

                //console.log(`moving to (${this.segments[i].x}, ${this.segments[i].y})`);
                //console.log(this.snakeVis);
            }
            document.getElementById('snake').children[i].style.left = this.segments[i].x + unit;
            document.getElementById('snake').children[i].style.top = this.segments[i].y + unit;
        }

    }

    outOfBounds() {
        if (this.head.x < 0 ||
            this.head.x > field.size - this.head.size ||
            this.head.y < 0 ||
            this.head.y > field.size - this.head.size) {
            console.log('Out of bounds!');
            return true;
        } else {
            return false;
        }
    }

    isTouching(segment) {

        //console.log('is touching?');

        let headX = this.head.x;
        let headX1 = this.head.x + this.head.size;
        let headY = this.head.y;
        let headY1 = this.head.y + this.head.size;

        let segmentX = segment.x;
        let segmentX1 = segment.x + segment.size;
        let segmentY = segment.y;
        let segmentY1 = segment.y + segment.size;

        if ((headX >= segmentX && headX <= segmentX1 && headY >= segmentY && headY <= segmentY1) ||
            (headX >= segmentX && headX <= segmentX1 && headY1 >= segmentY && headY1 <= segmentY1) ||
            (headX1 >= segmentX && headX1 <= segmentX1 && headY1 >= segmentY && headY1 <= segmentY1) ||
            (headX1 >= segmentX && headX1 <= segmentX1 && headY >= segmentY && headY <= segmentY1)) {
            return true;
        } else {
            return false;
        }
    }

    collect() {
        console.log('collecting');
        let lastSegment = this.segments[this.segments.length - 1];

        switch (this.moveDirection) {
            case "left":
                newSegment.x = lastSegment.x + lastSegment.size;
                newSegment.y = lastSegment.y;
                break;
            case "right":
                newSegment.x = lastSegment.x - lastSegment.size;
                newSegment.y = lastSegment.y;
                break;
            case "up":
                newSegment.x = lastSegment.x;
                newSegment.y = lastSegment.y - lastSegment.size;
                break;
            case "down":
                newSegment.x = lastSegment.x;
                newSegment.y = lastSegment.y + lastSegment.size;
                break;
            default:
                break;
        }

        newSegment.id = '';
        this.segments.push(newSegment);

        newSegment.draw(document.getElementById('snake'));
        field.fieldVis.removeChild(document.getElementById('new-segment'));

        score += pointsPerSegment;
        document.getElementById('score-num').innerHTML = score;

        this.head.trackMax += this.head.size;
        console.log('track: ' + this.head.track);

        spawn();
    }

    die() {
        clearInterval(moveTimer);
        document.getElementById('game-over').style.display = 'block';
    }


}

function spawn() {
    //spawn new segment at random location on field
    newSegment = new Segment(Math.round(Math.random() * (field.size - 20)), Math.round(Math.random() * (field.size - 20)), 'new-segment');
    newSegment.draw(field.fieldVis);
}

function restart() {
    document.getElementById('game-over').style.display = 'none';

    score = 0;
    document.getElementById('score-num').innerHTML = score;

    field = null;
    snake = null;
    moveTimer = null;

    document.getElementById('snake').innerHTML = '';
    newSegment = null;
    document.getElementById('new-segment').remove();

    initialize();

}

// initiaize function - instantiates the Snake on the field
function initialize() {

    field = new Field();
    snake = new Snake(field.size / 2);

    field.draw();

    snake.snakeVis = document.getElementById('snake');
    snake.draw(snake.snakeVis);

    spawn();

    window.addEventListener('keydown', snake.changeDirection.bind(snake));
    moveTimer = setInterval(snake.move.bind(snake), snake.moveInterval); //snake has to be bound to the function call, otherwise it will think the function is being called from the window obj

}

initialize();