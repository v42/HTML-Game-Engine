game = new Game
game.MAX_FPS = 60
engine = new Engine game
engine.start()
setTimeout engine.stop, 5000