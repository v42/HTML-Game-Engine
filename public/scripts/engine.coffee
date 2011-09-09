class Engine
	constructor:(@game)->
		@TICKS_PER_SECOND = game.TICKS_PER_SECOND or= 25
		@SKIP_TICKS = 1000 / @TICKS_PER_SECOND
		@MAX_FRAMESKIP = game.MAX_FRAMESKIP or= 10
		@MAX_FPS = game.MAX_FPS or= 60
		@UPDATE_RATIO = if @MAX_FPS>@TICKS_PER_SECOND then @MAX_FPS else @TICKS_PER_SECOND
		@atualizou = 0
		@mostrou = 0
		
	start:=>
		console.log "Engine Started!"
		@loops = 0
		@game.is_running = true
		@next_game_tick = @get_tick_count()
		@game_loop()
		return true
	
	# Game Loop implement based on deWiTTERS'
	# Constant Game Speed independent of Variable FPS
	# http://www.koonsolo.com/news/dewitters-gameloop/
	# @return interpolation between the running game and the update ratio
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
		#console.log "atualizou"
		
	display_game:(interpolation)=>
		@mostrou++
		console.log interpolation
		#console.log "mostrou"