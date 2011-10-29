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
		
		#game state
		@STATE = 
			name: 'Game'
			loaded: false
		@ENTITIES = []
		
		#keys
		@KEYS = {}
		@KEY_PRESSED = {}
		
		#assets
		@imagesPath = "/assets/images/"
		@soundPath = "/assets/sound/"
		
		#world settings
		@WORLD = 
			width: 1280
			height: 480
			
		@SCROLL = 
			X:0,
			Y:0
		
	start:=>
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
	
	# Game Loop implement based on deWiTTERS'
	# Constant Game Speed independent of Variable FPS
	# http://www.koonsolo.com/news/dewitters-gameloop/
	game_loop:=>
		if @is_running
			@tic_tac()
			@loops = 0
			if @tick > @next_game_tick && @loops < @MAX_FRAMESKIP
				@update_game()
				@next_game_tick += @SKIP_TICKS
				@loops++
			
			interpolation = parseFloat(@tick + @SKIP_TICKS - @next_game_tick)/parseFloat(@SKIP_TICKS)
			@display_game interpolation
			
			setTimeout @game_loop, 1000 / @UPDATE_RATIO
			return
		else
			console.log "Engine Stopped!"
			return

	stop:=>
		console.log "Engine Stopping..."
		@is_running = false
		return !@is_running
		
	bind_keys:=>
		document.onkeydown = @key_down
		document.onkeyup = @key_up
		return
		
	key_down:=>
		@KEY_PRESSED[event.keyCode] = true
		
	key_up:=>
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
		@state_machine()
		return

	state_machine:=>
		return
		
	update_entities:=>
		for obj in @ENTITIES
			obj.update()
		return
		
	update_animation:=>
		for obj in @ENTITIES
			if obj.frameCount > @MAX_FPS/obj.frameRate
				obj.currentFrame = if obj.currentFrame < obj.animations[obj.state].frames.length-1 then obj.currentFrame+1 else 0
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
		@update_animation()
		for obj in @ENTITIES
			@draw obj if obj.visible
			#console.log interpolation
		@frames++
		return
	
	draw:(obj)=>
		if obj.img
			try @ctx.drawImage obj.image, 0 + obj.width*obj.frame, 0, obj.width, obj.height, obj.X - @SCROLL.X, obj.Y - @SCROLL.Y, obj.width*obj.scale, obj.height*obj.scale
			catch e
				console.log e
					
	load_entities:=>
		@STATE.loaded = false
		for obj in @PLAYERS
			@load_obj obj
	
	load_obj:(obj)=>
		if obj.img?
			obj.image = new Image
			obj.image.onload = ->
				obj.image.loaded = true
				#console.log obj.img + " loaded!"
			obj.image.src = @imagesPath + obj.img
		if obj.keys?
			for k, a of obj.keys
				@KEYS[k] = obj[a]
				@KEY_PRESSED[k] = false
		@ENTITIES.push obj
		
class Engine.GameEntity
	constructor:->
		@id
		@X
		@Y
		@width
		@height
		@scale
		@frame = 0
		@frameCount = 0
		@currentFrame = 0
		@frameRate = 10
		@state = 'idle'
		@image
		@visible = true
	
	update:=>
		
	
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
		@max_speed = 10
		@acceleration = 2

class Engine.Level extends Engine.GameEntity
	constructor:->
		super
		@tilemap
		
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
		@X += @speed
			
		if @jumping
			#programming jump here...
		else if @moving_left && not @moving_right
			@change_animation_state 'move_left'
		else if @moving_right && not @moving_left
			@change_animation_state 'move_right'
		else
			@change_animation_state 'idle'
		
		if not @jumping and @speed != 0
			@speed = @speed * 0.8
			@speed = 0 if -@acceleration+1 < @speed < @acceleration-1
		
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
			@is_jumping = true
		else
			@is_jumping = false
			
	crouch:(key)=>
		if key && not @jumping && not @falling && not @moving_left && not @moving_right
			@is_crouching = true 
		else
			@is_crouching = false
	
	look_up:=>
		if key && not @jumping && not @falling
			@is_looking_up = true 
		else
			@is_looking_up = false
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