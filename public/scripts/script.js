var engine, game, myGame;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
myGame = (function() {
  __extends(myGame, Game);
  function myGame() {
    this.game = __bind(this.game, this);
    this.opening = __bind(this.opening, this);    this.MAX_FPS = 60;
    this.TICKS_PER_SECOND = 25;
    this.mahFlag = false;
    this.state = "start";
    this.stateMachine = {
      "start": this.opening,
      "game": this.game
    };
    this.assets = {
      imagesPath: "../assets/images/",
      soundPath: "../assets/sound/",
      start: {
        images: ["sonic_title.jpg"]
      },
      game: {
        images: ["sonic_sprites.png", "sonic_tileset.png"]
      }
    };
  }
  myGame.prototype.opening = function() {
    if (this.mahFlag) {
      return;
    }
    this.mahFlag = true;
    setTimeOut(this.state = "game", 2 * 1000);
    return console.log("opening");
  };
  myGame.prototype.game = function() {
    if (!this.mahFlag) {
      return;
    }
    this.mahFlag = false;
    return console.log("The Game!");
  };
  return myGame;
})();
game = new myGame;
engine = new Engine(game);
engine.start();
setTimeout(engine.stop, 5 * 1000);