#### Dependencies
express       = require 'express'
##mongoose      = require 'mongoose'
##MongoStore    = require 'connect-mongo'
##less          = require 'less'
jqtpl         = require 'jqtpl'
#sugar         = require 'sugar'

#### Server config
app = express.createServer()
app.configure ->
	app.set 'root', __dirname
	app.set 'view engine', 'html'
	app.register '.html', jqtpl.express

	app.use express.methodOverride()
	app.use express.bodyParser()
	app.use express.cookieParser()
	app.use express.session
		secret: 'mahsecret'
	###	store: new MongoStore
			db: 'engine'
			collection: 'sessions'###
	
	layoutBlock = ->
		a = []
		a.push = (item) ->
			Array::push.call a, item
			return ''
		return a
		
	layoutScripts = ->
		self = @
		@length = 0
	
	app.dynamicHelpers
		session: (req, res) ->
			return req.session
		errors: (req) ->
			return req.flash()
		route: (req) ->
			return req.route.path
		route_clean: (req) ->
			if req.url is '/'
				return 'index'
			else
				return  req.url.replace(/^\//, '').replace(/\//g, '-')
		scripts: ->
			return new layoutBlock

	app.use express.favicon()
	
#### Development config
# - disable static file cacheing
# - display errors on front-end
app.configure 'development', ->
	app.use express.static "#{__dirname}/public", maxAge: 0 #60*60*24*30*3 # 3 months
	app.use app.router
	app.use express.errorHandler showStack: true, dumpExceptions: true

#### Production config
# - increment cache duration
# - serve custom page for server errors
app.configure 'production', ->
	app.use express.static "#{__dirname}/public", maxAge: 60*60*24*30*3 # 3 months
	app.use app.router
	app.error (err, req, res) ->
		res.render '500',
			status: 500
			error: err


#### Application routes

#### Index

app.get '/', (req, res) ->
	res.render 'index'
	
app.get '/game2', (req,res) ->
	res.render 'game2'

app.get '/game3', (req,res) ->
	res.render 'game3'

app.get '/game4', (req,res) ->
	res.render 'game4'

# Route/file not found
# **Always keep this as the last route**
app.get '*'	, (req, res) ->
	res.render '404', {
		status: 404
	}

#### Server start-up
app.listen parseInt(process.env.PORT || 4242)
console.log "Listening on port #{app.address().port}"