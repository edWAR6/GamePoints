/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * User routes
 */

var gamepointsDB = require('mysqlGamePoints');

/*
 * POST admin login
 */
exports.login = function(req, res){
	var query = 'SELECT Administrator.ID as Administrator_ID, Administrator.Person_ID, Administrator.Type, Administrator.Comment, Person.Active, Person.Complete, Person.Email, Person.ID, Person.Name, Person.Password, Person.Phone, User.Address, User.AditionalIndications, User.`Canton-City`, User.Country, User.`District-Town`, User.FacebookToken, User.GoogleToken, User.ID as User_ID, User.Person_ID, User.Points, User.`Province-State`, User.TwitterToken FROM Administrator inner join Person on Administrator.Person_ID = Person.ID inner join User on User.Person_ID = Person.ID';
	console.log('Req '+JSON.stringify(req.body));
	if (req.body.user.method == 'normal') {
		query += ' where Email = "' + req.body.user.email + '" and Password = "' + req.body.user.password + '";';
	} else if (req.body.user.method == 'facebook'){
		query += ' where FacebookToken = "' + req.body.user.facebookid + '";';
	};
  // gamepointsDB.connection.connect();
  console.log('Query: ' + query);
  gamepointsDB.connection.query(query, function(err, results) {
    if (err) {
      console.log('Error when login user.');
      throw err;
    };

    // gamepointsDB.connection.end();
    console.log('result[0] ' + JSON.stringify(results[0]));
    if (results[0] === undefined) {
    	// New user
    	if (req.body.user.method == 'normal') {
        req.session.user = {email: req.body.user.email};
        console.log('user ' + req.session.user);
        console.log('user ' + JSON.stringify(req.session.user));
    		res.render('admin/signup', { title: 'Game Points new user', message: 'No se encontró un usuario con ese email y password. Si es su primer visita, complete el formulario, si no intente de nuevo.', user: req.session.user });
    	} else if (req.body.user.method == 'facebook'){
        req.session.user = {name: req.body.user.name};
    		res.send({ message: 'Por favor regisrese para poder ingresar.', user: req.session.user });
    	};
    } else{
    	// Existing user
      req.session.user = results[0].user;
    	if (results[0].Complete == 1) {
    		// Login complete
    		res.render('admin/games', { title: 'Game Points existing user', user: results[0].user });
    	} else{
    		// Login incomplete
    		res.render('admin/signup', { title: 'Game Points existing user', message: 'Por favor complete el registro para poder ingresar.', user: results[0].user });
    	};
    };
  });
};

/*
 * POST admin signup
 */

exports.signup = function(req, res){
  if (!personexist(req.body.user.email)) {
    var personquery = 'INSERT INTO Person (Active, Comment, Complete, Email, Name, Password, Phone) VALUES (0, "'+ req.body.user.comment +'", 0, "'+ req.body.user.email +'", "'+ req.body.user.name +'", "'+ req.body.user.password +'", "'+ req.body.user.phone +'");';
    gamepointsDB.connection.query(query, function(err, results) {
      if (err) {
        console.log('Error signing user.');
        throw err;
      };
      res.send({ message: 'Usuario registrado con éxito.' });
    });
  }else{
    
  };
};

personexist = function(email){
  var query = 'SELECT ID FROM Person where Email = "'+ email +'"';
  gamepointsDB.connection.query(query, function(err, results) {
    if (err) {
      console.log('Error in personexist.');
      throw err;
    };
    return results[0].ID !== undefined;
  });
};

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};