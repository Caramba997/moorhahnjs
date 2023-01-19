export const VALUES = {
  ammo: 10,
  animationSpeed: 8000,
  cocks: {
    standard: {
      type: 'cock',
      trajectories: ['parabola', 'sinus'],
      points: {
        1: 10,
        3: 15,
        5: 20,
        7: 25
      },
      speed: 100,
      hits: 1,
      // hitbox: [[65,0],[95,50],[130,15],[175,20],[224,149],[145,149],[10,110],[10,25],[30,0]]
      hitbox: [[65,149],[95,99],[130,134],[175,129],[224,0],[145,0],[10,39],[10,124],[30,149]],
      hitboxSize: { width: 225, height: 150 }
    },
    egg: {
      type: 'cock-egg',
      trajectories: ['parabola', 'sinus'],
      points: {
        1: 20,
        3: 25,
        5: 30,
        7: 35
      },
      speed: 100,
      hits: 2,
      hitbox: [[65,149],[95,99],[130,134],[175,129],[224,0],[145,0],[10,39],[10,124],[30,149]],
      hitboxSize: { width: 225, height: 150 }
    },
    ghost: {
      type: 'cock-ghost',
      trajectories: ['parabola', 'sinus'],
      points: {
        1: 15,
        3: 20,
        5: 25,
        7: 30
      },
      speed: 100,
      hits: 1,
      hitbox: [[65,149],[95,99],[130,134],[175,129],[224,0],[145,0],[10,39],[10,124],[30,149]],
      hitboxSize: { width: 225, height: 150 }
    },
    race: {
      type: 'cock-race',
      trajectories: ['trajectory'],
      points: {
        1: 20,
        3: 30,
        5: 40,
        7: 50
      },
      speed: 500,
      hits: 1,
      // hitbox: [[20,55],[50,25],[120,30],[170,5],[220,20],[224,20],[110,149],[10,149]]
      hitbox: [[20,94],[50,124],[120,119],[170,144],[220,129],[224,129],[110,0],[10,0]],
      hitboxSize: { width: 225, height: 150 }
    },
    teleporter: {
      type: 'cock-teleporter',
      trajectories: ['teleportation'],
      points: {
        1: 10,
        3: 15,
        5: 20,
        7: 25
      },
      speed: 100,
      pause: 300,
      travel: 50,
      hits: 1,
      hitbox: [[20,94],[50,124],[120,119],[170,144],[220,129],[224,129],[110,0],[10,0]],
      hitboxSize: { width: 225, height: 150 }
    }
  },
  cockHeight: 1,
  cockLayers: [1, 3, 5, 7],
  cockSize: 100,
  cockSizes: {
    1: 1.5,
    3: 1.2,
    5: 0.75,
    7: 0.45
  },
  cockSpeed: 200,
  cockWidth: 1.5,
  fallSpeed: 100,
  music: 'ambience',
  reloadTime: 400,
  sceneElements: {
    2: {
      x: 1050,
      y: 0,
      width: 750,
      height: 1080,
      type: 'tree',
      // hitbox: [[0,0],[799,0],[500,90],[500,435],[765,375],[765,480],[505,480],[505,1151],[275,1151],[280,325],[20,370],[25,340],[280,275],[285,65]],
      hitbox: [[0,1151],[799,1151],[500,1061],[500,716],[765,776],[765,671],[505,671],[505,0],[275,0],[280,826],[20,781],[25,811],[280,876],[285,1086]],
      hitboxSize: { width: 800, height: 1152 }
    },
    4: {
      x: 0,
      y: 0,
      width: 1920,
      height: 300,
      type: 'hill',
      // hitbox: [[0,299],[810,35],[1450,25],[1919,90],[1919,299]],
      hitbox: [[0,0],[810,264],[1450,274],[1919,209],[1919,0]],
      hitboxSize: { width: 1920, height: 300 }
    },
    6: {
      x: 0,
      y: 0,
      width: 900,
      height: 750,
      type: 'house',
      // hitbox: [[0,480],[290,430],[290,235],[460,75],[635,235],[635,440],[899,555],[899,749],[0,749]],
      hitbox: [[0,269],[290,319],[290,514],[460,674],[635,514],[635,309],[899,194],[899,0],[0,0]],
      hitboxSize: { width: 900, height: 750 }
    },
    8: {
      x: 0,
      y: 0,
      width: 1920,
      height: 1080,
      type: 'sky'
    }
  },
  shotPointTime: 1000,
  time: 90000,
  view: {
    width: 1920,
    height: 1080
  }
};