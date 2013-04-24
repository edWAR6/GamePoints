/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * User routes
 */

var gamepointsDB = require('mysqlGamePoints');

/*
 * POST admin login
 */
exports.adminlogin = function(req, res){
	var query = 'SELECT Administrator.ID as Administrator_ID, Administrator.Person_ID, Administrator.Type, Person.Active, Person.Complete, Person.Email, Person.ID, Person.Name, Person.Password, Person.Phone, User.Address, User.AditionalIndications, User.`Canton-City`, User.Country, User.`District-Town`, User.FacebookToken, User.GoogleToken, User.ID as User_ID, User.Person_ID, User.Points, User.`Province-State`, User.TwitterToken FROM Administrator inner join Person on Administrator.Person_ID = Person.ID inner join User on User.Person_ID = Person.ID';
	console.log(JSON.stringify(req.body));
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
    		res.render('admin/login', { title: 'Game Points Login', message: 'No se encontró un usuario con ese email y password.', result: ''});
    	} else{
    		res.render('admin/login', { title: 'Game Points Login', message: 'Por favor complete el registro para poder ingresar.', result: JSON.stringify(results[0]) });
    	};
    } else{
    	// Existing user
    	if (results[0].Complete == 1) {
    		// Login complete
    		res.render('admin/games');
    	} else{
    		// Login incomplete
    		res.render('admin/login', { title: 'Game Points Login', message: 'Por favor complete el registro para poder ingresar.', result: JSON.stringify(results[0]) });
    	};
    };
  });
};

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};