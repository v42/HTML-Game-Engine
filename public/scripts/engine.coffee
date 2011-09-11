class Engine
	constructor:(@game)->
		@TICKS_PER_SECOND = game.TICKS_PER_SECOND or= 25
		@SKIP_TICKS = 1000 / @TICKS_PER_SECOND
		@MAX_FRAMESKIP = game.MAX_FRAMESKIP or= 10
		@MAX_FPS = game.MAX_FPS or= 60
		@UPDATE_RATIO = if @MAX_FPS>@TICKS_PER_SECOND then @MAX_FPS else @TICKS_PER_SECOND
		@atualizou = 0
		@mostrou = 0
		#@assets = [image, audio]
		
	start:=>
		@loops = 0
		@game.is_running = true
		@next_game_tick = @get_tick_count()
		@game_loop()
		console.log "Engine Started!"
		return true
	
	# Game Loop implement based on deWiTTERS'
	# Constant Game Speed independent of Variable FPS
	# http://www.koonsolo.com/news/dewitters-gameloop/
	game_loop:=>
		if game.is_running
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
		game.is_running = false
		return !@game.is_running
	
	get_tick_count:->
		now = new Date()
		tick = now.getTime()
		return tick
	
	update_game:=>
		@atualizou++
		return
		
	display_game:(interpolation)=>
		@mostrou++
		#console.log interpolation
		return

	change_state:(state)=>
		@game.state = state
		@game.state.loaded = false
		imageBuffer = new Array
		for idx, image in @assets[state].images
			do (image) ->
				imageBuffer.images[idx] = new Image
				imageBuffer.images[idx].onload = ->
					this.loaded = true
				imageBuffer.images[idx].onerror =>
					console.log "erro na imagem #{image}"
		
		
		@game.state.loaded = true
		return true
		#
		#myImage = new Image
   		#img.onload = ->
		#	console.log "image #{image} loaded..."
		#img.src = @assets.imagesPath + @assets.image
		##