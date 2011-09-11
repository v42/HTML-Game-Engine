class myGame extends Game
	constructor:->
		@MAX_FPS = 60
		@TICKS_PER_SECOND = 25
		
		@mahFlag = false
		@state = "start"
		
		@stateMachine =
			"start":
				@opening
			"game":
				@game
		
		@assets =
			imagesPath:
				"../assets/images/"
			soundPath:
				"../assets/sound/"
			start:
				images: ["sonic_title.jpg"]
			game:
				images: ["sonic_sprites.png", "sonic_tileset.png"]
	
	opening:=>
		return if @mahFlag
		@mahFlag = true
		setTimeOut @state = "game", 2*1000
		console.log "opening"
	
	game:=>
		return if not @mahFlag
		@mahFlag = false
		console.log "The Game!"
	
game = new myGame
engine = new Engine game
engine.start()
setTimeout engine.stop, 5*1000