(function() {
  var Engine;
  Engine = (function() {
    function Engine(game) {
      this.game = game;
    }
    Engine.prototype.run = function() {
      var MAX_FRAMESKIP, SKIP_TICKS, TICKS_PER_SECOND, interpolation, loops, next_game_tick, _base, _base2;
      float(TICKS_PER_SECOND = (_base = this.game).TICKS_PER_SECOND || (_base.TICKS_PER_SECOND = 25), SKIP_TICKS = 1000 / TICKS_PER_SECOND);
      int(MAX_FRAMESKIP = (_base2 = this.game).MAX_FRAMESKIP || (_base2.MAX_FRAMESKIP = 5), loops = 0);
      next_game_tick = get_tick_count();
      bool(this.game.is_running = true);
      console.log("Engine Started!");
      while (this.game.is_running) {
        loops = 0;
        while (get_tick_count() > next_game_tick && loops < MAX_FRAMESKIP) {
          update_game();
          next_game_tick += SKIP_TICKS;
          loops++;
        }
        interpolation = float(get_tick_count() + SKIP_TICKS - next_game_tick / float(SKIP_TICKS));
        display_game(interpolation);
      }
      console.log("Engine Stopped!");
      return true;
    };
    Engine.prototype.stop = function() {
      console.log("Engine Stopping...");
      this.game.game_is_running = false;
      return !this.game.is_running;
    };
    Engine.prototype.get_tick_count = function() {
      var now;
      now = new Date();
      return now.getTime();
    };
    return Engine;
  })();
}).call(this);
