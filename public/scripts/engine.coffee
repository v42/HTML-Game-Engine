class Engine
	constructor:->
		#framerate options
		@TICKS_PER_SECOND = 25
		@SKIP_TICKS = 1000 / @TICKS_PER_SECOND
		@MAX_FRAMESKIP = 1
		@MAX_FPS = 60
		@UPDATE_RATIO = if @MAX_FPS>@TICKS_PER_SECOND then @MAX_FPS else @TICKS_PER_SECOND
		
		#canvas settings
		@CANVAS_ID = 'game_canvas'
		@CLEAR_COLOR = '#000'
		@CANVAS = document.getElementById @CANVAS_ID
		@CANVAS.width = 640
		@CANVAS.height = 480
		@ctx = @CANVAS.getContext '2d'
		@ctx.mozImageSmoothingEnabled = false
		@ctx.font = '12px/1.5 Andale Mono'
		
		#game state
		@STATE = 
			name: 'Game'
			loaded: false
		@BACKGROUND_ENTITIES = []
		@LEVEL_ENTITIES = []
		
		#keys
		@KEYS = {}
		@KEY_PRESSED = {}
		
		#assets
		@imagesPath = "/assets/images/"
		@soundsPath = "/assets/sound/"
		
		#sounds
		@SOUNDS = {}
		
		#world settings
		@WORLD = 
			width: 0
			height: 0
			
		@SCROLL = 
			X:0,
			Y:0
		
	start:=>
		if smLoaded?
			@loops = 0
			@is_running = true
			console.log "Engine Started!"
			@load_entities()
			@bind_keys()
			now = new Date()
			@first_tick = now.getTime()
			@tic_tac()
			@next_game_tick = @tick
			@game_loop()
			@calculate_fps()
			return true
		else
			@clear '#000'
			setTimeout @start, 20
			return false
	
	# Game Loop implement based on deWiTTERS'
	# Constant Game Speed independent of Variable FPS
	# http://www.koonsolo.com/news/dewitters-gameloop/
	game_loop:=>
		if @is_running
			@tic_tac()
			if @tick > @next_game_tick
				@update_game()
				@next_game_tick += @SKIP_TICKS
			
			@interpolation = parseFloat(@tick + @SKIP_TICKS - @next_game_tick)/parseFloat(@SKIP_TICKS)
			@display_game()
			
			setTimeout @game_loop, 1000 / @UPDATE_RATIO
			return
		else
			console.log "Engine Stopped!"
			return

	stop:=>
		console.log "Engine Stopping..."
		@is_running = false
		return !@is_running
		
	play_sound:(filename)=>
		soundManager.play filename, @soundsPath + filename
		
	bind_keys:=>
		document.onkeydown = @key_down
		document.onkeyup = @key_up
		return
		
	key_down:(event)=>
		@KEY_PRESSED[event.keyCode] = true
		
	key_up:(event)=>
		@KEY_PRESSED[event.keyCode] = false
		@KEYS[event.keyCode] false if @KEYS[event.keyCode]?
		
	process_inputs:=>
		for key, action of @KEYS
			action true if @KEYS[key]? and @KEY_PRESSED[key]
		
	pause:=>
		
	move:(obj, direction)=>
		
	tic_tac:=>
		now = new Date()
		@tick = now.getTime() - @first_tick
		@animation_tick = @tick/1000
	
	calculate_fps:=>
		@fps = @frames
		@frames = 0
		#console.log 'FPS: ' + @fps if @fps
		setTimeout @calculate_fps, 1000
	
	update_game:=>
		@process_inputs()
		@update_entities()
		@update_game_scroll()
		@state_machine()
		return
		
	update_game_scroll:=>
		x = 0
		y = 0
		for obj in @PLAYERS
			x+= obj.X
			y+= obj.Y
		
		x = x/@PLAYERS.length
		y = y/@PLAYERS.length
		
		cw2 = @CANVAS.width/2
		ch2 = @CANVAS.height/2
		
		if x>cw2
			@SCROLL.X = if x-cw2 < @WORLD.width then x-cw2 else @WORLD.width
		else @SCROLL.X =0
		
		if y>ch2
			@SCROLL.Y = if y-ch2 < @WORLD.height then y-ch2 else @WORLD.height
		else @SCROLL.Y = 0
		
		@SCROLL.X = @SCROLL.X | 0
		@SCROLL.Y = @SCROLL.Y | 0
		
	state_machine:=>
		return
		
	update_entities:=>
		for b in @BACKGROUND_ENTITIES
			b.update()
		for l in @LEVEL_ENTITIES
			l.update()
		for p in @PLAYERS
			for l in @LEVEL_ENTITIES
				p.check_colision l
				p.is_over l
			p.update()
		return
		
	update_animation:(obj)=>
		if obj.frameCount > @MAX_FPS/obj.frameRate
			obj.currentFrame = if obj.currentFrame < obj.animations[obj.state].frames.length-1 then obj.currentFrame+1 else if obj.animations[obj.state].looping then 0 else obj.currentFrame
			obj.frameCount = 0
		obj.frame = obj.animations[obj.state].frames[obj.currentFrame]
		obj.frameCount++
		return
		
	clear:(color)=>
		@ctx.fillStyle = color
		@ctx.beginPath()
		@ctx.rect 0, 0, @CANVAS.width, @CANVAS.height
		@ctx.closePath()
		@ctx.fill()
		
	display_game:(interpolation)=>
		@clear @CLEAR_COLOR if @CLEAR_COLOR?
		for obj in @BACKGROUND_ENTITIES
			#@update_animation obj
			@draw obj if obj.visible
		for obj in @LEVEL_ENTITIES
			#@update_animation obj
			@draw obj if obj.visible
		for obj in @PLAYERS
			@update_animation obj
			@draw obj if obj.visible
		if @DEBUG>=1
			if @fps
				@ctx.fillStyle = 'white'
				@ctx.fillText @fps + ' fps', 10, 20
		@frames++
		return
	
	draw:(obj)=>
		try
			if obj.x?
				@ctx.drawImage obj.image, obj.width*obj.x, obj.height*obj.y, obj.width, obj.height, obj.X-obj.w2-@SCROLL.X, obj.Y-obj.h2-@SCROLL.Y, obj.width*obj.scale, obj.height*obj.scale
			else
				@ctx.drawImage obj.image, obj.width*obj.frame, 0, obj.width, obj.height, obj.X+(obj.speed*@interpolation*obj.interpolate)-obj.w2-@SCROLL.X, obj.Y-obj.h2- @SCROLL.Y, obj.width*obj.scale, obj.height*obj.scale
			if @DEBUG>=2
				@ctx.beginPath()
				@ctx.fillStyle = 'rgba(255, 0, 0, 1)'
				@ctx.fillRect obj.X-@SCROLL.X, obj.Y-@SCROLL.Y, 1, 1
				@ctx.closePath()
				@ctx.fill()
		catch e
			obj.visible = false
			console.log e
					
	load_entities:=>
		@STATE.loaded = false
		for obj in @BACKGROUNDS
			@load_obj obj, 'background'
		for obj in @LEVELS
			@load_obj obj, 'level'
		for obj in @PLAYERS
			@load_obj obj, 'player'
	
	load_obj:(obj, type)=>
		obj.h2 = obj.height*obj.scale/2 | 0
		obj.w2 = obj.width*obj.scale/2 | 0
		obj.X+=obj.w2
		obj.Y+=obj.h2
		if obj.img?
			obj.image = new Image
			obj.image.onload = ->
				obj.image.loaded = true
			obj.image.src = @imagesPath + obj.img
		if obj.sounds?
			for k,s of obj.sounds
					obj.sound[k] = soundManager.createSound
						id: k
						autoload: true
						multiShot: true
						url: @soundsPath + s
		if type=='player' and obj.keys?
			for k, a of obj.keys
				@KEYS[k] = obj[a]
				@KEY_PRESSED[k] = false
		if obj.tilemap?
			x = 0
			y = 0
			ws = obj.width*obj.scale
			tiles_count = obj.image_width/obj.width
			for h in obj.tilemap
				for l in h
					if l != 0
						o = new Engine.GameEntity
						o.type = 'level'
						o.width = obj.width
						o.height = obj.height
						o.image = obj.image
						o.scale = obj.scale
						o.h2 = obj.h2
						o.w2 = obj.w2
						o.frameRate = obj.frameRate
						o.x = l%tiles_count-1
						o.y = (l-(l%tiles_count))/tiles_count
						if o.x == -1
							o.x = tiles_count-1
							o.y = o.y-1
						o.X = x*ws+obj.w2
						o.Y = y*ws+obj.h2
						@BACKGROUND_ENTITIES.push o if type=='background'
						@LEVEL_ENTITIES.push o if type=='level'
					x++
				@WORLD.width = x*obj.scale if x*obj.scale>@WORLD.width
				x = 0
				y++
			@WORLD.height = y*obj.scale if y*obj.scale>@WORLD.height
		
