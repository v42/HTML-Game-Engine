class myGame extends Engine
	constructor:->
		super
		@CLEAR_COLOR = '#ab7'
		@TICKS_PER_SECOND = 30
		
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
			
		p2 = new Engine.Player
		p2.width = 3
		p2.height = 5
		p2.X = 10
		p2.Y = 200
		p2.scale = 5
		p2.img = 'player.png'
		p2.animations = 
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
		p2.keys = 
			38: 'grab'
			37: 'move_left'
			40: 'crouch'
			39: 'move_right'
			18: 'jump'
			
		@ENTITIES = [p1]
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