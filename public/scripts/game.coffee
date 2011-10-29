class myGame extends Engine
	constructor:->
		super
		@CLEAR_COLOR = '#2EB5D9'
		@TICKS_PER_SECOND = 60
		
		###
		PLAYERS
		###
		
		p1 = new Engine.Player
		p1.width = 3
		p1.height = 5
		p1.X = 10
		p1.Y = 150
		p1.scale = 5
		p1.img = 'player.png'
		p1.animations = 
			idle:
				frames: [0]
			move_left:
				frames: [1,0,2,0]
				looping: true
			move_right:
				frames: [2,0,1,0]
				looping: true
			jumping:
				frames: [4,1]
			falling:
				frames: [5]
			crouch:
				frames: [4]
			grab:
				frames: [3]
			falling_deep:
				frames: [1,2]
				looping: true
			felt:
				frames: [4]
		p1.keys = 
			87: 'grab'
			65: 'move_left'
			83: 'crouch'
			68: 'move_right'
			32: 'jump'
		
		###
		p2.keys = 
			38: 'grab'
			37: 'move_left'
			40: 'crouch'
			39: 'move_right'
			18: 'jump'
		###
			
		@PLAYERS = [p1]
		
		###
		LEVEL
		###
		
		l1 = new Engine.Level
		l1.img = 'level.png'
		l1.scale = 5
		l1.tilemap = [
			 [0]
			,[0]
			,[0]
			,[0]
			,[0]
			,[0]
			,[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,17,18,19,20]
			,[1, 2, 2, 2, 2, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,27,28,29,30]
			,[4, 4, 4, 4, 4, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,37,38,39,40]
			,[4, 4, 4, 4, 4, 4, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,31,32,32,32,32,32]
		]
		
		@LEVELS = [l1]
		
		###
		BACKGROUND
		###
		
		b1 = new Engine.Background
		b1.img = 'level.png'
		b1.tilemap = [
			 [0]
			,[0]
			,[0]
			,[0]
			,[0]
			,[0]
		]
			
		#@KEYS['p'] = @pause
		
	state_machine:=>
		switch @STATE.name
			when 'Game'
				@playing()
				break
		return #bacon
		
	playing:=>
		#console.log 'pew'
game = new myGame
game.start()