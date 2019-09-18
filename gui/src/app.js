window.addEventListener('load', () => {
  const screen = document.getElementById('screen');

  screen.addEventListener('wheel', event => {
    if (event.deltaY > 0) {
      zoomOut(view);
    }
    else {
      zoomIn(view);
    }
  });

  let panning = false, move = {x: 0, y: 0}, viewStart = {x: 0, y: 0};

  screen.addEventListener('mousedown', event => {
    panning = true;
    viewStart.x = view.x;
    viewStart.y = view.y;
    move.x = event.x;
    move.y = event.y;
  });

  screen.addEventListener('mouseup', event => {
    panning = false;
  });

  screen.addEventListener('mousemove', event => {
    if (panning) {
      view.x = viewStart.x + move.x - event.x;
      view.y = viewStart.y + move.y - event.y;
    }
  });

  document.addEventListener('keydown', event => {
    console.log(event);
    if (event.keyCode === 37) {
      // left
      player.controls.left = true;
    }
    else if (event.keyCode === 38) {
      // up
      player.controls.up = true;
    }
    else if (event.keyCode === 39) {
      //right
      player.controls.right = true;
    }
    else if (event.keyCode === 40) {
      //down
      player.controls.down = true;
    }
  });

  document.addEventListener('keyup', event => {
    if (event.keyCode === 37) {
      // left
      player.controls.left = false;
    }
    else if (event.keyCode === 38) {
      // up
      player.controls.up = false;
    }
    else if (event.keyCode === 39) {
      //right
      player.controls.right = false;
    }
    else if (event.keyCode === 40) {
      //down
      player.controls.down = false;
    }
  });

  screen.width = 160;
  screen.height = 90;

  const view = {
    x: 0,
    y: 0,
    width: screen.width,
    height: screen.height,
    halfWidth: screen.width / 2,
    halfHeight: screen.height / 2,
    screen
  };

  const context = screen.getContext('2d');

  context.imageSmoothingEnabled = false;
  context.strokeStyle = '#ffffff';
  context.fillStyle = '#ffffff';
  context.lineWidth = 1;

  let top = 5, max = 10;

  const player = new Player(1, 0, -20);
  const objects = [player, new Dispenser(100, 0, 0)];

  let start = new Date().getTime(), lastFrameTime = start;

  animate();

  function animate() {
    const time = new Date().getTime();

    const dt = (lastFrameTime - time) / 1000;

    context.clearRect(0, 0, screen.width, screen.height);

    for (let i = 0; i < objects.length; i++) objects[i].tick(dt, objects, view);

    for (let i = 0; i < objects.length; i++) objects[i].draw(context, view);

    lastFrameTime = time;
    
    requestAnimationFrame(animate);
  }
});

class Entity {
  constructor (size, x, y, color) {
    this.size = size;
    this.radius = Math.sqrt(size);
    this.position = {x, y};
    this.color = color;
  }

  draw (context, view) {
    const {position: {x, y}, radius, color} = this;

    if (inView(view, x, y)) {
      context.fillStyle = color;

      context.beginPath();
      context.arc(view.halfWidth + view.x - x, view.halfHeight + view.y - y, radius, 0, 2 * Math.PI);
      context.fill();
    }
  }
}

class Player extends Entity {
  constructor (size, x, y) {
    super(size, x, y, '#33aa33');

    this.velocity = {vx: 0, vy: 0};
    this.friction = 0.95;

    this.controls = {left: false, right: false, up: false, down: false};
  }

  tick (dt, objects, view) {
    if (this.controls.left) this.velocity.vx += -1;
    if (this.controls.right) this.velocity.vx += 1;
    if (this.controls.up) this.velocity.vy += -1;
    if (this.controls.down) this.velocity.vy += 1;

    this.position.x += this.velocity.vx * dt;
    this.position.y += this.velocity.vy * dt;

    this.velocity.vx *= 1 - (-this.friction * dt);
    this.velocity.vy *= 1 - (-this.friction * dt);

    for (let i = 0; i < objects.length; i++) {
      const o = objects[i];
      if (o === this || o instanceof Dispenser) continue;

      const dx = this.position.x - o.position.x,
            dy = this.position.y - o.position.y;

      if (Math.sqrt(dx * dx + dy * dy) < (this.radius + o.radius)) {
        objects.splice(i, 1);
        this.size += o.size;
        this.radius = Math.sqrt(this.size);

        zoomOut(view, 1 + o.size / this.size);

        break;
      }
    }

    view.x = this.position.x;
    view.y = this.position.y;
  }
}

class Dispenser extends Entity {
  constructor (size, x, y) {
    super(size, x, y, '#ffffff');
  }

  tick (dt, objects) {
    const {position: {x, y}, color} = this;

    if (Math.random() < 0.01) {
      // objects.push(new Dispenser(1 + Math.random() * 10, 
      //                            this.position.x + (Math.random() * 3 - 1.5), 
      //                            this.position.y + (Math.random() * 3 - 1.5)));
      const emissionAmount = Math.sqrt(Math.random() * this.size);
      this.size -= emissionAmount;
      this.radius = Math.sqrt(this.size);

      const vx = 5 * (Math.random() - 0.5),
            vy = 5 * (Math.random() - 0.5);

      objects.push(new Emission(emissionAmount, 
                                x + (vx < 0 ? this.radius : -this.radius), 
                                y + (vy < 0 ? this.radius : -this.radius), 
                                vx, vy, '#ffff00'));

      if (this.size <= 0) {
        for (let i = 0; i < objects.length; i++) {
          if (objects[i] === this) {
            objects.splice(i, 1);
            break;
          }
        }
      }
    }
  }
}

class Emission extends Entity {
  constructor (size, x, y, vx, vy, color) {
    super(size, x, y, color);
    this.velocity = {vx, vy};
  }

  tick (dt, objects) {
    this.position.x += this.velocity.vx * dt;
    this.position.y += this.velocity.vy * dt;

    this.velocity.vx += (Math.random() - 0.5) * dt;
    this.velocity.vy += (Math.random() - 0.5) * dt;
  }
}

function inView (view, x, y) {
  const {halfWidth, halfHeight} = view;

  return (view.x - halfWidth)  < x && (view.x + halfWidth)  > x &&
         (view.y - halfHeight) < y && (view.y + halfHeight) > y;
}

function zoomOut (view, amount = 1.5) {
  setView(view, view.width * amount, view.height * amount);
}

function zoomIn (view) {
  setView(view, view.width * 0.75, view.height * 0.75);
}

function setView (view, width, height) {
  view.width = width;
  view.height = height;
  view.halfWidth = width / 2;
  view.halfHeight = height / 2;
  view.screen.width = width;
  view.screen.height = height;
}