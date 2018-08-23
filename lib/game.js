import Cannon from './cannon.js'
import Cannonball from './cannonball.js';
import Particle from './particle.js';
import Circle from './circle.js';
import Explosion from './explosion.js';
import Sound from './sound.js'

const canvas = document.getElementById("canvas");
const c = canvas.getContext('2d');

let mouse = {
  x: undefined,
  y: undefined
}

function getDistance(x1, y1, x2, y2) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

canvas.addEventListener("touchmove", function(event) {
  event.preventDefault();
  mouse.x = event.touches[0].pageX;
  mouse.y = event.touches[0].pageY;
});

let pressed = false;
window.addEventListener('keydown', (e) => {
  if (e.keyCode === 32) {
    pressed = true;
  }
})

canvas.addEventListener("touchend", function() {
  pressed = false;
});

window.addEventListener('mousedown', (e) => {
  let rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

const gravity = 0.08;
let desiredAngle = 0;
let cannon, cannonballs, explosions, colors, circle, cannonSound;

function initializeVariables() {
  cannon = new Cannon(canvas.width / 2, canvas.height, 40, 20, 'white');

  cannonballs = [];
  explosions = [];
  colors = {
      cannonballColor: [
        "#CEC721",
        "#D88A25",
        "#C12929",
        "#7A1FD8",
        "#2781CE"
      ],
      particleColors: [
        "#CEC721",
        "#D88A25",
        "#C12929",
        "#7A1FD8",
        "#2781CE"
      ]
    }

  circle = new Circle(10, 10, 5, "#CEC721")
  // cannonSound = new Sound('cannon.mp3')
  // console.log(cannonSound);
}

initializeVariables();

let timer = 0;

function animate() {
  const animation = window.requestAnimationFrame(animate);
  c.fillStyle = "rgba(18, 18, 18, 0.2)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  cannon.update();

  for (let i = 0; i < cannonballs.length; i++) {
    cannonballs[i].update();


    if (cannonballs[i].timeToLive <= 0) {
      explosions.push(new Explosion(cannonballs[i]));
      cannonballs.splice(i, 1);
    }
  }

  for (var j = 0; j < explosions.length; j++) {
    explosions[j].upate();
    let particle = explosions[j].particles[0] || new Particle();
    let x1 = particle.x || 0
    let y1 = particle.y || 0

    if (getDistance(x1, y1, mouse.x, mouse.y) < 10) {
      particle.timeToLive = 0
      let randomParticleColorIndex = Math.floor(Math.random() * colors.length);
      let randomColors = colors;
      let randomCannonballColor = colors.cannonballColor[Math.floor(Math.random() * 5)]
      cannonballs.push(new Cannonball(mouse.x, mouse.y, 2, 2, 10, randomCannonballColor, cannon, randomColors.particleColors[randomParticleColorIndex]));
    } else {
      pressed = false;
    }
  }

  if (pressed === true) {
    let randomParticleColorIndex = Math.floor(Math.random() * colors.length);
    let randomColors = colors;
    let randomCannonballColor = colors.cannonballColor[Math.floor(Math.random() * 5)]
    cannonballs.push(new Cannonball(mouse.x, mouse.y, 2, 2, 10, randomCannonballColor, cannon, randomColors.particleColors[randomParticleColorIndex]));
    pressed = false;
  }

}

animate();