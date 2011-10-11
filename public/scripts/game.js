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
    var p1;
    myGame.__super__.constructor.apply(this, arguments);
    this.CLEAR_COLOR = '#ab7';
    p1 = new Player();
    p1.width = 3;
    p1.height = 5;
    p1.X = 10;
    p1.Y = 10;
    p1.scale = 5;
    p1.state = 'move_right';
    p1.frameRate = '25';
    p1.img = 'player.png';
    p1.stateMap = {
      stand: [0],
      move_left: [0, 1, 0, 2],
      move_right: [0, 2, 0, 1],
      jump: [4, 1, 1, 5],
      crouch: [4],
      grab: [3],
      fall: [1, 2],
      felt: [4]
    };
    p1.keys = {
      'w': 'grab',
      'a': 'move_left',
      's': 'crouch',
      'd': 'move_right',
      'space': 'jump'
    };
    this.ENTITIES = [p1];
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