class Engine.GameEntity
	constructor:->
		@id
		@X
		@Y
		@width
		@height
		@scale = 1
		@frame = 0
		@frameCount = 0
		@currentFrame = 0
		@frameRate = 10
		@state = 'idle'
		@interpolate = 0
		@image
		@visible = true
		@animations =
			idle:
				frames: [0]
		
	update:=>
		
	get_min:(xy)=>
		return @X - @width*@scale/2  if xy == 'X'
		return @Y - @height*@scale/2
		
	get_max:(xy)=>
		return @X + @width*@scale/2  if xy == 'X'
		return @Y + @height*@scale/2
	
	check_colision:(obj)=>
		return false if @w2+obj.w2 < Math.abs(@X - obj.X)
		return false if @h2+obj.h2 < Math.abs(@Y - obj.Y)
		angle = (Math.atan2 obj.Y - @Y, obj.X - @X)*180/Math.PI
		angle+= 360 if angle < 0
		
		if 45 <= angle <= 135 then from = 'bottom' 
		else if 135 < angle < 225 then from = 'left' 
		else if 225 <= angle <= 315 then from = 'top' 
		else from = 'right'
		
		@handle_colision obj, from, angle | 0
	
	handle_colision:(obj, from, angle)=>
		
	move:(X,Y)=>
		@X = X
		@Y = Y
		
	change_animation_state:(state)=>
		return false if @state == state
		@frameCount = 0
		@currentFrame = 0
		@frame = 0
		@state = state

