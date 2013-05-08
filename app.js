/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * Game Points server
 */

// Module dependencies.
var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  game = require('./routes/game');
  contact = require('./routes/contact');
  http = require('http'),
  path = require('path');

var app = express(),
  store = new express.session.MemoryStore;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser()); 
app.use(express.session({ secret: 'glorianayara', store: store }));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
};

function checkAuth(req, res, next) {
  // console.log(req.session);
  if (typeof req.session.user === "undefined" || req.session.user.active == 0) {
    res.send('You are not authorized to view this page');
  } else {
    next();
  }
};

app.get('/auth/twitter', user.twitter);
app.get('/auth/twitter/callback', user.twittercallback);

app.get('/', routes.admin);//game.index);


app.get('/admin', routes.admin);
app.post('/admin/login', user.login);
app.get('/admin/signup', routes.signup);
app.post('/admin/signup', user.signup)
app.get('/admin/whoweare', routes.whoweare);
app.get('/admin/howitworks', routes.howitworks);
app.get('/admin/microprovider', routes.microprovider);
app.get('/admin/contact', routes.contact);
app.post('/admin/contact', contact.sendemail);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Game Points server listening on port ' + app.get('port'));
});
