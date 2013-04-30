/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * user routes
 */

var gamepointsDB = require('mysqlGamePoints');
var security = require('security');

/*
 * Sign in with twitter
 */

exports.twitter = function(req, res){
  security.twitter.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
    if (error) {
      console.log(error);
      res.send("yeah no. didn't work.")
    }
    else {
      req.session.oauth = {};
      req.session.oauth.token = oauth_token;
      console.log('oauth.token: ' + req.session.oauth.token);
      req.session.oauth.token_secret = oauth_token_secret;
      console.log('oauth.token_secret: ' + req.session.oauth.token_secret);
      res.redirect('https://twitter.com/oauth/authenticate?oauth_token='+oauth_token)
    };
  });
};

exports.twittercallback = function(req, res, next){
  if (req.session.oauth) {
    req.session.oauth.verifier = req.query.oauth_verifier;
    var oauth = req.session.oauth;

    security.twitter.getOAuthAccessToken(oauth.token,oauth.token_secret,oauth.verifier, 
      function(error, oauth_access_token, oauth_access_token_secret, results){
        if (error){
          console.log(error);
          res.send("yeah something broke.");
        } else {
          req.session.oauth.access_token = oauth_access_token;
          req.session.oauth.access_token_secret = oauth_access_token_secret;
          console.log(results);
          res.send("worked. nice one.");
        };
      }
    );
  } else{
    next(new Error("you're not supposed to be here."));
  };
};

/*
 * POST login
 */
exports.login = function(req, res){
  console.log('executing login...');
	var query = 'SELECT administrator.id as administratorid, administrator.type, administrator.comment, person.id as personid, person.active, person.complete, person.email, person.name, person.password, person.phone, user.id as userid, user.address, user.aditionalindications, user.canton_city, user.country, user.district_town, user.facebookid, user.googleid, user.points, user.province_state, user.twitterid FROM administrator inner join person on administrator.personid = person.id inner join user on user.personid = person.id';
	if (req.body.user.method == 'normal') {
		query += ' where email = "' + req.body.person.email + '" and password = "' + req.body.person.password + '";';
	} else if (req.body.user.method == 'facebook'){
		query += ' where facebookid = "' + req.body.user.facebookid + '";';
	};
  // gamepointsDB.connection.connect();
  gamepointsDB.connection.query(query, function(err, results) {
    if (err) {
      console.log('Error when login user.');
      throw err;
    };
    // gamepointsDB.connection.end();
    if (results[0] === undefined) {
    	// New user
    	if (req.body.user.method == 'normal') {
        req.session.person = {email: req.body.person.email};
    		res.render('admin/signup', { title: 'Game points new user', message: 'No se encontró un usuario con ese email y password. Si es su primer visita, complete el formulario, si no intente de nuevo.', person: {}, user: req.session.user, administrator: {} });
    	} else if (req.body.user.method == 'facebook'){
        req.session.user = {name: req.body.person.name, facebookid: req.body.facebookid};
    		res.send({ message: 'Por favor regisrese para poder ingresar.', person: {}, user: req.session.user, administrator: {} });
    	};
    } else{
    	// Existing user
      req.session.person = results[0].person;
      req.session.user = results[0].user;
      req.session.administrator = results[0].administrator;
    	if (results[0].complete == 1) {
    		// Login complete
    		res.render('admin/games', { title: 'Game points, usuario identificado', user: results[0].user });
    	} else{
    		// Login incomplete
    		res.render('admin/signup', { title: 'Game points, usuario incompleto', message: 'Por favor complete el registro para poder ingresar.', user: results[0].user });
    	};
    };
  });
};

/*
 * POST signup
 */

