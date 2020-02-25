//  Globals
let unit = "px";
let field = null;
let snake = null;
let moveTimer = null;

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
    constructor(x = 0, y = x, color = "#fff") {
        this.size = 20;
        this.color = color;
        this.x = x;
        this.y = y;
    }

    draw(canvas) {
        console.log('drawing segment on ' + canvas);
        canvas.innerHTML += `<div class="segment" style="width: ${this.size + unit}; height: ${this.size + unit}; background-color: ${this.color}; left: ${this.x + unit}; top: ${this.y + unit};"></div>`;
    }
}


//Head class, extends Segemnt - detect when it bumps into wall, Segment on the field, or Segment in Snake's tail
class Head extends Segment {
    constructor(x, y = x) {
        super(x, y, "#00ff00");
    }
}

// Snake object - array of Segments, moves around on Field. First segment is a Head, which is added in the cosntructor
class Snake {
    constructor(x, y = x) {
        console.log(`creating snake at (${x}, ${y})`);
        this.segments = [new Head(x, y), new Segment(x, y + 20)];
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
    }

    move() {
        console.log('moving');
        for (let i = 0; i < this.segments.length; i++) {
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

            if (this.head.x < 0 ||
                this.head.x > field.size - this.head.size ||
                this.head.y < 0 ||
                this.head.y > field.size - this.head.size ) {
                this.die();
            } else {
                this.snakeVis.children[i].style.left = this.segments[i].x + unit;
                this.snakeVis.children[i].style.top = this.segments[i].y + unit;
            }
        }

    }

    die() {
        clearInterval(moveTimer);
    }


}

// initiaize function - instantiates the Snake on the field
function initialize() {
    field = new Field();
    snake = new Snake(field.size / 2);

    field.draw();

    snake.snakeVis = document.getElementById('snake');
    snake.draw(snake.snakeVis);

    window.addEventListener('keydown', snake.changeDirection.bind(snake));
    moveTimer = setInterval(snake.move.bind(snake), snake.moveInterval);
    //snake has to be bound to the function call, otherwise it will think the function is being called from the window obj
}

initialize();