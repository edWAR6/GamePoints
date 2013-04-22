
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express(),
  store = new express.session.MemoryStore;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({ secret: 'glorianayara', store: store }));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
};

function checkAuth(req, res, next) {
  // console.log(req.session);
  if (typeof req.session.user === "undefined") {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
};

app.get('/', routes.index);
app.get('/admin', routes.admin);
app.get('/admin/whoweare', routes.whoweare);
app.get('/admin/howitworks', routes.howitworks);
app.get('/admin/microprovider', checkAuth, routes.microprovider);
app.get('/admin/signup', routes.signup);


app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
