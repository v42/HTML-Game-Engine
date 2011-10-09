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
		@CANVAS = document.getElementById @CANVAS_ID
		@CANVAS.width = 640
		@CANVAS.height = 480
		@ctx = @CANVAS.getContext '2d'
		
		#game state
		@STATE = 
			name: 'Game'
			loaded: false
			
		#assets
		@imagesPath = "/assets/images/"
		@soundPath = "/assets/sound/"
		
	start:=>
		@loops = 0
		@is_running = true
		console.log "Engine Started!"
		@load_entities()
		@next_game_tick = @get_tick_count()
		@game_loop()
		return true
	
	# Game Loop implement based on deWiTTERS'
	# Constant Game Speed independent of Variable FPS
	# http://www.koonsolo.com/news/dewitters-gameloop/
	game_loop:=>
		if @is_running
			@loops = 0
			if @get_tick_count() > @next_game_tick && @loops < @MAX_FRAMESKIP
				@update_game()
				@next_game_tick += @SKIP_TICKS
				@loops++
			
			interpolation = parseFloat(@get_tick_count() + @SKIP_TICKS - @next_game_tick)/parseFloat(@SKIP_TICKS)
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
	
	get_tick_count:->
		now = new Date()
		tick = now.getTime()
		return tick
	
	update_game:=>
		@state_machine()
		return

	state_machine:=>
		return
		
	clear:(color)=>
		@ctx.fillStyle = color
		@ctx.beginPath()
		@ctx.rect 0, 0, @CANVAS.width, @CANVAS.height
		@ctx.closePath()
		@ctx.fill()
		
	display_game:(interpolation)=>
		@clear '#000'
		for obj in @ENTITIES
			@draw obj if obj.visible
			#console.log interpolation
		return
	
	draw:(obj)=>
		if obj.img
			try @ctx.drawImage obj.image, 0, 0, obj.width, obj.height, obj.X, obj.Y, obj.width*obj.scale, obj.height*obj.scale
			catch e
				console.log e
		
	load_entities:=>
		console.log "carregando entidades..."
		@STATE.loaded = false
		for obj in @ENTITIES
			if obj.img
				obj.image = new Image
				obj.image.onload = ->
					obj.image.loaded = true
					console.log obj.img + " loaded!"
				obj.image.src = @imagesPath + obj.img
				
		@STATE.loaded = true
		#console.log 'loaded!'
###		
class Entity
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

class Character extends Entity
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

class Event extends Entity
	constructor:->
		super
		
class Object extends Entity
	constructor:->
		super

class Item extends Object
	constructor:->
		super

class Scenary extends Entity
	constructor:->
		super
		@image

class Background extends Scenary
	constructor:->
		super
###