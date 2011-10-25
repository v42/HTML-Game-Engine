var Background, Engine;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
Engine = (function() {
  function Engine() {
    this.load_entities = __bind(this.load_entities, this);
    this.draw = __bind(this.draw, this);
    this.display_game = __bind(this.display_game, this);
    this.clear = __bind(this.clear, this);
    this.update_animation = __bind(this.update_animation, this);
    this.update_entities = __bind(this.update_entities, this);
    this.state_machine = __bind(this.state_machine, this);
    this.update_game = __bind(this.update_game, this);
    this.calculate_fps = __bind(this.calculate_fps, this);
    this.tic_tac = __bind(this.tic_tac, this);
    this.move = __bind(this.move, this);
    this.pause = __bind(this.pause, this);
    this.process_inputs = __bind(this.process_inputs, this);
    this.key_up = __bind(this.key_up, this);
    this.key_down = __bind(this.key_down, this);
    this.bind_keys = __bind(this.bind_keys, this);
    this.stop = __bind(this.stop, this);
    this.game_loop = __bind(this.game_loop, this);
    this.start = __bind(this.start, this);    this.TICKS_PER_SECOND = 25;
    this.SKIP_TICKS = 1000 / this.TICKS_PER_SECOND;
    this.MAX_FRAMESKIP = 1;
    this.MAX_FPS = 60;
    this.UPDATE_RATIO = this.MAX_FPS > this.TICKS_PER_SECOND ? this.MAX_FPS : this.TICKS_PER_SECOND;
    this.CANVAS_ID = 'game_canvas';
    this.CLEAR_COLOR = '#000';
    this.CANVAS = document.getElementById(this.CANVAS_ID);
    this.CANVAS.width = 640;
    this.CANVAS.height = 480;
    this.ctx = this.CANVAS.getContext('2d');
    this.STATE = {
      name: 'Game',
      loaded: false
    };
    this.ENTITIES = {};
    this.KEYS = {};
    this.KEY_PRESSED = {};
    this.imagesPath = "/assets/images/";
    this.soundPath = "/assets/sound/";
  }
  Engine.prototype.start = function() {
    var now;
    this.loops = 0;
    this.is_running = true;
    console.log("Engine Started!");
    this.load_entities();
    this.bind_keys();
    now = new Date();
    this.first_tick = now.getTime();
    this.tic_tac();
    this.next_game_tick = this.tick;
    this.game_loop();
    this.calculate_fps();
    return true;
  };
  Engine.prototype.game_loop = function() {
    var interpolation;
    if (this.is_running) {
      this.tic_tac();
      this.loops = 0;
      if (this.tick > this.next_game_tick && this.loops < this.MAX_FRAMESKIP) {
        this.update_game();
        this.next_game_tick += this.SKIP_TICKS;
        this.loops++;
      }
      interpolation = parseFloat(this.tick + this.SKIP_TICKS - this.next_game_tick) / parseFloat(this.SKIP_TICKS);
      this.display_game(interpolation);
      setTimeout(this.game_loop, 1000 / this.UPDATE_RATIO);
    } else {
      console.log("Engine Stopped!");
    }
  };
  Engine.prototype.stop = function() {
    console.log("Engine Stopping...");
    this.is_running = false;
    return !this.is_running;
  };
  Engine.prototype.bind_keys = function() {
    var a, k, obj, _i, _len, _ref, _ref2;
    _ref = this.ENTITIES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      if (obj.keys != null) {
        _ref2 = obj.keys;
        for (k in _ref2) {
          a = _ref2[k];
          this.KEYS[k] = obj[a];
          this.KEY_PRESSED[k] = false;
        }
      }
    }
    document.onkeydown = this.key_down;
    document.onkeyup = this.key_up;
  };
  Engine.prototype.key_down = function() {
    return this.KEY_PRESSED[event.keyCode] = true;
  };
  Engine.prototype.key_up = function() {
    this.KEY_PRESSED[event.keyCode] = false;
    if (this.KEYS[event.keyCode] != null) {
      return this.KEYS[event.keyCode](false);
    }
  };
  Engine.prototype.process_inputs = function() {
    var action, key, _ref, _results;
    _ref = this.KEYS;
    _results = [];
    for (key in _ref) {
      action = _ref[key];
      _results.push((this.KEYS[key] != null) && this.KEY_PRESSED[key] ? action(true) : void 0);
    }
    return _results;
  };
  Engine.prototype.pause = function() {};
  Engine.prototype.move = function(obj, direction) {};
  Engine.prototype.tic_tac = function() {
    var now;
    now = new Date();
    this.tick = now.getTime() - this.first_tick;
    return this.animation_tick = this.tick / 1000;
  };
  Engine.prototype.calculate_fps = function() {
    this.fps = this.frames;
    this.frames = 0;
    return setTimeout(this.calculate_fps, 1000);
  };
  Engine.prototype.update_game = function() {
    this.process_inputs();
    this.update_entities();
    this.state_machine();
  };
  Engine.prototype.state_machine = function() {};
  Engine.prototype.update_entities = function() {
    var obj, _i, _len, _ref;
    _ref = this.ENTITIES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      obj.update();
    }
  };
  Engine.prototype.update_animation = function() {
    var obj, _i, _len, _ref;
    _ref = this.ENTITIES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      if (obj.frameCount > this.MAX_FPS / obj.frameRate) {
        obj.currentFrame = obj.currentFrame < obj.animations[obj.state].frames.length - 1 ? obj.currentFrame + 1 : 0;
        obj.frameCount = 0;
      }
      obj.frame = obj.animations[obj.state].frames[obj.currentFrame];
      obj.frameCount++;
    }
  };
  Engine.prototype.clear = function(color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.CANVAS.width, this.CANVAS.height);
    this.ctx.closePath();
    return this.ctx.fill();
  };
  Engine.prototype.display_game = function(interpolation) {
    var obj, _i, _len, _ref;
    if (this.CLEAR_COLOR != null) {
      this.clear(this.CLEAR_COLOR);
    }
    this.update_animation();
    _ref = this.ENTITIES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      if (obj.visible) {
        this.draw(obj);
      }
    }
    this.frames++;
  };
  Engine.prototype.draw = function(obj) {
    if (obj.img) {
      try {
        return this.ctx.drawImage(obj.image, 0 + obj.width * obj.frame, 0, obj.width, obj.height, obj.X, obj.Y, obj.width * obj.scale, obj.height * obj.scale);
      } catch (e) {
        return console.log(e);
      }
    }
  };
  Engine.prototype.load_entities = function() {
    var obj, _i, _len, _ref;
    this.STATE.loaded = false;
    _ref = this.ENTITIES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      if (obj.img) {
        obj.image = new Image;
        obj.image.onload = function() {
          return obj.image.loaded = true;
        };
        obj.image.src = this.imagesPath + obj.img;
      }
    }
    return this.STATE.loaded = true;
  };
  return Engine;
})();
Engine.GameEntity = (function() {
  function GameEntity() {
    this.change_animation_state = __bind(this.change_animation_state, this);
    this.move = __bind(this.move, this);
    this.update = __bind(this.update, this);    this.id;
    this.X;
    this.Y;
    this.width;
    this.height;
    this.scale;
    this.frame = 0;
    this.frameCount = 0;
    this.currentFrame = 0;
    this.frameRate = 10;
    this.state = 'idle';
    this.image;
    this.visible = true;
    this.speed = 0;
    this.max_speed = 10;
    this.acceleration = 2;
  }
  GameEntity.prototype.update = function() {};
  GameEntity.prototype.move = function(X, Y) {
    this.X = X;
    return this.Y = Y;
  };
  GameEntity.prototype.change_animation_state = function(state) {
    if (this.state === state) {
      return false;
    }
    this.frameCount = 0;
    this.currentFrame = 0;
    this.frame = 0;
    return this.state = state;
  };
  return GameEntity;
})();
Engine.Character = (function() {
  __extends(Character, Engine.GameEntity);
  function Character() {
    Character.__super__.constructor.apply(this, arguments);
  }
  return Character;
})();
Engine.Player = (function() {
  __extends(Player, Engine.Character);
  function Player() {
    this.look_up = __bind(this.look_up, this);
    this.crouch = __bind(this.crouch, this);
    this.jump = __bind(this.jump, this);
    this.move_left = __bind(this.move_left, this);
    this.move_right = __bind(this.move_right, this);
    this.update = __bind(this.update, this);    Player.__super__.constructor.apply(this, arguments);
  }
  Player.prototype.update = function() {
    var _ref;
    Player.__super__.update.apply(this, arguments);
    this.X += this.speed;
    if (this.jumping) {} else if (this.moving_left && !this.moving_right) {
      this.change_animation_state('move_left');
    } else if (this.moving_right && !this.moving_left) {
      this.change_animation_state('move_right');
    } else {
      this.change_animation_state('idle');
    }
    if (!this.jumping && this.speed !== 0) {
      this.speed = this.speed * 0.8;
      if ((-this.acceleration + 1 < (_ref = this.speed) && _ref < this.acceleration - 1)) {
        return this.speed = 0;
      }
    }
  };
  Player.prototype.move_right = function(key) {
    if (key) {
      this.moving_right = true;
      if (this.speed <= this.max_speed) {
        return this.speed += this.acceleration;
      }
    } else {
      return this.moving_right = false;
    }
  };
  Player.prototype.move_left = function(key) {
    if (key) {
      this.moving_left = true;
      if (this.speed >= -this.max_speed) {
        return this.speed -= this.acceleration;
      }
    } else {
      return this.moving_left = false;
    }
  };
  Player.prototype.jump = function(key) {
    if (key) {
      return this.is_jumping = true;
    } else {
      return this.is_jumping = false;
    }
  };
  Player.prototype.crouch = function(key) {
    if (key && !this.jumping && !this.falling && !this.moving_left && !this.moving_right) {
      return this.is_crouching = true;
    } else {
      return this.is_crouching = false;
    }
  };
  Player.prototype.look_up = function() {
    if (key && !this.jumping && !this.falling) {
      return this.is_looking_up = true;
    } else {
      return this.is_looking_up = false;
    }
  };
  return Player;
})();
Engine.NPC = (function() {
  __extends(NPC, Engine.Character);
  function NPC() {
    NPC.__super__.constructor.apply(this, arguments);
  }
  return NPC;
})();
Engine.Enemy = (function() {
  __extends(Enemy, Engine.Character);
  function Enemy() {
    Enemy.__super__.constructor.apply(this, arguments);
  }
  return Enemy;
})();
Engine.GameEvent = (function() {
  __extends(GameEvent, Engine.GameEntity);
  function GameEvent() {
    GameEvent.__super__.constructor.apply(this, arguments);
  }
  return GameEvent;
})();
Engine.GameObject = (function() {
  __extends(GameObject, Engine.GameEntity);
  function GameObject() {
    GameObject.__super__.constructor.apply(this, arguments);
  }
  return GameObject;
})();
Engine.Item = (function() {
  __extends(Item, Engine.GameObject);
  function Item() {
    Item.__super__.constructor.apply(this, arguments);
  }
  return Item;
})();
Engine.Scenario = (function() {
  __extends(Scenario, Engine.GameEntity);
  function Scenario() {
    Scenario.__super__.constructor.apply(this, arguments);
    this.image;
  }
  return Scenario;
})();
Background = (function() {
  __extends(Background, Engine.Scenario);
  function Background() {
    Background.__super__.constructor.apply(this, arguments);
  }
  return Background;
})();