exports.signup = function(req, res){
  console.log('executing signup...');
  getperson(req, req.body.person.email, function(req, person){
    var personquery = '';
    var sessionuser = req.session.user || { facebookid: '', googleid: '', twitterid: '' };
    if (person) {
      personquery = 'UPDATE person SET email = "'+ req.body.person.email +'", name = "'+ req.body.person.name +'", phone = "'+ req.body.person.phone +'" WHERE id = "'+ person.id +'";';      
    }else{
      personquery = 'INSERT INTO person (active, complete, email, name, password, phone) VALUES (0, 0, "'+ req.body.person.email +'", "'+ req.body.person.name +'", "'+ req.body.person.password +'", "'+ req.body.person.phone +'");';
    };
    gamepointsDB.connection.query(personquery, function(err, results) {
      if (err) {
        console.log('Error signing person.');
        throw err;
      };
      req.session.person = person || { personid: results.insertId, email: req.body.person.email, name: req.body.person.name, phone: req.body.person.phone };
      var userquery = '';
      getuser(req, (results.insertId == 0 ? person.id : results.insertId), function(req, user, personid){
        if (user) {
          userquery = 'UPDATE user SET address = "'+ req.body.user.address +'", aditionalindications = "'+ req.body.user.aditionalindications +'", canton_city = "'+ req.body.user.city +'", country = "'+ req.body.user.country +'", district_town = "'+ req.body.user.town +'", facebookid = "'+ sessionuser.facebookid +'", googleid = "'+ sessionuser.googleid +'", province_state = "'+ req.body.user.state +'", twitterid = "'+ sessionuser.twitterid +'" WHERE id = '+ user.id +';';
        } else{
          userquery = 'INSERT INTO user (address, aditionalindications, canton_city, country, district_town, facebookid, googleid, personid, province_state, twitterid) VALUES ("'+ req.body.user.address +'", "'+ req.body.user.aditionalindications +'", "'+ req.body.user.city +'", "'+ req.body.user.country +'", "'+ req.body.user.town +'", "'+ sessionuser.facebookid +'", "'+ sessionuser.googleid +'", '+ personid +', "'+ req.body.user.state +'", "'+ sessionuser.twitterid +'");';          
        };
        gamepointsDB.connection.query(userquery, function(err, results) {
          if (err) {
            console.log('Error signing user.');
            throw err;
          };
          req.session.user = user || { address: req.body.user.address, aditionalindications: req.body.user.aditionalindications, city: req.body.user.city, country: req.body.user.country, town: req.body.user.town, facebookid: sessionuser.facebookid, googleid: sessionuser.googleid, state: req.body.user.state, twitterid: sessionuser.twitterid };
          if (req.body.administrator.comment) {
            getadministrator(req, personid, function(req, administrator, personid){
              var administratorquery = '';
              if (administrator) {
                administratorquery = 'UPDATE administrator SET comment = "'+ req.body.person.comment +'" WHERE id = '+ administrator.id +';';  
              } else{
                administratorquery = 'INSERT INTO administrator (comment, personid, type) VALUES ("'+ req.body.administrator.comment +'", '+ personid +', "microAdmin");';
              };
              // console.log(administratorquery);
              gamepointsDB.connection.query(administratorquery, function(err, results) {
                if (err) {
                  console.log('Error signing administrator.');
                  throw err;
                };
                req.session.administrator = administrator || { type: "microAdmin", comment: req.body.administrator.comment };
                res.render('admin/signup', { title: 'Game points, registro de administrador', message: 'Usuario administrador registrado con éxito.', person: req.session.person, user: req.session.user, comment: req.session.administrator });
              });
            });
          } else{
            res.render('dashboard', { title: 'Game points, dashboard', message: 'Usuario registrado con éxito.', person: req.session.person, user: req.session.user, administrator: {} });
          };
        });
      });
    });
  });
};

getperson = function(req, email, callback){
  console.log('executing personexist...');
  var query = 'SELECT id FROM person where email = "'+ email +'"';
  gamepointsDB.connection.query(query, function(err, results) {
    if (err) {
      console.log('Error in personexist.');
      throw err;
    };
    callback(req, results[0]);
  });
};

getuser = function(req, personid, callback){
  console.log('executing userexist...');
  var query = 'SELECT id FROM user where personid = '+ personid ;
  gamepointsDB.connection.query(query, function(err, results) {
    if (err) {
      console.log('Error in personexist.');
      throw err;
    };
    callback(req, results[0], personid);
  });
};

getadministrator = function(req, personid, callback){
  console.log('executing administratorexist...');
  var query = 'SELECT id FROM administrator where personid = '+ personid ;
  gamepointsDB.connection.query(query, function(err, results) {
    if (err) {
      console.log('Error in administratorexist.');
      throw err;
    };
    callback(req, results[0], personid);
  });
};