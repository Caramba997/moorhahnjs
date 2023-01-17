export const VALUES = {
  ammo: 10,
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
      speed: 1,
      hits: 100
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
      hits: 2
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
      hits: 1
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
      speed: 1000,
      hits: 1
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
      hits: 1
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
  cockSpeed: 100,
  cockWidth: 1.5,
  music: 'ambience',
  reloadTime: 400,
  sceneElements: {
    2: {
      x: 1050,
      y: 0,
      width: 750,
      height: 1080,
      type: 'tree'
    },
    4: {
      x: 0,
      y: 0,
      width: 1920,
      height: 300,
      type: 'hill'
    },
    6: {
      x: 0,
      y: 0,
      width: 900,
      height: 750,
      type: 'house'
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