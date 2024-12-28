const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(`Erro ao carregar a imagem: ${src}`);
    };
  });
}


let scorpionImage, subzeroImage, backgroundImage;
let scorpionX = 100, scorpionY = 250, scorpionHealth = 100;
let subzeroX = 600, subzeroY = 250, subzeroHealth = 100;
let scorpionSpeed = 5, subzeroSpeed = 5;
let scorpionJumping = false, subzeroJumping = false;
let scorpionVelocityY = 0, subzeroVelocityY = 0;
let gravity = 1, jumpPower = -15;


function drawHealthBar(x, y, health) {
  const barWidth = 200;
  const barHeight = 20;
  const healthWidth = (health / 100) * barWidth;

  
  ctx.fillStyle = "gray";
  ctx.fillRect(x, y, barWidth, barHeight);

  
  ctx.fillStyle = "green";
  ctx.fillRect(x, y, healthWidth, barHeight);
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); 

 
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  drawHealthBar(50, 30, scorpionHealth); 
  drawHealthBar(canvas.width - 250, 30, subzeroHealth);


  ctx.drawImage(scorpionImage, scorpionX, scorpionY, 400, 800);
  ctx.drawImage(subzeroImage, subzeroX, subzeroY, 400, 700);
}


async function loadAssets() {
  try {
    backgroundImage = await loadImage("background.png");
    scorpionImage = await loadImage("scorpion.png");
    subzeroImage = await loadImage("subzero.png");
    draw();
  } catch (error) {
    console.error(error);
  }
}


function updatePhysics() {

  if (scorpionY + 100 < canvas.height && scorpionJumping) {
    scorpionVelocityY += gravity;
  } else {
    scorpionJumping = false;
    scorpionVelocityY = 0;
    scorpionY = canvas.height - 800;
  }

  if (subzeroY + 100 < canvas.height && subzeroJumping) {
    subzeroVelocityY += gravity;
  } else {
    subzeroJumping = false;
    subzeroVelocityY = 0;
    subzeroY = canvas.height - 700; 
  }

  scorpionY += scorpionVelocityY;
  subzeroY += subzeroVelocityY;

  draw();
}


window.addEventListener("keydown", (event) => {
  if (event.key === "a") {
    scorpionX -= scorpionSpeed;
  }
  if (event.key === "d") {
    scorpionX += scorpionSpeed;
  }

  if (event.key === "ArrowLeft") {
    subzeroX -= subzeroSpeed;
  }
  if (event.key === "ArrowRight") {
    subzeroX += subzeroSpeed;
  }

  if (event.key === "w" && !scorpionJumping) {
    scorpionVelocityY = jumpPower;
    scorpionJumping = true;
  }

  if (event.key === "ArrowUp" && !subzeroJumping) {
    subzeroVelocityY = jumpPower;
    subzeroJumping = true;
  }
});

loadAssets();

setInterval(updatePhysics, 1000 / 60);
