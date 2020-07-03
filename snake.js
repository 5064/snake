class Game {
    CANVAS_SIDE = 200;
    TOTAL_CELL = 20;
    CELL_SIDE = this.CANVAS_SIDE / this.TOTAL_CELL;
    P = 1;  // padding px
    FPS = 1; // frame per second

    SNAKE_COLOR = "purple"
    FOOD_COLOR = "yellow"
    TRAIL = 4;  // initial length of snake

    foodX = 0;
    foodY = 0;
    snakeXY = []

    dir = { x: 1, y: 0 }

    ctx = document.getElementById('game').getContext("2d");
    bgCtx = document.getElementById('background').getContext("2d");

    constructor() {
        this.setup = () => {
            this.bgCtx.fillStyle = 'black';
            this.bgCtx.fillRect(0, 0, this.CANVAS_SIDE, this.CANVAS_SIDE);

            this.renderFood();

            // render first snake
            this.ctx.fillStyle = this.SNAKE_COLOR;

            this.initializeSnake();
        }

        this.initializeSnake = () => {
            // start center of canvas
            const headX = this.TOTAL_CELL / 2 | 0;
            const headY = this.TOTAL_CELL / 2 | 0;
            for (let i = 0; i < this.TRAIL; i++) {
                this.ctx.fillRect(((headX - (this.dir["x"] * i)) * this.CELL_SIDE) + this.P, ((headY - (this.dir["y"] * i)) * this.CELL_SIDE) + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
                this.snakeXY.push({ x: headX - (this.dir["x"] * i), y: headY - (this.dir["y"] * i) })
            }
        }

        this.tailX = () => {
            return this.snakeXY[this.snakeXY.length - 1]["x"];
        }
        this.tailY = () => {
            return this.snakeXY[this.snakeXY.length - 1]["y"];
        }

        this.headX = () => {
            return this.snakeXY[0]["x"];
        }
        this.headY = () => {
            return this.snakeXY[0]["y"];
        }

        this.renderFood = () => {
            this.ctx.fillStyle = this.FOOD_COLOR;
            this.foodX = this.CELL_SIDE * getRandomIntArbitrary(0, this.TOTAL_CELL);
            this.foodY = this.CELL_SIDE * getRandomIntArbitrary(0, this.TOTAL_CELL);
            this.ctx.fillRect(this.foodX + this.P, this.foodY + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
        }

        this.eat = () => {
            this.ctx.clearRect(this.foodX + this.P, this.foodY + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
            this.snakeXY.unshift({ x: this.foodX, y: this.foodY });
            this.renderFood();
        }

        this.run = () => {
            window.setInterval(this.step, 1000 / this.FPS)
        }

        this.renderSnake = () => {
            this.ctx.fillStyle = this.SNAKE_COLOR;
            this.ctx.fillRect(this.headX() * this.CELL_SIDE + this.P, this.headY() * this.CELL_SIDE + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
            this.ctx.clearRect(this.tailX() * this.CELL_SIDE + this.P, this.tailY() * this.CELL_SIDE + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
        }

        this.move = () => {
            for (let i = 0; i < this.snakeXY.length - 1; i++) {
                if (i === 0) {
                    this.snakeXY[0] = { x: this.headX() + this.dir["x"], y: this.headY() + this.dir["y"] };
                    console.log(this.snakeXY[0])
                } else {
                    this.snakeXY[i + 1] = this.snakeXY[i];
                    console.log(this.snakeXY[i])
                }
            }
        }

        this.step = () => {
            this.move();
            if (this.headX() === this.foodX && this.headY() === this.foodY) {
                this.eat();
            }
            this.renderSnake();
        }

        this.changeDir = (target) => {
            if (this.dir["x"] * -1 === target["x"] && this.dir["y"] * -1 === target["y"]) {
                // 正反対には方向転換できない
                return;
            }
            this.dir = target
        }

        this.controller = event => {
            switch (event.key) {
                // Restart
                case "r":
                    this.run();
                    break;
                // WASD change direction
                case "w":
                    this.changeDir({ x: 0, y: -1 })
                    break;
                case "a":
                    this.changeDir({ x: -1, y: 0 })
                    break;
                case "s":
                    this.changeDir({ x: 0, y: 1 })
                    break;
                case "d":
                    this.changeDir({ x: 1, y: 0 })
                    break;

                default:
                    break;
            }
        }
    }
}

const getRandomIntArbitrary = (min, max) => {
    return Math.floor(Math.random() * Math.floor(max - min) + min);
}

const game = new Game();
document.addEventListener("keydown", game.controller, false);
game.setup();
game.run();
