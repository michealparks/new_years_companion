let SCREEN_WIDTH = window.innerWidth
let SCREEN_HEIGHT = window.innerHeight

    // create canvas
const canvas = document.createElement('canvas')
canvas.id = 'fireworks-canvas'

const context = canvas.getContext('2d')
const particles = []
const rockets = []
const MAX_PARTICLES = 400

// init
const init = () => {
  document.body.appendChild(canvas);
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  for (var i = 0; i < 5; i++) {
    launchFrom(Math.random() * SCREEN_WIDTH * 2 / 3 + SCREEN_WIDTH / 6);
  }
  setInterval(launch, 400);

  window.requestAnimationFrame(loop)
}

function launch() {
  launchFrom(Math.random() * SCREEN_WIDTH * 2 / 3 + SCREEN_WIDTH / 6);
}

export const fireworks = {
  init,
  launch
}

function launchFrom(x) {
  var rocket = new Rocket(x);
  rocket.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;
  rocket.vel.y = Math.random() * -3 - 4;
  rocket.vel.x = Math.random() * 6 - 3;
  rocket.size = 8;
  rocket.shrink = 0.999;
  rocket.gravity = 0.01;
  rockets.push(rocket);
}

function loop() {
  window.requestAnimationFrame(loop)

  // update screen size
  if (SCREEN_WIDTH != window.innerWidth) {
    canvas.width = SCREEN_WIDTH = window.innerWidth
  }
  if (SCREEN_HEIGHT != window.innerHeight) {
    canvas.height = SCREEN_HEIGHT = window.innerHeight
  }

  // clear canvas
  context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

  for (var i = 0; i < rockets.length; i++) {
    // update and render
    rockets[i].update()
    rockets[i].render(context)

    // random chance of 1% if rockets is above the middle
    const randomChance = rockets[i].pos.y < (SCREEN_HEIGHT * 2 / 3)
      ? (Math.random() * 100 <= 1)
      : false

    /* Explosion rules
      - 80% of screen
      - going down
      - 1% chance of random explosion
    */
    if (rockets[i].pos.y < SCREEN_HEIGHT / 5 || rockets[i].vel.y >= 0 || randomChance) {
      rockets[i].explode()
      rockets.splice(i, 1)
    }
  }

  for (var i = 0; i < particles.length; i++) {
    particles[i].update();

    // render and save particles that can be rendered
    if (particles[i].exists()) {
      particles[i].render(context)
    } else {
      particles.splice(i, 1)
    }
  }

  while (particles.length > MAX_PARTICLES) {
    particles.shift();
  }
}

function Particle(pos) {
  this.pos = {
      x: pos ? pos.x : 0,
      y: pos ? pos.y : 0
  };
  this.vel = {
      x: 0,
      y: 0
  };
  this.shrink = .97;
  this.size = 4;

  this.resistance = 1;
  this.gravity = 0;

  this.flick = false;

  this.alpha = 1;
  this.fade = 0;
  this.color = 0;
}

Particle.prototype.update = function() {
  // apply resistance
  this.vel.x *= this.resistance;
  this.vel.y *= this.resistance;

  // gravity down
  this.vel.y += this.gravity;

  // update position based on speed
  this.pos.x += this.vel.x;
  this.pos.y += this.vel.y;

  // shrink
  this.size *= this.shrink;

  // fade out
  this.alpha -= this.fade;
};

Particle.prototype.render = function(c) {
  if (!this.exists()) {
    return;
  }

  c.save();

  c.globalCompositeOperation = 'lighter';

  var x = this.pos.x,
      y = this.pos.y,
      r = this.size / 2;

  var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
  gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
  gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
  gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

  c.fillStyle = gradient;

  c.beginPath();
  c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size : this.size, 0, Math.PI * 2, true);
  c.closePath();
  c.fill();

  c.restore();
};

Particle.prototype.exists = function() {
  return this.alpha >= 0.1 && this.size >= 1;
};

function Rocket(x) {
  Particle.apply(this, [{
    x: x,
    y: SCREEN_HEIGHT}]);

  this.explosionColor = 0;
}

Rocket.prototype = new Particle();
Rocket.prototype.constructor = Rocket;

Rocket.prototype.explode = function() {
  var count = Math.random() * 10 + 80;

  for (var i = 0; i < count; i++) {
    var particle = new Particle(this.pos);
    var angle = Math.random() * Math.PI * 2;

    // emulate 3D effect by using cosine and put more particles in the middle
    var speed = Math.cos(Math.random() * Math.PI / 2) * 15;

    particle.vel.x = Math.cos(angle) * speed;
    particle.vel.y = Math.sin(angle) * speed;

    particle.size = 14;

    particle.gravity = 0.2;
    particle.resistance = 0.92;
    particle.shrink = Math.random() * 0.05 + 0.93;

    particle.flick = true;
    particle.color = this.explosionColor;

    particles.push(particle);
  }
};

Rocket.prototype.render = function(c) {
  return
  if (!this.exists()) {
    return;
  }

  c.save();

  c.globalCompositeOperation = 'lighter';

  var x = this.pos.x,
      y = this.pos.y,
      r = this.size / 2;

  var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
  gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
  gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

  c.fillStyle = gradient;

  c.beginPath();
  c.arc(this.pos.x, this.pos.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
  c.closePath();
  c.fill();

  c.restore();
};