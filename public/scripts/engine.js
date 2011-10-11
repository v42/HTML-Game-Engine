var Background, Character, Enemy, Engine, GameEntity, GameEvent, GameObject, Item, NPC, Player, Scenary;
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
    this.change_obj_state = __bind(this.change_obj_state, this);
    this.update_objects = __bind(this.update_objects, this);
    this.state_machine = __bind(this.state_machine, this);
    this.update_game = __bind(this.update_game, this);
    this.calculate_fps = __bind(this.calculate_fps, this);
    this.tic_tac = __bind(this.tic_tac, this);
    this.stop = __bind(this.stop, this);
    this.game_loop = __bind(this.game_loop, this);
    this.start = __bind(this.start, this);    this.TICKS_PER_SECOND = 25;
    this.SKIP_TICKS = 1000 / this.TICKS_PER_SECOND;
    this.MAX_FRAMESKIP = 10;
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
    this.imagesPath = "/assets/images/";
    this.soundPath = "/assets/sound/";
  }
  Engine.prototype.start = function() {
    var now;
    this.loops = 0;
    this.is_running = true;
    console.log("Engine Started!");
    this.load_entities();
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
      console.log("atualizou " + this.atualizou + " vezes");
      console.log("mostrou " + this.mostrou + " quadros");
    }
  };
  Engine.prototype.stop = function() {
    console.log("Engine Stopping...");
    this.is_running = false;
    return !this.is_running;
  };
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
    this.state_machine();
    this.update_objects();
  };
  Engine.prototype.state_machine = function() {};
  Engine.prototype.update_objects = function() {
    var obj, _i, _len, _ref;
    _ref = this.ENTITIES;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      obj = _ref[_i];
      obj.frameCount = obj.frameCount < obj.stateMap[obj.state].length - 1 ? obj.frameCount + 1 : 0;
      obj.frame = obj.stateMap[obj.state][obj.frameCount];
      return;
    }
  };
  Engine.prototype.change_obj_state = function(obj, state) {
    obj.state = state;
    obj.frame = obj.stateMap[state][0];
    return obj.frameCount = 0;
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
GameEntity = (function() {
  function GameEntity() {
    this.id;
    this.x;
    this.y;
    this.width;
    this.height;
    this.scale;
    this.frame;
    this.frameCount;
    this.state;
    this.image;
    this.visible = true;
  }
  return GameEntity;
})();
Character = (function() {
  __extends(Character, GameEntity);
  function Character() {
    Character.__super__.constructor.apply(this, arguments);
    this.life;
    this.vulnerable;
  }
  return Character;
})();
Player = (function() {
  __extends(Player, Character);
  function Player() {
    Player.__super__.constructor.apply(this, arguments);
  }
  return Player;
})();
NPC = (function() {
  __extends(NPC, Character);
  function NPC() {
    NPC.__super__.constructor.apply(this, arguments);
  }
  return NPC;
})();
Enemy = (function() {
  __extends(Enemy, Character);
  function Enemy() {
    Enemy.__super__.constructor.apply(this, arguments);
  }
  return Enemy;
})();
GameEvent = (function() {
  __extends(GameEvent, GameEntity);
  function GameEvent() {
    GameEvent.__super__.constructor.apply(this, arguments);
  }
  return GameEvent;
})();
GameObject = (function() {
  __extends(GameObject, GameEntity);
  function GameObject() {
    GameObject.__super__.constructor.apply(this, arguments);
  }
  return GameObject;
})();
Item = (function() {
  __extends(Item, GameObject);
  function Item() {
    Item.__super__.constructor.apply(this, arguments);
  }
  return Item;
})();
Scenary = (function() {
  __extends(Scenary, GameEntity);
  function Scenary() {
    Scenary.__super__.constructor.apply(this, arguments);
    this.image;
  }
  return Scenary;
})();
Background = (function() {
  __extends(Background, Scenary);
  function Background() {
    Background.__super__.constructor.apply(this, arguments);
  }
  return Background;
})();