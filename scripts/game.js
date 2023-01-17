import { VALUES } from './values.js';
import { EggCock, GhostCock, Level2, Level4, Level6, Level8, Parabola, RaceCock, Sinus, StandardCock, Teleportation, TeleporterCock, Trajectory } from './classes.js';
import { Graphics } from './graphics.js';
import { Sounds } from './sounds.js';

export class Game {
  constructor() {
    this.graphics = new Graphics();
    this.sounds = new Sounds();
    this.stats = new Stats();
    this.randomizer = new Randomizer();
    this.difficulty = window.ps.load('difficulty');
    this.gamemode = window.ps.load('gamemode');
    this.music = VALUES.music;
    this.view = VALUES.view;
    this.running = false;
    this.initListeners();
    this.initNewGame();
    this.initControls();
    this.start();
    window.dispatchEvent(new CustomEvent('progress:executed'));
  }

  unload() {
    this.stop();
  }

  initNewGame() {
    this.time = VALUES.time;
    this.points = 0;
    this.ammo = VALUES.ammo;
    this.reloading = false;
    this.reloadStart = 0;
    this.shotPoints = [];
    this.spawns = this.randomizer.createSpawnTimes(this.difficulty);
    this.crosshair = {
      x: Math.round(VALUES.view.width / 2),
      y: Math.round(VALUES.view.height / 2),
      type: 'crosshair',
      width: 60,
      height: 60
    }
    this.levels = {
      1: [],
      2: [new Level2()],
      3: [],
      4: [new Level4()],
      5: [],
      6: [new Level6()],
      7: [],
      8: [new Level8()]
    }
  }

  initControls() {
    const canvas = document.querySelector('#canvas');
    const getCursorPosition = (e) => {
      const offsetX = e.offsetX,
            offsetY = e.offsetY,
            canvasWidth = canvas.offsetWidth,
            canvasHeight = canvas.offsetHeight,
            x = Math.round(offsetX * (this.view.width / canvasWidth)),
            y = this.view.height - Math.round(offsetY * (this.view.height / canvasHeight));
      return { x: x, y: y };
    }
    canvas.addEventListener('mousemove', (e) => {
      const position = getCursorPosition(e);
      this.crosshair.x = position.x;
      this.crosshair.y = position.y;
    });
    canvas.addEventListener('click', (e) => {
      if (this.ammo === 0) this.sounds.play('shotgun-empty');
      if (this.ammo === 0 || this.reloading) return;
      this.ammo--;
      this.sounds.play('shotgun');
      const position = getCursorPosition(e);
    });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        if (!this.reloading && this.ammo < VALUES.ammo) {
          this.reloading = true;
          this.reloadStart = this.time;
        }
      }
    });
  }

  reload() {
    if (!this.reloading) return;
    if (this.reloadStart - this.time > VALUES.reloadTime) {
      this.reloadStart -= VALUES.reloadTime;
      this.ammo++;
      if (this.ammo === VALUES.ammo) {
        this.reloading = false;
        this.sounds.play('shotgun-reload');
      }
      else {
        this.sounds.play('shotgun-insert');
      }
    }
  }

  initListeners() {
    // Popup openers
    document.querySelectorAll('[data-action="open-popup"]').forEach((opener) => {
      opener.addEventListener('click', (e) => {
        this.openPopup(e.target.getAttribute('data-control'));
      });
    });
    // Popup closers
    document.querySelectorAll('[data-action="close-popup"]').forEach((opener) => {
      opener.addEventListener('click', (e) => {
        this.closePopup(e.target.closest('.Popup').getAttribute('data-popup'), true);
      });
    });
    // Replay
    document.querySelectorAll('[data-action="replay"]').forEach((button) => {
      button.addEventListener('click', () => {
        this.sounds.stop(this.music);
        const popup = document.querySelector('.Popup[data-visible="true"]').getAttribute('data-popup');
        this.closePopup(popup, false);
        this.initNewGame();
        this.start();
      });
    });
    // Back to menu
    document.querySelectorAll('[data-href="menu"]').forEach((link) => {
      link.addEventListener('click', () => {
        this.sounds.stop(this.music);
      });
    });
    // Toggle fullscreen
    const fullscreenButton = document.querySelector('[data-action="toggle-fullscreen"]');
    if (window.ps.load('fullscreen')) fullscreenButton.setAttribute('data-fullscreen', window.ps.load('fullscreen'));
    fullscreenButton.addEventListener('click', (e) => {
      if (e.target.getAttribute('data-fullscreen') === 'on') {
        window.ps.save('fullscreen', 'off');
        e.target.setAttribute('data-fullscreen', 'off');
        window.pwa.toggleFullscreen(false);
      }
      else {
        window.ps.save('fullscreen', 'on');
        e.target.setAttribute('data-fullscreen', 'on');
        window.pwa.toggleFullscreen(true);
      }
    });
  }

  openPopup(name) {
    this.popupOpen = true;
    this.stop();
    const popup = document.querySelector('[data-popup="' + name + '"]'),
          overlay = document.querySelector('.PageOverlay');
    popup.setAttribute('data-visible', true);
    overlay.setAttribute('data-visible', true);
  }

  closePopup(name, doActions) {
    const popup = document.querySelector('[data-popup="' + name + '"]'),
          overlay = document.querySelector('.PageOverlay');
    popup.setAttribute('data-visible', false);
    overlay.setAttribute('data-visible', false);
    if (!document.querySelector('.Popup[data-visible="true"]')) this.popupOpen = false;
    if (doActions && name === 'start') this.start();
  }

  processInput() {
    
  }

  processActions() {
    if (this.reloading) this.reload();
    if (this.spawns.length > 0) {
      if (this.spawns[0] > this.time) {
        const cock = this.randomizer.createCock(this.gamemode);
        this.levels[cock.layer].push(cock);
        this.spawns.splice(0, 1);
      }
    }
  }

  render() {
    const graphics = this.graphics;
    graphics.clear();
    [8,7,6,5,4,3,2,1].forEach((level) => {
      this.levels[level].forEach((element) => {
        graphics.draw(element);
      })
    });
    for (let i = 0; i < this.ammo; i++) {
      graphics.draw({
        type: 'ammo',
        x: this.view.width - 75 - i * 50,
        y: 25,
        width: 50,
        height: 100
      });
    }
    const ch = this.crosshair;
    graphics.draw({
      type: ch.type,
      x: ch.x - ch.width / 2,
      y: ch.y - ch.height / 2,
      width: ch.width,
      height: ch.height
    });
  }

  start() {
    this.oldTime = window.performance.now();
    this.running = true;
    window.requestAnimationFrame(this.loop.bind(this));
    this.sounds.play(this.music);
  }

  stop() {
    this.running = false;
    this.sounds.pause(this.music);
  }

  garbageCollection() {

  }

  gameOver() {
    this.render();
    document.querySelector('[data-result="points"]').innerText = this.points;
    this.openPopup('game-over');
    this.sounds.stop(this.music);
  }

  loop() {
    if (this.time <= 0) this.gameOver();
    if (!this.running) return;
    this.newTime = window.performance.now();
    this.deltaTime = this.newTime - this.oldTime;
    this.oldTime = this.newTime;
    this.time -= this.deltaTime;
    this.processInput();
    if (!this.running) return;
    this.processActions();
    if (!this.running) return;
    this.garbageCollection();
    this.render();
    this.stats.setFps(this.deltaTime);
    this.stats.setTime(this.time);
    window.requestAnimationFrame(this.loop.bind(this));
  }
}

