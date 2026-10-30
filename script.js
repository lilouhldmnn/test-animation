let canvas = document.getElementById('scene');
canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;

let ctx = canvas.getContext("2d");

let shapes = [];

// boucle pour créer 100 formes
for (let i = 0; i < 100; i++) {
  
  // taille entre 10 et 80 pixels
  let size = Math.random() * 80 + 10; 

  let color;
  let colorRand = Math.random();

  if (colorRand < 0.33) {
    color = "rgba(0, 166, 255, 0.52)";
  } else if (colorRand < 0.66) {
    color = "rgba(255, 0, 0, 0.45)";
  } else {
    color = "rgba(255, 255, 255, 0.67)";
  }

  let vx = (Math.random() - 0.5) * 3; 
  let vy = (Math.random() - 0.5) * 3;

  let maxSpeed = Math.sqrt(vx * vx + vy * vy);

  let shape = {
    x: Math.random() * canvas.width,   
    y: Math.random() * canvas.height,  
    vx: vx,                      
    vy: vy,                      
    maxSpeed: maxSpeed,
    size: size,                    
    color: color              
  };

  shapes.push(shape);
}

let isMouseDown = false;
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  updateMousePos(e);
});

canvas.addEventListener('mouseup', () => {
  isMouseDown = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    updateMousePos(e);
  }
});

window.addEventListener('mouseup', () => {
  isMouseDown = false;
});

function updateMousePos(e) {
  let rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
}

function drawShapes() {
  let magnetRadius = 250; // Rayon d'action de l'aimant

  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i]; 

    if (isMouseDown) {
      let dx = mouseX - s.x;
      let dy = mouseY - s.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < magnetRadius && distance > 0) {
        s.vx += (dx / distance) * 0.2;
        s.vy += (dy / distance) * 0.2;

        let currentSpeed = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
        if (currentSpeed > s.maxSpeed) {
          s.vx = (s.vx / currentSpeed) * s.maxSpeed;
          s.vy = (s.vy / currentSpeed) * s.maxSpeed;
        }
      }
    }

    if (s.x < 0 || s.x > canvas.width) {
      s.vx *= -1; 
    }
    s.x += s.vx; 

    if (s.y < 0 || s.y > canvas.height) {
      s.vy *= -1; 
    }
    s.y += s.vy; 

    ctx.fillStyle = s.color;

    ctx.beginPath();
    
    let sides = 5; 
    let radius = s.size / 2;

    for (let c = 0; c < sides; c++) {
      let angle = (c * 2 * Math.PI) / sides;
      let px = s.x + Math.cos(angle) * radius;
      let py = s.y + Math.sin(angle) * radius;

      if (c === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    
    ctx.closePath();
    ctx.fill();
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawShapes();

  window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);
