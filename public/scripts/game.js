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
    var b1, l1, p1, p2;
    myGame.__super__.constructor.apply(this, arguments);
    this.CLEAR_COLOR = '#2EB5D9';
    this.TICKS_PER_SECOND = 60;
    /*
    		PLAYERS
    		*/
    p1 = new Engine.Player;
    p1.width = 3;
    p1.height = 5;
    p1.X = 10;
    p1.Y = 425;
    p1.scale = 5;
    p1.img = 'player.png';
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
      },
      falling_deep: {
        frames: [1, 2],
        looping: true
      },
      felt: {
        frames: [4]
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
    p2.X = 10;
    p2.Y = 425;
    p2.scale = 5;
    p2.img = 'player.png';
    p2.animations = {
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
      },
      falling_deep: {
        frames: [1, 2],
        looping: true
      },
      felt: {
        frames: [4]
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
    l1.tilemap = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [2, 2, 2, 2, 2, 2, 3], [4, 4, 4, 4, 4, 4, 5], [4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22], [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24], [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24], [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24]];
    this.LEVELS = [l1];
    /*
    		BACKGROUND
    		*/
    b1 = new Engine.Background;
    b1.img = 'level.png';
    b1.image_width = 50;
    b1.scale = 5;
    b1.width = 5;
    b1.height = 5;
    b1.tilemap = [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 18, 19, 20], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 27, 28, 29, 30], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 38, 39, 40]];
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