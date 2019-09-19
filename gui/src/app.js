import { h, render } from 'preact-cycle';

window.addEventListener('load', () => {
  render(
    GUI, {test: 'test'},
    document.body
  );

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

  let mouse = {location: {x: undefined, y: undefined}, moved: false};

  screen.addEventListener('mousedown', event => {
    panning = true;
    mouse.moved = false;
    viewStart.x = view.x;
    viewStart.y = view.y;
    move.x = event.x;
    move.y = event.y;
    mouse.location.x = event.x;
    mouse.location.y = event.y;
  });

  screen.addEventListener('mouseup', event => {
    panning = false;
    mouse.moved = false;
    mouse.location.x = event.x;
    mouse.location.y = event.y;
    if (!mouse.moved) {
      console.log('new dispenser');
      // const x = view.x
      const x = view.x - ((event.x / event.target.clientWidth) - 0.5) * view.width;
      const y = view.y - ((event.y / event.target.clientHeight) - 0.5) * view.height;
      objects.push(new Dispenser(Math.random() * 5000, x, y));
    }
  });

  screen.addEventListener('mousemove', event => {
    mouse.moved = true;
    mouse.location.x = event.x;
    mouse.location.y = event.y;
    if (panning) {
      view.x = viewStart.x + move.x - event.x;
      view.y = viewStart.y + move.y - event.y;
    }
  });

  const touch = {x: undefined, y: undefined, start: {x: undefined, y: undefined}, touched: false};

  screen.addEventListener('touchstart', event => {
    touch.touched = true;

    let x = 0, y = 0;
    for (let i = 0; i < event.touches.length; i++) {
      const {pageX, pageY} = event.touches[i];
      x += pageX;
      y += pageY;
    }

    x /= event.touches.length;
    y /= event.touches.length;

    touch.x = x;
    touch.y = y;

    touch.start.x = x;
    touch.start.y = y;

    event.preventDefault();
  });

  screen.addEventListener('touchend', event => {
    if (event.touches.length === 0) {
      touch.touched = false;

      player.controls.right = false;
      player.controls.left = false;
      player.controls.up = false;
      player.controls.down = false;
    }

    event.preventDefault();
  });

  screen.addEventListener('touchmove', event => {
    let x = 0, y = 0;
    for (let i = 0; i < event.touches.length; i++) {
      const {pageX, pageY} = event.touches[i];
      x += pageX;
      y += pageY;
    }

    x /= event.touches.length;
    y /= event.touches.length;

    touch.x = x;
    touch.y = y;

    player.controls.right = false;
    player.controls.left = false;
    player.controls.up = false;
    player.controls.down = false;

    if (x > touch.start.x) player.controls.right = true;
    if (x < touch.start.x) player.controls.left = true;
    if (y > touch.start.y) player.controls.down = true;
    if (y < touch.start.y) player.controls.up = true;

    event.preventDefault();
  });

  document.addEventListener('keydown', ({keyCode}) => {
    console.log(keyCode);
    if (keyCode === 37 || keyCode === 65) {
      // left
      player.controls.left = true;
    }
    else if (keyCode === 38 || keyCode === 87) {
      // up
      player.controls.up = true;
    }
    else if (keyCode === 39 || keyCode === 68) {
      //right
      player.controls.right = true;
    }
    else if (keyCode === 40 || keyCode === 83) {
      //down
      player.controls.down = true;
    }
    else if (keyCode === 0) {
      player.controls.launch = true;
    }

    return false;
  });

  document.addEventListener('keyup', ({keyCode}) => {
    if (keyCode === 37 || keyCode === 65) {
      // left
      player.controls.left = false;
    }
    else if (keyCode === 38 || keyCode === 87) {
      // up
      player.controls.up = false;
    }
    else if (keyCode === 39 || keyCode === 68) {
      //right
      player.controls.right = false;
    }
    else if (keyCode === 40 || keyCode === 83) {
      //down
      player.controls.down = false;
    }
    else if (keyCode === 0) {
      player.controls.launch = true;
    }

    return false;
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
  const objects = [player, new Dispenser(1000, 0, 0)];

  objects.player = player; // !!

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
    this.position = {x, y};
    this.color = color;
  }

  set size (size) {
    this._size = size;
    this.radius = Math.sqrt(size) / 4;
  }

  get size () { return this._size; }

  draw (context, view) {
    const {position: {x, y}, radius, color} = this;

    if (inView(view, x, y, radius)) {
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

    this.emissionRate = 0.025;

    this.controls = {left: false, right: false, up: false, down: false};
  }

  tick (dt, objects, view) {
    if (this.controls.left) this.velocity.vx += -1 * Math.sqrt(this.radius);
    if (this.controls.right) this.velocity.vx += 1 * Math.sqrt(this.radius);
    if (this.controls.up) this.velocity.vy += -1 * Math.sqrt(this.radius);
    if (this.controls.down) this.velocity.vy += 1 * Math.sqrt(this.radius);

    if (this.controls.launch) {
      

      this.controls.launch = false;
    }

    this.position.x += this.velocity.vx * dt;
    this.position.y += this.velocity.vy * dt;

    this.velocity.vx *= 1 - (-this.friction * dt);
    this.velocity.vy *= 1 - (-this.friction * dt);

    for (let i = objects.length - 1; i >= 0; i--) {
      const o = objects[i];
      if (o === this || o instanceof Dispenser) continue;

      const dx = o.position.x - this.position.x,
            dy = o.position.y - this.position.y,
            d = Math.sqrt(dx * dx + dy * dy),
            tr = this.radius + o.radius;

      if (d < tr) {
        objects.splice(i, 1);
        this.size += o.size;

        this.velocity.vx += o.velocity.vx * o.size / this.size;
        this.velocity.vy += o.velocity.vy * o.size / this.size;

        // zoomOut(view, 1 + o.size / this.size);
        // setViewScale(view, this.radius);
        this.maxViewScale = this.radius;
      }
      else {
        const f = tr / d;
        o.velocity.vx -= dt * dx * f;
        o.velocity.vy -= dt * dy * f;
      }
    }

    const {position: {x, y}, color} = this;

    if (Math.random() < this.emissionRate) {
      // objects.push(new Dispenser(1 + Math.random() * 10, 
      //                            this.position.x + (Math.random() * 3 - 1.5), 
      //                            this.position.y + (Math.random() * 3 - 1.5)));
      const emissionAmount = Math.sqrt(Math.max(0.01 * this.size, Math.random() * this.size));
      this.size -= emissionAmount;

      const vx = 5 * (Math.random() - 0.5),
            vy = 5 * (Math.random() - 0.5);

      objects.push(new Emission(emissionAmount, 
                                x + (vx < 0 ? this.radius : -this.radius), 
                                y + (vy < 0 ? this.radius : -this.radius), 
                                this.velocity.vx + vx, 
                                this.velocity.vy + vy, '#00aa00'));

      this.velocity.vx += -vx * (emissionAmount / (emissionAmount + this.size));
      this.velocity.vx += -vy * (emissionAmount / (emissionAmount + this.size));
    }

    view.x = this.position.x;
    view.y = this.position.y;
  }
}

class Dispenser extends Entity {
  constructor (size, x, y, emissionRate = Math.random() / 10) {
    super(size, x, y, `rgba(255, 255, 255, ${emissionRate})`);
    this.emissionRate = emissionRate;
  }

  tick (dt, objects) {
    const {position: {x, y}, color} = this;

    if (Math.random() < this.emissionRate) {
      // objects.push(new Dispenser(1 + Math.random() * 10, 
      //                            this.position.x + (Math.random() * 3 - 1.5), 
      //                            this.position.y + (Math.random() * 3 - 1.5)));
      const emissionAmount = Math.sqrt(Math.random() * this.radius);
      this.size -= emissionAmount;

      const vx = 5 * (Math.random() - 0.5) / this.emissionRate,
            vy = 5 * (Math.random() - 0.5) / this.emissionRate;

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
    this.removeCount = size * 100;
  }

  tick (dt, objects) {
    this.position.x += this.velocity.vx * dt;
    this.position.y += this.velocity.vy * dt;

    this.velocity.vx += (Math.random() - 0.5) * dt;
    this.velocity.vy += (Math.random() - 0.5) * dt;

    if (--this.removeCount <= 0) {
      for (let i = 0; i < objects.length; i++) {
        if (objects[i] === this) {
          objects.splice(i, 1);
          objects.player.size += this.size;
          break;
        }
      }
    }
  }
}

function inView (view, x, y, radius) {
  const {halfWidth, halfHeight} = view;

  return (view.x - halfWidth - radius)  < x && (view.x + halfWidth + radius)  > x &&
         (view.y - halfHeight - radius) < y && (view.y + halfHeight + radius) > y;
}

function zoomOut (view, amount = 1.5) {
  setView(view, view.width * amount, view.height * amount);
}

function zoomIn (view) {
  setView(view, view.width * 0.75, view.height * 0.75);
}

function setView (view, width, height) {
  if (width > 10000 || height > 10000) return;

  view.width = width;
  view.height = height;
  view.halfWidth = width / 2;
  view.halfHeight = height / 2;
  view.screen.width = width;
  view.screen.height = height;
}

function setViewScale(view, scale) {
  return setView(view, scale * 160, scale * 90);
}


const {
  INIT
} = {
  INIT (_, mutation) {
    _.inited = true;
    _.mutation = mutation;

    console.log('init')

    return _;
  }
};


const INIT_GUI = ({}, {inited, mutation}) => inited ? <GUI /> : mutation(INIT)(mutation);

const GUI = ({test}) => (
  <gui>
    gui
    {}
  </gui>
);