class Stats {
  constructor() {
    this.fpsElement = document.getElementById('fps');
    this.timeElement = document.getElementById('time');
    this.pointsElement = document.getElementById('points');
    this.fpsTime = 0;
  }

  setFps(deltaTime) {
    this.fpsTime -= deltaTime;
    if (this.fpsTime > 0) return;
    const fps = Math.round(1000.0 / deltaTime);
    this.fpsElement.innerText = fps;
    this.fpsTime = 500;
  }

  setTime(time) {
    this.timeElement.innerText = Math.ceil(time / 1000);
  }

  setPoints(points) {
    this.pointsElement.innerText = points;
  }
}

class Randomizer {
  createCock(mode) {
    const cockRand = Math.random() * 100;
    let cock;
    if (mode === 'classic' || cockRand < 50) {
      cock = VALUES.cocks.standard;
    }
    else if (cockRand < 70) {
      cock = VALUES.cocks.egg;
    }
    else if (cockRand < 80) {
      cock = VALUES.cocks.teleporter;
    }
    else if (cockRand < 90) {
      cock = VALUES.cocks.ghost;
    }
    else {
      cock = VALUES.cocks.race;
    }
    const layers = [1, 3, 5, 7],
          layer = layers[Math.floor(Math.random() * layers.length)],
          direction = (Math.random() * 2 < 1) ? 0 : 1,
          startY = Math.round(Math.random() * 825) + 75,
          speedFactor = 1 + (Math.random() / 2) - 0.25,
          trajectoryName = cock.trajectories[Math.floor(Math.random() * cock.trajectories.length)];
    let trajectory;
    switch (trajectoryName) {
      case 'parabola': {
        trajectory = new Parabola(startY, VALUES.view.width, Math.random() * 300, Math.random() * 100, (Math.round(Math.random()) === 1) ? true : false);
        break;
      }
      case 'sinus': {
        trajectory = new Sinus(startY, Math.random() * 100, Math.random() / 50, Math.random() * 10);
        break;
      }
      case 'teleporation': {
        trajectory = new Teleportation(startY, (direction === 0) ? -200 : VALUES.view.width, layer);
        break;
      }
      default: {
        trajectory = new Trajectory(startY);
      }
    }
    if (cock === VALUES.cocks.standard) {
      return new StandardCock(trajectory, direction, layer, speedFactor);
    }
    else if (cock === VALUES.cocks.egg) {
      return new EggCock(trajectory, direction, layer, speedFactor);
    }
    else if (cock === VALUES.cocks.teleporter) {
      return new TeleporterCock(trajectory, direction, layer, speedFactor);
    }
    else if (cock === VALUES.cocks.ghost) {
      return new GhostCock(trajectory, direction, layer, speedFactor);
    }
    else if (cock === VALUES.cocks.race) {
      return new RaceCock(trajectory, direction, layer, speedFactor);
    }
    else {
      return new StandardCock(trajectory, direction, layer, speedFactor);
    }
  }

  createSpawnTimes(difficulty) {
    const count = difficulty === 'easy' ? 50 : difficulty === 'normal' ? 70 : difficulty === 'hard' ? 90 : 110;
    const result = [];
    for (let i = 0; i < count; i++) {
      result[i] = Math.round(Math.random() * (VALUES.time - 5000)) + 5000;
    }
    result.sort((a, b) => {
      return b - a;
    });
    return result;
  }
}