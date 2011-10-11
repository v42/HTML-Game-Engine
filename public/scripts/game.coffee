class myGame extends Engine
	constructor:->
		super
		@CLEAR_COLOR = '#ab7'
		p1 = new Player()
		p1.width = 3
		p1.height = 5
		p1.X = 10
		p1.Y = 10
		p1.scale = 5
		p1.state = 'move_right'
		p1.frameRate = '25'
		p1.img = 'player.png'
		p1.stateMap = 
			stand: [0]
			move_left: [0,1,0,2]
			move_right: [0,2,0,1]
			jump: [4,1,1,5]
			crouch: [4]
			grab: [3]
			fall: [1,2]
			felt: [4]
		p1.keys =
			'w': 'grab'
			'a': 'move_left'
			's': 'crouch'
			'd': 'move_right'
			'space': 'jump'
		@ENTITIES = [p1]
		
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