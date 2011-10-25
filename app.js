var MongoStore, app, express, jqtpl, less, mongoose;
express = require('express');
mongoose = require('mongoose');
MongoStore = require('connect-mongo');
less = require('less');
jqtpl = require('jqtpl');
app = express.createServer();
app.configure(function() {
  var layoutBlock, layoutScripts;
  app.set('root', __dirname);
  app.set('view engine', 'html');
  app.register('.html', jqtpl.express);
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'mahsecret',
    store: new MongoStore({
      db: 'engine',
      collection: 'sessions'
    })
  }));
  layoutBlock = function() {
    var a;
    a = [];
    a.push = function(item) {
      Array.prototype.push.call(a, item);
      return '';
    };
    return a;
  };
  layoutScripts = function() {
    var self;
    self = this;
    return this.length = 0;
  };
  app.dynamicHelpers({
    session: function(req, res) {
      return req.session;
    },
    errors: function(req) {
      return req.flash();
    },
    route: function(req) {
      return req.route.path;
    },
    route_clean: function(req) {
      if (req.url === '/') {
        return 'index';
      } else {
        return req.url.replace(/^\//, '').replace(/\//g, '-');
      }
    },
    scripts: function() {
      return new layoutBlock;
    }
  });
  return app.use(express.favicon());
});
app.configure('development', function() {
  app.use(express.static("" + __dirname + "/public", {
    maxAge: 0
  }));
  app.use(app.router);
  return app.use(express.errorHandler({
    showStack: true,
    dumpExceptions: true
  }));
});
app.configure('production', function() {
  app.use(express.static("" + __dirname + "/public", {
    maxAge: 60 * 60 * 24 * 30 * 3
  }));
  app.use(app.router);
  return app.error(function(err, req, res) {
    return res.render('500', {
      status: 500,
      error: err
    });
  });
});
app.get('/', function(req, res) {
  var _ref;
  if ((_ref = req.session.auth) != null ? _ref.loggedIn : void 0) {
    return res.redirect('/home');
  }
  return res.render('index');
});
app.get('*', function(req, res) {
  return res.render('404', {
    status: 404
  });
});
app.listen(parseInt(process.env.PORT || 4242));
console.log("Listening on port " + (app.address().port));