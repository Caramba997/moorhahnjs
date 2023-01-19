import { VALUES } from './values.js';

export class Cock {
  constructor(trajectory, forward, layer, speed, points, type, hits, hitbox, hitboxSize) {
    this.trajectory = trajectory;
    this.forward = forward;
    this.layer = layer;
    this.size = VALUES.cockSizes[this.layer];
    this.x = forward ? -250 : VALUES.view.width;
    const position = trajectory.getPosition(this.x);
    this.x = position.x;
    this.y = position.y;
    this.width = this.size * VALUES.cockSize * VALUES.cockWidth;
    this.height = this.size * VALUES.cockSize * VALUES.cockHeight;
    this.speed = speed; //Pixels per second
    this.dead = false;
    this.animation = 0;
    this.animationCount = 1;
    this.animationForward = true;
    this.points = points;
    this.type = type;
    this.hits = hits;
    this.hitbox = hitbox;
    this.hitboxSize = hitboxSize;
  }

  move(deltaTime) {
    this.x += (this.forward === false ? -1 : 1) * deltaTime / 1000 * this.speed;
    const position = this.trajectory.getPosition(this.x);
    this.x = position.x;
    this.y = position.y;
    if (this.animationCount > 1) {
      if (this.animationForward) {
        this.animation += deltaTime / VALUES.animationSpeed * this.speed;
        if (this.animation > this.animationCount - 1) {
          this.animation = this.animationCount - 1 - (this.animation - (this.animationCount - 1));
          this.animationForward = false;
        }
      }
      else {
        this.animation -= deltaTime / VALUES.animationSpeed * this.speed;
        if (this.animation < 0) {
          this.animation = Math.abs(this.animation);
          this.animationForward = true;
        }
      }
    }
  }

  hit() {
    this.hits--;
    if (this.hits === 0) this.dead = true;
  }
}

export class DeadCock extends Cock {
  constructor(cock) {
    const layer = cock.layer;
    super(cock.trajectory, cock.forward, cock.layer, VALUES.cockSpeed * (layer === 1 ? 2 : layer === 3 ? 1.5 : layer === 5 ? 1 : 0.5), 0, 'cock-dead', 0, null, null);
    this.dead = true;
    this.x = cock.x;
    this.y = cock.y;
    this.trajectory = new Fall(cock.y, cock.x);
  }
}

export class StandardCock extends Cock {
  constructor(trajectory, forward, layer, speedFactor) {
    const defaults = VALUES.cocks.standard;
    super(trajectory, forward, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits, defaults.hitbox, defaults.hitboxSize);
    this.animationCount = 11;
  }
}

export class EggCock extends Cock {
  constructor(trajectory, forward, layer, speedFactor) {
    const defaults = VALUES.cocks.egg;
    super(trajectory, forward, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits, defaults.hitbox, defaults.hitboxSize);
    this.animationCount = 11;
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
  constructor(trajectory, forward, layer, speedFactor) {
    const defaults = VALUES.cocks.ghost;
    super(trajectory, forward, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits, defaults.hitbox, defaults.hitboxSize);
    this.animationCount = 11;
  }
}

export class RaceCock extends Cock {
  constructor(trajectory, forward, layer, speedFactor) {
    const defaults = VALUES.cocks.race;
    super(trajectory, forward, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits, defaults.hitbox, defaults.hitboxSize);
  }
}

export class TeleporterCock extends Cock {
  constructor(trajectory, forward, layer, speedFactor) {
    const defaults = VALUES.cocks.teleporter;
    super(trajectory, forward, layer, speedFactor * defaults.speed, defaults.points[layer], defaults.type, defaults.hits, defaults.hitbox, defaults.hitboxSize);
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
  constructor(startY, startX, layer, forward) {
    super(startY);
    this.x = startX;
    this.y = startY;
    this.newX = startX;
    this.newY = startY;
    this.layer = layer;
    this.forward = forward;
    this.pause = VALUES.cocks.teleporter.pause * (layer === 1 ? 1.5 : layer === 3 ? 1.2 : layer === 5 ? 0.9 : 0.5);
    this.travel = VALUES.cocks.teleporter.travel;
    this.delta = 0;
    this.teleporting = false;
  }

  getPosition(x) {
    this.delta += Math.abs(this.x - x);
    if (!this.teleporting && this.delta >= this.pause) { // Start teleporting
      this.newX = this.newX + (this.forward ? 1 : -1) * this.delta + (this.forward ? 1 : -1) * this.travel;
      this.newY = Math.random() * 800 + 50;
      this.teleporting = true;
    }
    else if (this.teleporting && this.delta < this.pause + this.travel) { // Teleporting
      return {
        x: this.x + (this.forward ? 1 : -1) * ((this.delta - this.pause) / this.travel) * (Math.abs(this.newX - this.x)),
        y: this.y + ((this.delta - this.pause) / this.travel) * (this.newY - this.y)
      };
    }
    else if (this.delta >= this.pause + this.travel) {
      this.x = this.newX;
      this.y = this.newY;
      this.teleporting = false;
      this.delta = 0;
    }
    return {
      x: this.x,
      y: this.y
    };
  }
}

export class Fall extends Trajectory {
  constructor(startY, startX) {
    super(startY);
    this.startX = startX;
    this.y = startY;
  }

  getPosition(x) {
    this.y -= Math.abs(this.startX - x);
    return {
      x: this.startX,
      y: this.y
    };
  }
}

export class ShotPoint {
  constructor(x, y, points) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 40;
    this.text = points.toString();
    this.visibleTime = VALUES.shotPointTime;
    this.time = VALUES.shotPointTime;
    this.alpha = 1;
  }

  move(deltaTime) {
    this.time -= deltaTime;
    this.alpha = Math.max(0, this.time / this.visibleTime);
  }
}

export class SceneElement {
  constructor(x, y, width, height, type, hitbox, hitboxSize) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.hitbox = hitbox;
    this.hitboxSize = hitboxSize;
  }

  checkHit(x, y) {
    return false;
  }
}

export class Level2 extends SceneElement {
  constructor() {
    const defaults = VALUES.sceneElements[2];
    super(defaults.x, defaults.y, defaults.width, defaults.height, defaults.type, defaults.hitbox, defaults.hitboxSize);
  }
}

export class Level4 extends SceneElement {
  constructor() {
    const defaults = VALUES.sceneElements[4];
    super(defaults.x, defaults.y, defaults.width, defaults.height, defaults.type, defaults.hitbox, defaults.hitboxSize);
  }
}

export class Level6 extends SceneElement {
  constructor() {
    const defaults = VALUES.sceneElements[6];
    super(defaults.x, defaults.y, defaults.width, defaults.height, defaults.type, defaults.hitbox, defaults.hitboxSize);
  }
}

export class Level8 extends SceneElement {
  constructor() {
    const defaults = VALUES.sceneElements[8];
    super(defaults.x, defaults.y, defaults.width, defaults.height, defaults.type, null, null);
  }
}