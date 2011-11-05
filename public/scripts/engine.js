var Engine;
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
    this.load_obj = __bind(this.load_obj, this);
    this.load_entities = __bind(this.load_entities, this);
    this.draw = __bind(this.draw, this);
    this.display_game = __bind(this.display_game, this);
    this.clear = __bind(this.clear, this);
    this.update_animation = __bind(this.update_animation, this);
    this.update_entities = __bind(this.update_entities, this);
    this.state_machine = __bind(this.state_machine, this);
    this.update_game_scroll = __bind(this.update_game_scroll, this);
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
    this.ctx.mozImageSmoothingEnabled = false;
    this.STATE = {
      name: 'Game',
      loaded: false
    };
    this.BACKGROUND_ENTITIES = [];
    this.LEVEL_ENTITIES = [];
    this.KEYS = {};
    this.KEY_PRESSED = {};
    this.imagesPath = "/assets/images/";
    this.soundPath = "/assets/sound/";
    this.WORLD = {
      width: 0,
      height: 0
    };
    this.SCROLL = {
      X: 0,
      Y: 0
    };
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
    document.onkeydown = this.key_down;
    document.onkeyup = this.key_up;
  };
  Engine.prototype.key_down = function(event) {
    return this.KEY_PRESSED[event.keyCode] = true;
  };
  Engine.prototype.key_up = function(event) {
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
    this.update_game_scroll();
    this.state_machine();
  };
  Engine.prototype.update_game_scroll = function() {
    var ch2, cw2, obj, x, y, _i, _len, _ref;
    x = 0;
    y = 0;
    _ref = this.PLAYERS;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      x += obj.X;
      y += obj.Y;
    }
    x = x / this.PLAYERS.length;
    y = y / this.PLAYERS.length;
    cw2 = this.CANVAS.width / 2;
    ch2 = this.CANVAS.height / 2;
    if (x > cw2) {
      this.SCROLL.X = x - cw2 < this.WORLD.width ? x - cw2 : this.WORLD.width;
    } else {
      this.SCROLL.X = 0;
    }
    if (y > ch2) {
      this.SCROLL.Y = y - ch2 < this.WORLD.height ? y - ch2 : this.WORLD.height;
    } else {
      this.SCROLL.Y = 0;
    }
    this.SCROLL.X = this.SCROLL.X | 0;
    return this.SCROLL.Y = this.SCROLL.Y | 0;
  };
  Engine.prototype.state_machine = function() {};
  Engine.prototype.update_entities = function() {
    var obj, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
    _ref = this.BACKGROUNDS;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      obj.update();
    }
    _ref2 = this.LEVELS;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      obj = _ref2[_j];
      obj.update();
    }
    _ref3 = this.PLAYERS;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      obj = _ref3[_k];
      obj.update();
    }
  };
  Engine.prototype.update_animation = function(obj) {
    if (obj.frameCount > this.MAX_FPS / obj.frameRate) {
      obj.currentFrame = obj.currentFrame < obj.animations[obj.state].frames.length - 1 ? obj.currentFrame + 1 : 0;
      obj.frameCount = 0;
    }
    obj.frame = obj.animations[obj.state].frames[obj.currentFrame];
    obj.frameCount++;
  };
  Engine.prototype.clear = function(color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.CANVAS.width, this.CANVAS.height);
    this.ctx.closePath();
    return this.ctx.fill();
  };
  Engine.prototype.display_game = function(interpolation) {
    var obj, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3;
    if (this.CLEAR_COLOR != null) {
      this.clear(this.CLEAR_COLOR);
    }
    _ref = this.BACKGROUND_ENTITIES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      this.update_animation(obj);
      if (obj.visible) {
        this.draw(obj);
      }
    }
    _ref2 = this.LEVEL_ENTITIES;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      obj = _ref2[_j];
      this.update_animation(obj);
      if (obj.visible) {
        this.draw(obj);
      }
    }
    _ref3 = this.PLAYERS;
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      obj = _ref3[_k];
      this.update_animation(obj);
      if (obj.visible) {
        this.draw(obj);
      }
    }
    this.frames++;
  };
  Engine.prototype.draw = function(obj) {
    try {
      if (obj.x != null) {
        return this.ctx.drawImage(obj.image, obj.width * obj.x, obj.height * obj.y, obj.width, obj.height, obj.X - this.SCROLL.X, obj.Y - this.SCROLL.Y, obj.width * obj.scale, obj.height * obj.scale);
      } else {
        return this.ctx.drawImage(obj.image, obj.width * obj.frame, 0, obj.width, obj.height, obj.X - this.SCROLL.X, obj.Y - this.SCROLL.Y, obj.width * obj.scale, obj.height * obj.scale);
      }
    } catch (e) {

    }
  };
  Engine.prototype.load_entities = function() {
    var obj, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
    this.STATE.loaded = false;
    _ref = this.BACKGROUNDS;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      this.load_obj(obj, 'background');
    }
    _ref2 = this.LEVELS;
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      obj = _ref2[_j];
      this.load_obj(obj, 'level');
    }
    _ref3 = this.PLAYERS;
    _results = [];
    for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
      obj = _ref3[_k];
      _results.push(this.load_obj(obj, 'player'));
    }
    return _results;
  };
  Engine.prototype.load_obj = function(obj, type) {
    var a, h, k, l, o, tiles_count, ws, x, y, _i, _j, _len, _len2, _ref, _ref2;
    if (obj.img != null) {
      obj.image = new Image;
      obj.image.onload = function() {
        return obj.image.loaded = true;
      };
      obj.image.src = this.imagesPath + obj.img;
    }
    if (type === 'player' && (obj.keys != null)) {
      _ref = obj.keys;
      for (k in _ref) {
        a = _ref[k];
        this.KEYS[k] = obj[a];
        this.KEY_PRESSED[k] = false;
      }
    }
    if (obj.tilemap != null) {
      x = 0;
      y = 0;
      ws = obj.width * obj.scale;
      tiles_count = obj.image_width / obj.width;
      _ref2 = obj.tilemap;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        h = _ref2[_i];
        for (_j = 0, _len2 = h.length; _j < _len2; _j++) {
          l = h[_j];
          if (l !== 0) {
            o = new Engine.GameEntity;
            o.width = obj.width;
            o.height = obj.height;
            o.image = obj.image;
            o.scale = obj.scale;
            o.frameRate = obj.frameRate;
            o.x = l % tiles_count - 1;
            o.y = (l - (l % tiles_count)) / tiles_count;
            if (o.x === -1) {
              o.x = tiles_count - 1;
              o.y = o.y - 1;
            }
            o.X = x * ws;
            o.Y = y * ws;
            if (type === 'background') {
              this.BACKGROUND_ENTITIES.push(o);
            }
            if (type === 'level') {
              this.LEVEL_ENTITIES.push(o);
            }
          }
          x++;
        }
        if (x * obj.scale > this.WORLD.width) {
          this.WORLD.width = x * obj.scale;
        }
        x = 0;
        y++;
      }
      if (y * obj.scale > this.WORLD.height) {
        return this.WORLD.height = y * obj.scale;
      }
    }
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
    this.scale = 1;
    this.frame = 0;
    this.frameCount = 0;
    this.currentFrame = 0;
    this.frameRate = 10;
    this.state = 'idle';
    this.image;
    this.visible = true;
    this.animations = {
      idle: {
        frames: [0]
      }
    };
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
    this.speed = 0;
    this.speed_y = 0;
    this.attrition = 0.8;
    this.gravity = 1;
    this.jump_limit = 10;
    this.max_speed = 20;
    this.acceleration = 3;
  }
  return Character;
})();
Engine.Level = (function() {
  __extends(Level, Engine.GameEntity);
  function Level() {
    Level.__super__.constructor.apply(this, arguments);
    this.tilemap;
    this.image_width;
  }
  return Level;
})();
Engine.Background = (function() {
  __extends(Background, Engine.GameEntity);
  function Background() {
    Background.__super__.constructor.apply(this, arguments);
    this.depth;
    this.tilemap;
    this.repeatable;
  }
  return Background;
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
    this.Y += this.speed_y;
    if (this.jumping) {
      this.change_animation_state('jumping');
    } else if (this.moving_left && !this.moving_right) {
      this.change_animation_state('move_left');
    } else if (this.moving_right && !this.moving_left) {
      this.change_animation_state('move_right');
    } else {
      this.change_animation_state('idle');
    }
    if (!this.jumping && this.speed !== 0) {
      this.speed = this.speed * this.attrition;
      if ((-this.acceleration + 1.5 < (_ref = this.speed) && _ref < this.acceleration - 1.5)) {
        this.speed = 0;
      }
    }
    if (this.falling) {
      this.speed_y += this.gravity;
    }
    this.X = this.X | 0;
    return this.Y = this.Y | 0;
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
      if (!this.falling && this.speed_y > -this.jump_limit) {
        return this.speed_y -= this.jump_limit / 2;
      } else {
        return this.falling = true;
      }
    } else {
      this.jumping = false;
      this.falling = true;
      return this.change_animation_state('falling');
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
Engine.Background = (function() {
  __extends(Background, Engine.Scenario);
  function Background() {
    Background.__super__.constructor.apply(this, arguments);
  }
  return Background;
})();