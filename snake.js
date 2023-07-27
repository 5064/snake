class Game {
    BOX_SIDE = 600;
    TOTAL_CELL = 12;
    CELL_SIDE = this.BOX_SIDE / this.TOTAL_CELL;
    P = 1;  // padding between cell (px) 
    FPS = 6; // frame per second
    intervalId = 0;

    score = 0;

    SNAKE_COLOR = "steelblue"
    FOOD_COLOR = "deeppink"
    FOOD_OUTLINE_COLOR = "maroon"
    FOOD_HIGHLIGHT_COLOR = "hotpink"

    INITIAL_LENGTH = 4;  // initial length of snake

    food = { x: 0, y: 0 }
    snakeXY = []
    dir = { x: 1, y: 0, theta: 0 }
    canChangeDir = true;

    ctx = document.getElementById('game').getContext("2d");
    bgCtx = document.getElementById('background').getContext("2d");
    ofCtx = document.getElementById('outer-frame').getContext("2d");

    constructor() {
        this.controller = event => {
            switch (event.key) {
                // WASD change direction
                case "w":
                    this.changeDir({ x: 0, y: -1, theta: 3 * Math.PI / 2 })
                    break;
                case "a":
                    this.changeDir({ x: -1, y: 0, theta: Math.PI })
                    break;
                case "s":
                    this.changeDir({ x: 0, y: 1, theta: Math.PI / 2 })
                    break;
                case "d":
                    this.changeDir({ x: 1, y: 0, theta: 0 })
                    break;
                // Restart game
                case "r":
                    this.main();
                    break;

                default:
                    break;
            }
        }
        document.addEventListener("keydown", this.controller, false);
        this.setup = () => {
            // this.renderOuterFrame();
            this.renderBackGround();

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
            this.snakeXY = [];
            for (let i = 0; i < this.INITIAL_LENGTH; i++) {
                this.snakeXY.push({ x: headX - (this.dir["x"] * i), y: headY - (this.dir["y"] * i) })
            }
            this.renderSnake()
        }

        this.shuffleFoodXY = () => {
            do {
                this.food["x"] = getRandomIntArbitrary(0, this.TOTAL_CELL);
                this.food["y"] = getRandomIntArbitrary(0, this.TOTAL_CELL);
            } while (this.snakeX().includes(this.food["x"]) && this.snakeY().includes(this.food["y"]));
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
            this.ctx.beginPath()
            this.ctx.arc(this.food["x"] * this.CELL_SIDE + (this.CELL_SIDE / 2), this.food["y"] * this.CELL_SIDE + (this.CELL_SIDE / 2), this.CELL_SIDE / 3, 0, 2 * Math.PI);
            this.ctx.fill()
            // outline
            this.ctx.beginPath()
            this.ctx.strokeStyle = this.FOOD_OUTLINE_COLOR
            this.ctx.arc(this.food["x"] * this.CELL_SIDE + (this.CELL_SIDE / 2), this.food["y"] * this.CELL_SIDE + (this.CELL_SIDE / 2), this.CELL_SIDE / 3, 0, 2 * Math.PI);
            this.ctx.stroke()
            this.ctx.closePath()
            // highlight
            this.ctx.beginPath()
            this.ctx.fillStyle = this.FOOD_HIGHLIGHT_COLOR
            this.ctx.arc(this.food["x"] * this.CELL_SIDE + (2 * this.CELL_SIDE / 5), this.food["y"] * this.CELL_SIDE + (2 * this.CELL_SIDE / 5), this.CELL_SIDE / 10, 0, 2 * Math.PI);
            this.ctx.fill()
        }

        this.renderSnake = () => {
            let is1st = true
            for (let snake of this.snakeXY) {
                if (is1st) {
                    // render head
                    this.renderHead(snake)
                    is1st = false
                } else {
                    // render body
                    this.ctx.fillStyle = this.SNAKE_COLOR;
                    this.ctx.fillRect(snake["x"] * this.CELL_SIDE + this.P, snake["y"] * this.CELL_SIDE + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
                }
            }
        }
        this.renderHead = (head) => {
            this.ctx.fillStyle = this.SNAKE_COLOR;
            this.ctx.fillRect(head["x"] * this.CELL_SIDE + this.P, head["y"] * this.CELL_SIDE + this.P, this.CELL_SIDE - this.P * 2, this.CELL_SIDE - this.P * 2);
            // eye
            this.renderEyes()
        }

        this.renderEyes = () => {
            let leftEye = { x: (-1 / 4), y: (-1 / 4) }
            leftEye = rotatePoint(leftEye.x, leftEye.y, this.dir.theta)
            this.ctx.beginPath()
            this.ctx.fillStyle = "white"
            this.ctx.arc((leftEye["x"] + (1 / 2) + this.headX()) * this.CELL_SIDE, (leftEye["y"] + (1 / 2) + this.headY()) * this.CELL_SIDE, this.CELL_SIDE / 6, 0, 2 * Math.PI);
            this.ctx.fill()
            this.ctx.beginPath()
            this.ctx.fillStyle = "black"
            this.ctx.arc((leftEye["x"] + (1 / 2) + this.headX()) * this.CELL_SIDE, (leftEye["y"] + (1 / 2) + this.headY()) * this.CELL_SIDE, this.CELL_SIDE / 10, 0, 2 * Math.PI);
            this.ctx.fill()

            let rightEye = { x: (-1 / 4), y: 1 / 4 }
            rightEye = rotatePoint(rightEye.x, rightEye.y, this.dir.theta)
            this.ctx.beginPath()
            this.ctx.fillStyle = "white"
            this.ctx.arc((rightEye["x"] + (1 / 2) + this.headX()) * this.CELL_SIDE, (rightEye["y"] + (1 / 2) + this.headY()) * this.CELL_SIDE, this.CELL_SIDE / 6, 0, 2 * Math.PI);
            this.ctx.fill()
            this.ctx.beginPath()
            this.ctx.fillStyle = "black"
            this.ctx.arc((rightEye["x"] + (1 / 2) + this.headX()) * this.CELL_SIDE, (rightEye["y"] + (1 / 2) + this.headY()) * this.CELL_SIDE, this.CELL_SIDE / 10, 0, 2 * Math.PI);
            this.ctx.fill()
        }

        this.isGameOver = () => {
            if (this.collisionWall() || this.collisionSelf()) {
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

        this.collisionSelf = () => {
            for (let i = 1; i < this.snakeXY.length; i++) {
                if (this.snakeXY[i]["x"] === this.headX() && this.snakeXY[i]["y"] === this.headY()) {
                    return true
                }
            }
            return false;
        }

        this.eat = () => {
            this.snakeXY.push({ x: this.snakeX[this.snakeXY.length - 1], y: this.snakeY[this.snakeXY.length - 1] }); // おしりが伸びます
            this.incrementScore()
            this.shuffleFoodXY();
        }

        this.move = () => {
            this.snakeXY.unshift({ x: this.headX() + this.dir["x"], y: this.headY() + this.dir["y"] });
            this.snakeXY.pop()
        }

        this.step = () => {
            this.ctx.clearRect(0, 0, this.BOX_SIDE, this.BOX_SIDE)

            this.move();
            this.canChangeDir = true;
            if (this.isGameOver()) {
                clearInterval(this.intervalId);
                return;
            }
            if (this.headX() === this.food["x"] && this.headY() === this.food["y"]) {
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
            if (!this.canChangeDir) {
                return;
            }
            if (this.dir["x"] * -1 === target["x"] && this.dir["y"] * -1 === target["y"]) {
                // 正反対には方向転換できない
                return;
            }
            this.dir = target
            this.canChangeDir = false;
        }

        this.main = () => {
            game.setup();
            clearInterval(this.intervalId);
            this.intervalId = window.setInterval(this.step, 1000 / this.FPS)
        }
    }
}

const getRandomIntArbitrary = (min, max) => {
    return Math.floor(Math.random() * Math.floor(max - min) + min);
}

const rotatePoint = (x, y, theta) => {
    return { x: x * Math.cos(theta) - y * Math.sin(theta), y: x * Math.sin(theta) + y * Math.cos(theta) }
}

const game = new Game();
game.main();