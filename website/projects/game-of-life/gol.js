
const canvas = document.querySelector('.game-of-life-canvas');
const context = canvas.getContext('2d');
const computedStyle = getComputedStyle(canvas);
const resolution = 5;

canvas.width = 200;
canvas.height = 200;

const columns = canvas.width / resolution;
const rows = canvas.height / resolution;

const fps = 30;
const frameInterval = 1000 / fps;
let lastTime = 0;

let dragging = false;

const aliveColour = computedStyle.accentColor;
const deadColour = computedStyle.backgroundColor;

let grid = build();
requestAnimationFrame(update);

function build() {
    const grid = new Uint8Array(columns * rows);

    randomise(grid);

    return grid;
}

function randomise(grid) {
    for (let i = 0; i < grid.length; i++) {
        grid[i] = Math.floor(Math.random() * 2);
    }
}

function update(timestamp) {
    if (timestamp - lastTime >= frameInterval) {
        lastTime = timestamp;
        const next = calculate(grid);
        grid = next;
        render(grid);
    }
    requestAnimationFrame(update);
}

function calculate(grid) {
    const next = new Uint8Array(grid.length);
    for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
            const cell = grid[column + row * columns];
            let total = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    const neighbourColumn = column + i;
                    const neighbourRow = row + j;
                    if (neighbourColumn >= 0 && neighbourColumn < columns &&
                        neighbourRow >= 0 && neighbourRow < rows) {
                        total += grid[neighbourColumn + neighbourRow * columns];
                    }
                }
            }
            if (cell === 1 && (total < 2 || total > 3)) {
                next[column + row * columns] = 0;
            } else if (cell === 0 && total === 3) {
                next[column + row * columns] = 1;
            } else {
                next[column + row * columns] = cell;
            }
        }
    }
    return next;
}

function render(grid) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let column = 0; column < columns; column++) {
        for (let row = 0; row < rows; row++) {
            const cell = grid[column + row * columns];
            context.fillStyle = cell ? aliveColour : deadColour;
            context.fillRect(column * resolution, row * resolution, resolution, resolution);
        }
    }
}

canvas.addEventListener('mousedown', (event) => {
    dragging = true;
    updateCell(event);
});

canvas.addEventListener('mouseup', () => {
    dragging = false;
});

canvas.addEventListener('mousemove', throttle((event) => {
    if (dragging) {
        updateCell(event);
    }
}, 5));

function updateCell(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const column = Math.floor(x / resolution);
    const row = Math.floor(y / resolution);

    if (column >= 0 && column < columns && row >= 0 && row < rows) {
        grid[column + row * columns] = 1;
        render(grid);
    }
}

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}
