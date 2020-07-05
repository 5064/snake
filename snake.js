class Game {
    BOX_SIDE = 400;
    TOTAL_CELL = 14;
    CELL_SIDE = this.BOX_SIDE / this.TOTAL_CELL;
    P = 1;  // padding px
    FPS = 5; // frame per second

    score = 0;

    SNAKE_COLOR = "steelblue"
    FOOD_COLOR = "deeppink"
    INITIAL_LENGTH = 4;  // initial length of snake

    foodX = 0;
    foodY = 0;
    snakeXY = []
    dir = { x: 1, y: 0 }

    ctx = document.getElementById('game').getContext("2d");
    bgCtx = document.getElementById('background').getContext("2d");
    ofCtx = document.getElementById('outer-frame').getContext("2d");

    constructor() {
        this.setup = () => {
            document.addEventListener("keydown", this.controller, false);

            this.renderBackGround();
            // this.renderOuterFrame();

            this.initializeSnake();

            this.shuffleFoodXY();
            this.renderFood()
        }

        this.renderBackGround = () => {
            for (let i = 0; i < this.TOTAL_CELL; i++) {
                for (let j = 0; j < this.TOTAL_CELL; j++) {
                    this.bgCtx.fillStyle = (i + j) % 2 !== 0 ? "#c1ff8a" : "#d1ff9c";
                    this.bgCtx.fillRect(i * this.CELL_SIDE, j * this.CELL_SIDE, this.CELL_SIDE, this.CELL_SIDE);
                }
            }
        }

        this.renderOuterFrame = () => {
            this.ofCtx.fillStyle = "black"
            this.ofCtx.fillRect(0, 0, this.BOX_SIDE + 40, this.BOX_SIDE + 40);
        }

        this.initializeSnake = () => {
            // start center of the box
            const headX = this.TOTAL_CELL / 2 | 0;
            const headY = this.TOTAL_CELL / 2 | 0;
            this.ctx.fillStyle = this.SNAKE_COLOR;
            for (let i = 0; i < this.INITIAL_LENGTH; i++) {
                this.ctx.fillRect(((headX - (this.dir["x"] * i)) * this.CELL_SIDE) + this.P, ((headY - (this.dir["y"] * i)) * this.CELL_SIDE) + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
                this.snakeXY.push({ x: headX - (this.dir["x"] * i), y: headY - (this.dir["y"] * i) })
            }
        }

        this.shuffleFoodXY = () => {
            do {
                this.foodX = getRandomIntArbitrary(0, this.TOTAL_CELL);
                this.foodY = getRandomIntArbitrary(0, this.TOTAL_CELL);
            } while (this.snakeX().includes(this.foodX) && this.snakeY().includes(this.foodY));
        }

        this.headX = () => {
            return this.snakeXY[0]["x"];
        }
        this.headY = () => {
            return this.snakeXY[0]["y"];
        }

        this.snakeX = () => {
            return this.snakeXY.map(xy =>
                xy["x"]
            );
        }
        this.snakeY = () => {
            return this.snakeXY.map(xy =>
                xy["y"]
            );
        }

        this.renderFood = () => {
            this.ctx.fillStyle = this.FOOD_COLOR;
            this.ctx.fillRect(this.foodX * this.CELL_SIDE + this.P, this.foodY * this.CELL_SIDE + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
        }

        this.renderSnake = () => {
            this.ctx.fillStyle = this.SNAKE_COLOR;
            for (let snake of this.snakeXY) {
                this.ctx.fillRect(snake["x"] * this.CELL_SIDE + this.P, snake["y"] * this.CELL_SIDE + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
            }
        }

        this.isGameover = () => {
            if (this.collisionWall() || this.collisionYourself()) {
                return true;
            }
            return false;
        }

        this.collisionWall = () => {
            if (this.headX() < 0 || this.headY() < 0 || this.TOTAL_CELL - 1 < this.headX() || this.TOTAL_CELL - 1 < this.headY()) {
                return true;
            }
            return false;
        }

        this.collisionYourself = () => {
            const bodyX = this.snakeX();
            const bodyY = this.snakeY();
            bodyX.splice(0, 1);
            bodyY.splice(0, 1);
            if (bodyX.includes(this.headX()) && bodyY.includes(this.headY())) {
                return true;
            }
            return false;
        }

        this.eat = () => {
            this.ctx.clearRect(this.foodX + this.P, this.foodY + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
            this.snakeXY.push({ x: this.foodX, y: this.foodY });
            this.incrementScore()
            this.shuffleFoodXY();
        }

        this.main = () => {
            game.setup();
            this.intevalId = window.setInterval(this.step, 1000 / this.FPS)
        }



        this.move = () => {
            this.snakeXY.unshift({ x: this.headX() + this.dir["x"], y: this.headY() + this.dir["y"] });
            this.snakeXY.pop()
        }

        this.step = () => {
            this.ctx.clearRect(0, 0, this.BOX_SIDE, this.BOX_SIDE)

            this.move();
            if (this.isGameover()) {
                clearInterval(this.intevalId);
                return;
            }
            if (this.headX() === this.foodX && this.headY() === this.foodY) {
                this.eat();
            }
            this.renderFood();
            this.renderSnake();
        }

        this.incrementScore = () => {
            this.score += 1
            document.getElementById("score").textContent = this.score;
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
game.main();
