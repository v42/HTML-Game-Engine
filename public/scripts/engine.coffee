class Engine
	# The game can have any of these settings:
	# - TICKS_PER_SECOND
	# - MAX_FRAMESKIP 
	constructor:(@game)->

	#return interpolation between the running game and the update ratio
	run:->
		# Game Loop implement on deWiTTERS'
		# Constant Game Speed independent of Variable FPS
		# http://www.koonsolo.com/news/dewitters-gameloop/
		
		float TICKS_PER_SECOND = this.game.TICKS_PER_SECOND or= 25, 
		SKIP_TICKS = 1000 / TICKS_PER_SECOND
		int MAX_FRAMESKIP = this.game.MAX_FRAMESKIP or= 5,
		loops = 0
		
		next_game_tick = get_tick_count()
		
		bool this.game.is_running = true
		console.log "Engine Started!"
		while this.game.is_running
			loops = 0
			
			while get_tick_count() > next_game_tick && loops < MAX_FRAMESKIP
				update_game()
				next_game_tick += SKIP_TICKS
				loops++
				
			interpolation = float get_tick_count() + SKIP_TICKS - next_game_tick/float SKIP_TICKS
			display_game interpolation
			
		console.log "Engine Stopped!"
		return true

	stop:->
		console.log "Engine Stopping..."
		this.game.game_is_running = false
		return !this.game.is_running
	
	get_tick_count:->
		now = new Date()
		return now.getTime()