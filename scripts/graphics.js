import {VALUES} from './values.js';

export class Graphics {
  constructor() {
    this.canvas = document.getElementById('canvas'),
    this.context = canvas.getContext('2d');
    this.context.font = '16px Courier New';
    this.context.fillStyle = '#FFFFFF';
    const images = document.querySelectorAll('[data-texture]');
    this.textures = new Map();
    for (let image of images) {
      this.textures.set(image.getAttribute('data-texture'), image);
    }
    this.view = {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  transformToView(prop) {
    const result = {};
    result.x = prop.x;
    result.y = this.view.height - (prop.y - this.view.y + prop.height);
    return result;
  }

  getTexture(type) {
    return this.textures.get(type);
  }

  draw(prop) {
    const {x, y} = this.transformToView(prop),
          texture = this.getTexture(prop.type);
    if (!texture) {
      console.warn('Unknown prop type: ' + prop.type);
      return;
    }
    const sWidth = prop.animationCount ? texture.width / prop.animationCount : texture.width,
          sHeight = texture.height,
          sx = prop.animation ? Math.round(prop.animation) * sWidth : 0,
          sy = 0;
    if (prop.forward !== false) {
      this.context.drawImage(texture, sx, sy, sWidth, sHeight, x, y, prop.width, prop.height);
    }
    else {
      this.context.save();
      this.context.scale(-1, 1);
      this.context.drawImage(texture, sx, sy, sWidth, sHeight, -x - prop.width, y, prop.width, prop.height);
      this.context.restore();
      this.context.scale(1, 1);
    }
    
  }

  write(prop) {
    const {x, y} = this.transformToView(prop);
    this.context.font = `${prop.height}px Roboto Mono`;
    this.context.globalAlpha = prop.alpha;
    this.context.fillText(prop.text, x, y);
    this.context.globalAlpha = 1;
  }
}