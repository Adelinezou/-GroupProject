const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;
canvas.width = 500 * dpr;  // Set the actual canvas size in pixels
canvas.height = 500 * dpr; // Set the actual canvas size in pixels
ctx.scale(dpr, dpr);

function drawCircle(x, y, radius, color) {
    ctx.beginPath(); 
    ctx.arc(x, y, radius, 0, 2 * Math.PI); 
    ctx.fillStyle = color; 
    ctx.fill();
}

function drawButtons() {
    drawCircle(250, 400, 5, "#000000");
    drawCircle(250, 350, 5, "#000000");
    drawCircle(250, 300, 5, "#000000");
}

function drawEyes() {
    drawCircle(225, 180, 5, "#000000");
    drawCircle(275, 180, 5, "#000000");
}


function drawImg(img, x, y, width, height) {
    img.onload = function() {
        ctx.drawImage(img, x, y, width, height);
    }
    if (img.complete) {
        img.onload();
    }
}

function drawArms() {
    let arm1 = document.getElementById('arm1');
    let arm2 = document.getElementById('arm2');
    drawImg(arm1, 15, 200, 175, 100);
    drawImg(arm2, 310, 200, 175, 100);
}

function drawAll() {
    const hatImg = document.getElementById('hatImg');
    const noseImg = document.getElementById('noseImg');
    const scarfImg = document.getElementById('scarfImg');
    const mouthImg = document.getElementById('mouthImg');

    document.getElementById('hat').addEventListener('click', () => drawImg(hatImg, 230, 65, 110, 110));
    document.getElementById('nose').addEventListener('click', () => drawImg(noseImg, 200, 155, 110, 90));
    document.getElementById('scarf').addEventListener('click', () => drawImg(scarfImg, 155, 220, 195, 150));
    document.getElementById('mouth').addEventListener('click', () => drawImg(mouthImg, 220, 200, 60, 50));
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    drawCircle(250, 435, 115, "#ffffff");
    drawCircle(250, 310, 90, "#ffffff");
    drawCircle(250, 200, 70, "#ffffff");
}

document.getElementById("buttons").addEventListener("click", drawButtons);
document.getElementById("eyes").addEventListener("click", drawEyes);
document.getElementById("arms").addEventListener("click", drawArms);
document.getElementById("resetButton").addEventListener("click", resetCanvas);

resetCanvas(); // Draw initial circles on load
drawAll();