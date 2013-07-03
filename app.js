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
  admin = require('./routes/admin');
  http = require('http'),
  path = require('path'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy;

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

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

function checkAuth(req, res, next) {
  if (typeof req.session.user !== "undefined" && req.session.person.active == 1) {
    next();
  } else {
    res.render('admin/signup', { title: 'Game points - participa', message: 'Para poder administrar tu inventario debes primero solicitar el ingreso y ser aprobado.', user: {}, person: {}, administrator: {} });
  }
};

app.get('/auth/twitter', user.twitter);
app.get('/auth/twitter/callback', user.twittercallback);

app.get('/', routes.index);


app.get('/admin', admin.index);
app.post('/admin/login', user.login);
app.get('/admin/signup', admin.signup);
app.post('/admin/signup', user.signup)
app.get('/admin/whoweare', admin.whoweare);
app.get('/admin/howitworks', admin.howitworks);
app.get('/admin/microprovider', admin.microprovider);
app.get('/admin/contact', admin.contact);
app.post('/admin/contact', contact.sendemail);
app.get('/admin/games', checkAuth, admin.games);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Game Points server listening on port ' + app.get('port'));
});
