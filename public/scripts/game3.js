var game, myGame;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
myGame = (function() {
  __extends(myGame, Engine);
  function myGame() {
    this.playing = __bind(this.playing, this);
    this.state_machine = __bind(this.state_machine, this);
    var b1, l1, l2, p1, p2;
    myGame.__super__.constructor.apply(this, arguments);
    this.CLEAR_COLOR = '#2EB5D9';
    this.TICKS_PER_SECOND = 30;
    this.DEBUG = 2;
    /*
    		PLAYERS
    		*/
    p1 = new Engine.Player;
    p1.width = 3;
    p1.height = 5;
    p1.X = 25;
    p1.Y = 425;
    p1.scale = 5;
    p1.attrition = 0.95;
    p1.img = 'player.png';
    p1.sounds = {
      jump: 'jump.wav'
    };
    p1.animations = {
      idle: {
        frames: [0]
      },
      move_left: {
        frames: [1, 0, 2, 0],
        looping: true
      },
      move_right: {
        frames: [2, 0, 1, 0],
        looping: true
      },
      jumping: {
        frames: [4, 1]
      },
      falling: {
        frames: [5]
      },
      crouch: {
        frames: [4]
      },
      grab: {
        frames: [3]
      }
    };
    p1.keys = {
      87: 'grab',
      65: 'move_left',
      83: 'crouch',
      68: 'move_right',
      32: 'jump'
    };
    p2 = new Engine.Player;
    p2.width = 3;
    p2.height = 5;
    p2.X = 40;
    p2.Y = 425;
    p2.scale = 10;
    p2.default_gravity = 1;
    p2.img = 'player.png';
    p2.sounds = {
      jump: 'jump.wav'
    };
    p2.animations = {
      idle: {
        frames: [0]
      },
      move_left: {
        frames: [1, 0, 2, 0]
      },
      move_right: {
        frames: [2, 0, 1, 0],
        looping: true
      },
      jumping: {
        frames: [4, 1]
      },
      falling: {
        frames: [5]
      },
      crouch: {
        frames: [4]
      },
      grab: {
        frames: [3]
      }
    };
    p2.keys = {
      38: 'grab',
      37: 'move_left',
      40: 'crouch',
      39: 'move_right',
      18: 'jump'
    };
    this.PLAYERS = [p1, p2];
    /*
    		LEVEL
    		*/
    l1 = new Engine.Level;
    l1.img = 'level.png';
    l1.image_width = 50;
    l1.scale = 5;
    l1.width = 5;
    l1.height = 5;
    l1.tilemap = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [6], [6], [6], [6], [6], [6], [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6], [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6], [6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6], [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6], [0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6], [0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6], [0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6]];
    l2 = new Engine.Level;
    l2.img = 'level.png';
    l2.image_width = 50;
    l2.scale = 30;
    l2.width = 5;
    l2.height = 5;
    l2.tilemap = [[0], [0], [0], [2], [0, 2, 2, 2, 2, 2]];
    this.LEVELS = [l1, l2];
    /*
    		BACKGROUND
    		*/
    b1 = new Engine.Background;
    b1.img = 'level.png';
    b1.image_width = 50;
    b1.scale = 5;
    b1.width = 5;
    b1.height = 5;
    b1.tilemap = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 19, 20], [2, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30], [4, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 38, 39, 40], [4, 4, 4, 4, 4, 4], [4, 4, 4, 4, 4, 4]];
    this.BACKGROUNDS = [b1];
  }
  myGame.prototype.state_machine = function() {
    switch (this.STATE.name) {
      case 'Game':
        this.playing();
        break;
    }
  };
  myGame.prototype.playing = function() {};
  return myGame;
})();
game = new myGame;
game.start();