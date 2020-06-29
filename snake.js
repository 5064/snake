const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const CANVAS_SIDE = 400;
const CELL_SIDE = CANVAS_SIDE / 10

ctx.fillStyle = 'black';
ctx.fillRect(10, 10, CANVAS_SIDE, CANVAS_SIDE);

ctx.fillStyle = 'green';
ctx.fillRect(10, 10, CELL_SIDE, CELL_SIDE)

