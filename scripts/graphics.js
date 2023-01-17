import {VALUES} from './values.js';

export class Graphics {
  constructor() {
    this.canvas = document.getElementById('canvas'),
    this.context = canvas.getContext('2d');
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
    result.x = prop.x - this.view.x;
    result.y = this.view.height - (prop.y - this.view.y + prop.height);
    return result;
  }

  getTexture(type) {
    return this.textures.get(type);
  }

  draw(prop) {
    const {x, y} = this.transformToView(prop);
    if (prop.color) {
      this.context.fillStyle = prop.color;
      this.context.fillRect(x, y, prop.width, prop.height);
    }
    else {
      const texture = this.getTexture(prop.type);
      if (!texture) {
        console.warn('Unknown prop type: ' + prop.type);
        return;
      }
      if (prop.forward !== false) {
        this.context.drawImage(texture, x, y, prop.width, prop.height);
      }
      else {
        this.context.save();
        this.context.scale(-1, 1);
        this.context.drawImage(texture, x, y, prop.width, prop.height);
        this.context.restore();
        this.context.scale(1, 1);
      }
    }
  }

  drawAnimated(prop) {

  }
}