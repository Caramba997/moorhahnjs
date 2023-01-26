const textures = [
  {
    type: "ammo",
    src: "textures/Ammo.png",
    imageWidth: "50",
    imageHeight: "100",
    animation: false
  },
  {
    type: "cock-egg",
    src: "textures/EggAnimation.png",
    imageWidth: "2475",
    imageHeight: "150",
    animation: 11
  },
  {
    type: "cock-ghost",
    src: "textures/GhostAnimation.png",
    imageWidth: "2475",
    imageHeight: "150",
    animation: 11
  },
  {
    type: "hill",
    src: "textures/Hill.png",
    imageWidth: "1920",
    imageHeight: "300",
    animation: false
  },
  {
    type: "house",
    src: "textures/House.png",
    imageWidth: "900",
    imageHeight: "750",
    animation: false
  },
  {
    type: "cock-dead",
    src: "textures/MoorhahnDead.png",
    imageWidth: "225",
    imageHeight: "150",
    animation: false
  },
  {
    type: "cock-race",
    src: "textures/MoorhahnRace.png",
    imageWidth: "225",
    imageHeight: "150",
    animation: false
  },
  {
    type: "cock-teleporter",
    src: "textures/MoorhahnTeleporter.png",
    imageWidth: "225",
    imageHeight: "150",
    animation: false
  },
  {
    type: "sky",
    src: "textures/Sky.png",
    imageWidth: "1920",
    imageHeight: "1080",
    animation: false
  },
  {
    type: "cock",
    src: "textures/StandardAnimation.png",
    imageWidth: "2475",
    imageHeight: "150",
    animation: 11
  },
  {
    type: "tree",
    src: "textures/Tree.png",
    imageWidth: "800",
    imageHeight: "1152",
    animation: false
  },
  {
    type: "crosshair",
    src: "textures/Crosshair.png",
    imageWidth: "100",
    imageHeight: "100",
    animation: false
  }
];

const sounds = [
  {
    type: "ambience",
    src: "sounds/ambience.wav",
    volume: 1,
    loop: true
  },
  {
    type: "shotgun-empty",
    src: "sounds/shotgun-empty.wav",
    volume: 1,
    loop: false
  },
  {
    type: "shotgun-insert",
    src: "sounds/shotgun-insert.wav",
    volume: 1,
    loop: false
  },
  {
    type: "shotgun-reload",
    src: "sounds/shotgun-reload.wav",
    volume: 1,
    loop: false
  },
  {
    type: "shotgun",
    src: "sounds/shotgun.wav",
    volume: 1,
    loop: false
  }
];

export class AssetLoader {
  loadTextures(textureContainer, progress) {
    progress.textures.steps = textures.length;
    for (let texture of textures) {
      const img = document.createElement('img');
      textureContainer.appendChild(img);
      img.addEventListener('load', () => {
        progress.textures.current += 1;
        window.dispatchEvent(new CustomEvent('progress:changed', { detail: progress }));
      });
      img.width = texture.imageWidth;
      img.height = texture.imageHeight;
      img.setAttribute('data-texture', texture.type);
      if (texture.animation) img.setAttribute('data-animation', texture.animation);
      img.src = texture.src;
    }
    textureContainer.setAttribute('data-initialized', 'true');
  }

  loadSounds(soundContainer, progress) {
    window.sounds = {};
    progress.sounds.steps = sounds.length;
    for (let sound of sounds) {
      const audio = document.createElement('audio');
      soundContainer.appendChild(audio);
      audio.addEventListener('canplaythrough', () => {
        progress.sounds.current += 1;
        window.dispatchEvent(new CustomEvent('progress:changed', { detail: progress }));
      });
      audio.setAttribute('data-sound', sound.type);
      if (sound.loop) audio.loop = true;
      if (sound.volume) audio.volume = sound.volume;
      audio.preload = 'auto';
      audio.src = sound.src;
      audio.load();
      window.sounds[sound.type] = audio;
    }
    soundContainer.setAttribute('data-initialized', 'true');
  }
}