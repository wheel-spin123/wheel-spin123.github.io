let d = 0;
const names = [];
const colourName = [];

// Get the canvas element
const canvas = document.getElementById('wheel');
const colours = [
    '#FF0000', // Red
    '#FF7F00', // Orange
    '#FFFF00', // Yellow
    '#00FF00', // Green
    '#0000FF', // Blue
    '#4B0082', // Indigo
    '#8B00FF'  // Violet
];


// Get the 2D rendering context
const ctx = canvas.getContext('2d');
// Set wheel properties
const innerRadius = 25;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const outerRadius = 400;

// Set canvas size
canvas.width = 1600;
canvas.height = 800;

function drawWheel(start=0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let radianPerName = 2 * Math.PI / Math.max(1, names.length);
    let totRad = start;
    for (let i = 0; i < names.length; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, totRad, totRad + radianPerName);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = colourName[i];
        ctx.fill();
        if (names.length > 1) {
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        ctx.closePath();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(totRad + radianPerName / 2);
        ctx.fillStyle = '#000000';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(names[i], outerRadius / 2, 0);
        ctx.restore();


        totRad += radianPerName;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();

    // pointer
    ctx.beginPath();
    ctx.moveTo(centerX + outerRadius - 10, centerY);
    ctx.lineTo(centerX + outerRadius + 10, centerY + 25);
    ctx.lineTo(centerX + outerRadius + 10, centerY - 25);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
}


function addName() {
    const nameInput = document.getElementById('add-name');
    if (nameInput.value != '') {
        d = 0;
        names.push(nameInput.value);
        nameInput.value = '';
        colourName.push(colours[Math.floor(Math.random() * colours.length)])
    }
    console.log(names);
    drawWheel();
}

async function spin() {
    let v = 0;
    let a = 1;

    let state = true;
    while (state) {
        a -= 0.01;
        v += a * 0.1;
        console.log(v);
        d = (d + v * 0.1) % (2 * Math.PI);
        drawWheel(d);
        if (a < 0) {
            state = false;
        }
        await sleep(25);
    }

    d = 2 * Math.PI - Math.random() * ((2 * Math.PI) / names.length);

    v = 1/20 * (1 + Math.sqrt(1 + 4800 * Math.PI));
    while (v > 0) {
        console.log(v);
        v -= 0.1;
        d = (d + v) % (2 * Math.PI);
        drawWheel(d);
        await sleep(25);
    }

    await sleep(500);
    const winner = names[names.length - 1 - Math.floor(d / (2 * Math.PI / names.length))];
    openModal(winner);
}

// Add these functions to your index.js file

function openModal(winner) {
    const modal = document.querySelector('.fixed');
    document.getElementById('winner').innerHTML = winner + " is chosen";
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.querySelector('.fixed');
    modal.classList.add('hidden');
    names.shift();
}



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }