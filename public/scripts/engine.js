var Engine;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Engine = (function() {
  function Engine(game) {
    this.game = game;
    this.display_game = __bind(this.display_game, this);
    this.update_game = __bind(this.update_game, this);
    this.stop = __bind(this.stop, this);
    this.game_loop = __bind(this.game_loop, this);
    this.start = __bind(this.start, this);
    this.TICKS_PER_SECOND = game.TICKS_PER_SECOND || (game.TICKS_PER_SECOND = 25);
    this.SKIP_TICKS = 1000 / this.TICKS_PER_SECOND;
    this.MAX_FRAMESKIP = game.MAX_FRAMESKIP || (game.MAX_FRAMESKIP = 10);
    this.MAX_FPS = game.MAX_FPS || (game.MAX_FPS = 60);
    this.UPDATE_RATIO = this.MAX_FPS > this.TICKS_PER_SECOND ? this.MAX_FPS : this.TICKS_PER_SECOND;
    this.atualizou = 0;
    this.mostrou = 0;
  }
  Engine.prototype.start = function() {
    console.log("Engine Started!");
    this.loops = 0;
    this.game.is_running = true;
    this.next_game_tick = this.get_tick_count();
    this.game_loop();
    return true;
  };
  Engine.prototype.game_loop = function() {
    var interpolation;
    if (game.is_running) {
      this.loops = 0;
      if (this.get_tick_count() > this.next_game_tick && this.loops < this.MAX_FRAMESKIP) {
        this.update_game();
        this.next_game_tick += this.SKIP_TICKS;
        this.loops++;
      }
      interpolation = parseFloat(this.get_tick_count() + this.SKIP_TICKS - this.next_game_tick) / parseFloat(this.SKIP_TICKS);
      this.display_game(interpolation);
      setTimeout(this.game_loop, 1000 / this.UPDATE_RATIO);
    } else {
      console.log("Engine Stopped!");
      console.log("atualizou " + this.atualizou + " vezes");
      return console.log("mostrou " + this.mostrou + " quadros");
    }
  };
  Engine.prototype.stop = function() {
    console.log("Engine Stopping...");
    game.is_running = false;
    return !this.game.is_running;
  };
  Engine.prototype.get_tick_count = function() {
    var now, tick;
    now = new Date();
    tick = now.getTime();
    return tick;
  };
  Engine.prototype.update_game = function() {
    return this.atualizou++;
  };
  Engine.prototype.display_game = function(interpolation) {
    this.mostrou++;
    return console.log(interpolation);
  };
  return Engine;
})();