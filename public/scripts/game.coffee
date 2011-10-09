class myGame extends Engine
	constructor:->
		super
		p1 = {}
		p1.visible = true
		p1.width = 3
		p1.height = 5
		p1.X = 10
		p1.Y = 10
		p1.scale = 5
		p1.state = 'stand'
		p1.frame = 0
		p1.frameCount = 0
		p1.img = 'player.png'
		p1.stateMap = 
			stand:
				[0]
			walk_left:
				[0,1,0,2]
			walk_right:
				[0,2,0,1]
			jumping:
				[4,1,1,5]
			crouching:
				[4]
			grabbing:
				[3]
			falling:
				[1,2]
			felt:
				[4]
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