class Engine.Character extends Engine.GameEntity
	constructor:->
		super
		@speed = 0
		@speed_y = 0
		@attrition = 0.8
		@gravity = @default_gravity = 9.8/3 
		@jump_limit = @gravity * 5
		@max_speed = 10
		@acceleration = 2
		@looking_up = false
		@sound = {}

class Engine.Level extends Engine.GameEntity
	constructor:->
		super
		@tilemap
		@image_width
		
class Engine.Background extends Engine.GameEntity
	constructor:->
		super
		@depth
		@tilemap
		@repeatable
	
class Engine.Player extends Engine.Character
	constructor:->
		super
		
	update:=>
		super
		@X += @speed if not @handling_col_x
		@Y += @speed_y if not @handling_col_y
		
		if @jumping
			@change_animation_state 'jumping'
			@gravity = @default_gravity
		else if @falling && @speed_y > 0
			@change_animation_state 'falling'
		else if @moving_left && not @moving_right
			@change_animation_state 'move_left'
		else if @moving_right && not @moving_left
			@change_animation_state 'move_right'
		else if @grabbing
			@change_animation_state 'grab'
		else if @crouching
			@change_animation_state 'crouch'
		else
			@change_animation_state 'idle'
			
		if not @has_floor
			@falling = true
			@gravity = @default_gravity
		else
			@gravity = 0
		
		if not @jumping and @speed != 0
			@speed = @speed * @attrition
			@speed = 0 if -@acceleration+1.5 < @speed < @acceleration-1.5
		
		if @falling
			@speed_y += @gravity
		
		@has_floor = false
			
		@X = @X | 0
		@Y = @Y | 0
		
	handle_colision:(obj, from, angle)=>
		switch obj.type
			when 'level'
				#console.log 'handling colision on ' + from
				switch from
					when 'bottom'
						return false if @handling_col_y
						@handling_col_y = obj
						@Y = obj.Y-obj.h2-@h2-1
						@falling = false
						@jumping = false
						@speed_y = 0
						@gravity = 0
						@handling_col_y = false
					when 'top'
						return false if @handling_col_y
						@handling_col_y = obj
						@falling = true
						@jumping = false
						@speed_y = 1
						@gravity = @default_gravity
						@Y = obj.Y+obj.h2+@h2+1
						@handling_col_y = false
					when 'left'
						return false if @handling_col_x
						@handling_col_x = obj
						@speed_x = 0
						@X=obj.X+obj.w2+@w2+1
						@handling_col_x = false
					when 'right'
						return false if @handling_col_x
						@handling_col_x = obj
						@speed_x = 0
						@X = obj.X-obj.w2-@w2-1
						@handling_col_x = false
			
	is_over:(obj)=>
		return false if @w2+obj.w2 < Math.abs(@X - obj.X)
		return false if @h2+obj.h2 < Math.abs(@Y - obj.Y)-1
		return false if @Y+@h2-1 > obj.Y-obj.h2
		@jumping = false
		@falling = false
		@has_floor = true
		
	move_right:(key)=>
		if key
			@moving_right = true
			@speed += @acceleration if @speed <= @max_speed
		else
			@moving_right = false
		
	move_left:(key)=>
		if key
			@moving_left = true
			@speed -= @acceleration if @speed >= -@max_speed
		else
			@moving_left = false
		
			
	jump:(key)=>
		if key
			@gravity = @default_gravity
			if not @falling and @speed_y > -@jump_limit
				@sound['jump'].play() if @sound['jump']?
				@speed_y -= @jump_limit/2
			else
				@jumping = false
				@falling = true
		else
			@jumping = false
			@falling = true
			@change_animation_state 'falling'
			
	crouch:(key)=>
		if key && not @jumping && not @falling && not @moving_left && not @moving_right
			@crouching = true 
		else
			@crouching = false
	
	grab:(key)=>
		if key && not @jumping && not @falling
			@grabbing = true 
		else
			@grabbing = false
class Engine.NPC extends Engine.Character
	constructor:->
		super

class Engine.Enemy extends Engine.Character
	constructor:->
		super

class Engine.GameEvent extends Engine.GameEntity
	constructor:->
		super
		
class Engine.GameObject extends Engine.GameEntity
	constructor:->
		super

class Engine.Item extends Engine.GameObject
	constructor:->
		super

class Engine.Scenario extends Engine.GameEntity
	constructor:->
		super
		@image

class Engine.Background extends Engine.Scenario
	constructor:->
		super