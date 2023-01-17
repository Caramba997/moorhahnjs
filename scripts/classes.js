import { VALUES } from './values.js';

export class Cock {
  constructor(trajectory, direction, layer, speed, points, type, hits) {
    this.trajectory = trajectory;
    this.layer = layer;
    this.size = VALUES.cockSizes[this.layer];
    this.x = (direction === 0) ? -200 : VALUES.view.width;
    const position = trajectory.getPosition(this.x);
    this.x = position.x;
    this.y = position.y;
    this.width = this.size * VALUES.cockSize * VALUES.cockWidth;
    this.height = this.size * VALUES.cockSize * VALUES.cockHeight;
    this.direction = direction;
    this.forward = direction === 1;
    this.speed = speed; //Pixels per second
    this.dead = false;
    this.animation = 0;
    this.points = points;
    this.type = type;
    this.hits = hits;
  }

  move(deltaTime) {
    this.x += deltaTime / 1000 * this.speed;
    const position = trajectory.getPosition(this.x);
    this.x = position.x;
    this.y = position.y;
  }

  hit() {
    this.hits--;
    if (this.hits === 0) this.dead = true;
  }
}

export class StandardCock extends Cock {
  constructor(trajectory, direction, layer, speedFactor) {
    const defaults = VALUES.cocks.standard;
    super(trajectory, direction, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits);
  }
}

export class EggCock extends Cock {
  constructor(trajectory, direction, layer, speedFactor) {
    const defaults = VALUES.cocks.egg;
    super(trajectory, direction, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits);
  }

  hit() {
    this.hits--;
    if (this.hits === 1) {
      this.type = VALUES.cocks.standard.type;
    }
    else if (this.hits === 0) {
      this.dead = true;
    }
  }
}

export class GhostCock extends Cock {
  constructor(trajectory, direction, layer, speedFactor) {
    const defaults = VALUES.cocks.ghost;
    super(trajectory, direction, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits);
  }
}

export class RaceCock extends Cock {
  constructor(trajectory, direction, layer, speedFactor) {
    const defaults = VALUES.cocks.race;
    super(trajectory, direction, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits);
  }
}

export class TeleporterCock extends Cock {
  constructor(trajectory, direction, layer, speedFactor) {
    const defaults = VALUES.cocks.teleporter;
    super(trajectory, direction, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits);
  }
}

export class Trajectory {
  constructor(startY) {
    this.startY = startY;
  }

  getPosition(x) {
    return {
      x: x,
      y: this.startY
    };
  }
}

export class Parabola extends Trajectory {
  constructor(startY, width, amplitude, xShift, up) {
    super(startY);
    this.width = width;
    this.amplitude = amplitude;
    this.xShift = xShift;
    this.up = up;
  }

  getPosition(x) {
    const fixedX = ((x + this.xShift) / this.width * 2) - 1;
    return {
      x: x,
      y: this.startY + (this.up ? -1 : 1) * Math.round(this.amplitude * (1 - fixedX * fixedX))
    };
  }
}

export class Sinus extends Trajectory {
  constructor(startY, amplitude, frequency, xShift) {
    super(startY);
    this.amplitude = amplitude;
    this.frequency = frequency;
    this.xShift = xShift;
  }

  getPosition(x) {
    return {
      x: x,
      y: this.startY + Math.round(this.amplitude * Math.sin(this.frequency * (x + this.xShift)))
    };
  }
}

export class Teleportation extends Trajectory {
  constructor(startY, startX, layer) {
    super(startY);
    this.x = startX;
    this.newX = startX;
    this.newY = startY;
    this.layer = layer;
    this.pause = VALUES.cocks.teleporter.pause;
    this.travel = VALUES.cocks.teleporter.travel;
    this.teleporting = false;
  }

  getPosition(x) {
    const delta = Math.abs(this.x - x);
    if (!this.teleporting && delta > this.pause) { // Start teleporting
      this.newX = x + this.travel;
      this.newY = Math.random() * 600 + 50
      this.teleporting = true;
    }
    else if (this.teleporting && delta < this.pause + this.travel) { // Teleporting
      return {
        x: this.x + ((delta - this.travel) / this.travel) * (this.newX - this.x),
        y: this.y + ((delta - this.travel) / this.travel) * (this.newY - this.y)
      };
    }
    else if (delta >= this.pause + this.travel) {
      this.x = this.newX;
      this.y = this.newY;
      this.teleporting = false;
    }
    return {
      x: this.x,
      y: this.y
    };
  }
}

export class ShotPoint {
  constructor(x, y, points) {
    this.x = x;
    this.y = y;
    this.points = points;
    this.visibleTime = VALUES.shotPointTime;
    this.time = VALUES.shotPointTime;
    this.alpha = 1;
  }

  disappear(deltaTime) {
    this.time -= deltaTime;
    this.alpha = this.time / this.visibleTime;
  }
}

export class SceneElement {
  constructor(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  checkHit(x, y) {
    return false;
  }
}

export class Level2 extends SceneElement {
  constructor() {
    const defaults = VALUES.sceneElements[2];
    super(defaults.x, defaults.y, defaults.width, defaults.height, defaults.type);
  }
}

export class Level4 extends SceneElement {
  constructor() {
    const defaults = VALUES.sceneElements[4];
    super(defaults.x, defaults.y, defaults.width, defaults.height, defaults.type);
  }
}

export class Level6 extends SceneElement {
  constructor() {
    const defaults = VALUES.sceneElements[6];
    super(defaults.x, defaults.y, defaults.width, defaults.height, defaults.type);
  }
}

export class Level8 extends SceneElement {
  constructor() {
    const defaults = VALUES.sceneElements[8];
    super(defaults.x, defaults.y, defaults.width, defaults.height, defaults.type);
  }
}