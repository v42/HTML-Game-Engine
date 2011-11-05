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
		@soundPath = "/assets/sound/"
		
		#world settings
		@WORLD = 
			width: 0
			height: 0
			
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
		for obj in @BACKGROUNDS
			obj.update()
		for obj in @LEVELS
			obj.update()
		for obj in @PLAYERS
			obj.update()
		return
		
	update_animation:(obj)=>
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
		for obj in @BACKGROUND_ENTITIES
			@update_animation obj
			@draw obj if obj.visible
		for obj in @LEVEL_ENTITIES
			@update_animation obj
			@draw obj if obj.visible
		for obj in @PLAYERS
			@update_animation obj
			@draw obj if obj.visible
		#for obj in @ENTITIES
		#	@draw obj if obj.visible
		#	#console.log interpolation
		@frames++
		return
	
	draw:(obj)=>
		try
			if obj.x?
				@ctx.drawImage obj.image, obj.width*obj.x, obj.height*obj.y, obj.width, obj.height, obj.X - @SCROLL.X, obj.Y - @SCROLL.Y, obj.width*obj.scale, obj.height*obj.scale
			else
				@ctx.drawImage obj.image, obj.width*obj.frame, 0, obj.width, obj.height, obj.X - @SCROLL.X, obj.Y - @SCROLL.Y, obj.width*obj.scale, obj.height*obj.scale
		catch e
			#obj.visible = false
			#console.log e
					
	load_entities:=>
		@STATE.loaded = false
		for obj in @BACKGROUNDS
			@load_obj obj, 'background'
		for obj in @LEVELS
			@load_obj obj, 'level'
		for obj in @PLAYERS
			@load_obj obj, 'player'
	
	load_obj:(obj, type)=>
		if obj.img?
			obj.image = new Image
			obj.image.onload = ->
				obj.image.loaded = true
			obj.image.src = @imagesPath + obj.img
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
						o.width = obj.width
						o.height = obj.height
						o.image = obj.image
						o.scale = obj.scale
						o.frameRate = obj.frameRate
						o.x = l%tiles_count-1
						o.y = (l-(l%tiles_count))/tiles_count
						if o.x == -1
							o.x = tiles_count-1
							o.y = o.y-1
						o.X = x*ws
						o.Y = y*ws
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
		@image
		@visible = true
		@animations =
			idle:
				frames: [0]
		
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
		@speed_y = 0
		@attrition = 0.8
		@gravity = 1
		@jump_limit = 10
		@max_speed = 20
		@acceleration = 3

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
		@X += @speed
		@Y += @speed_y
		if @jumping
			@change_animation_state 'jumping'
		else if @moving_left && not @moving_right
			@change_animation_state 'move_left'
		else if @moving_right && not @moving_left
			@change_animation_state 'move_right'
		else
			@change_animation_state 'idle'
			
		
		if not @jumping and @speed != 0
			@speed = @speed * @attrition
			@speed = 0 if -@acceleration+1.5 < @speed < @acceleration-1.5
		
		if @falling
			@speed_y += @gravity
			
		@X = @X | 0
		@Y = @Y | 0
		
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
			if not @falling and @speed_y > -@jump_limit
				@speed_y -= @jump_limit/2
			else
				@falling = true
		else
			@jumping = false
			@falling = true
			@change_animation_state 'falling'
			
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