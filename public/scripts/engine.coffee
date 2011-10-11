class Engine
	constructor:->
		#framerate options
		@TICKS_PER_SECOND = 25
		@SKIP_TICKS = 1000 / @TICKS_PER_SECOND
		@MAX_FRAMESKIP = 10
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
		@ENTITIES = {}
		
		#assets
		@imagesPath = "/assets/images/"
		@soundPath = "/assets/sound/"
		
	start:=>
		@loops = 0
		@is_running = true
		console.log "Engine Started!"
		@load_entities()
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
			console.log "atualizou " + @atualizou + " vezes"
			console.log "mostrou " + @mostrou + " quadros"
			return

	stop:=>
		console.log "Engine Stopping..."
		@is_running = false
		return !@is_running
	
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
		@state_machine()
		@update_objects()
		return

	state_machine:=>
		return
		
	update_objects:=>
		#console.log @tick/1000
		#console.log @fps
		for obj in @ENTITIES
			obj.frameCount = if obj.frameCount < obj.stateMap[obj.state].length-1 then obj.frameCount+1 else 0
			obj.frame = obj.stateMap[obj.state][obj.frameCount]
			return
		
	change_obj_state:(obj, state)=>
		obj.state = state
		obj.frame = obj.stateMap[state][0]
		obj.frameCount = 0
		
	clear:(color)=>
		@ctx.fillStyle = color
		@ctx.beginPath()
		@ctx.rect 0, 0, @CANVAS.width, @CANVAS.height
		@ctx.closePath()
		@ctx.fill()
		
	display_game:(interpolation)=>
		@clear @CLEAR_COLOR if @CLEAR_COLOR?
		for obj in @ENTITIES
			@draw obj if obj.visible
			#console.log interpolation
		@frames++
		return
	
	draw:(obj)=>
		if obj.img
			try @ctx.drawImage obj.image, 0 + obj.width*obj.frame, 0, obj.width, obj.height, obj.X, obj.Y, obj.width*obj.scale, obj.height*obj.scale
			catch e
				console.log e
					
	load_entities:=>
		@STATE.loaded = false
		for obj in @ENTITIES
			if obj.img
				obj.image = new Image
				obj.image.onload = ->
					obj.image.loaded = true
					#console.log obj.img + " loaded!"
				obj.image.src = @imagesPath + obj.img
				
		@STATE.loaded = true
		#console.log 'loaded!'
		
class GameEntity
	constructor:->
		@id
		@x
		@y
		@width
		@height
		@scale
		@frame
		@frameCount
		@state
		@image
		@visible = true

class Character extends GameEntity
	constructor:->
		super
		@life
		@vulnerable
	
class Player extends Character
	constructor:->
		super

class NPC extends Character
	constructor:->
		super

class Enemy extends Character
	constructor:->
		super

class GameEvent extends GameEntity
	constructor:->
		super
		
class GameObject extends GameEntity
	constructor:->
		super

class Item extends GameObject
	constructor:->
		super

class Scenary extends GameEntity
	constructor:->
		super
		@image

class Background extends Scenary
	constructor:->
		super