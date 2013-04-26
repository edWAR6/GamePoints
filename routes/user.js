/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * User routes
 */

var gamepointsDB = require('mysqlGamePoints');

/*
 * POST login
 */
exports.login = function(req, res){
  console.log('executing login...');
	var query = 'SELECT administrator.ID as administrator_ID, administrator.person_ID, administrator.Type, administrator.Comment, person.Active, person.Complete, person.Email, person.ID, person.Name, person.Password, person.Phone, User.Address, User.AditionalIndications, User.`Canton_City`, User.Country, User.`District_Town`, User.FacebookToken, User.GoogleToken, User.ID as User_ID, User.person_ID, User.Points, User.`Province_State`, User.TwitterToken FROM administrator inner join person on administrator.person_ID = person.ID inner join User on User.person_ID = person.ID';
	if (req.body.user.method == 'normal') {
		query += ' where Email = "' + req.body.person.email + '" and Password = "' + req.body.person.password + '";';
	} else if (req.body.user.method == 'facebook'){
		query += ' where FacebookToken = "' + req.body.user.facebookid + '";';
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
        req.session.user = {email: req.body.person.email};
    		res.render('admin/signup', { title: 'Game Points new user', message: 'No se encontró un usuario con ese email y password. Si es su primer visita, complete el formulario, si no intente de nuevo.', user: req.session.user });
    	} else if (req.body.user.method == 'facebook'){
        req.session.user = {name: req.body.person.name, facebookid: req.body.facebookid};
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
 * POST signup
 */

exports.signup = function(req, res){
  console.log('executing signup...');
  getperson(req, req.body.person.email, function(req, person){
    var personquery = '';
    var sessionUser = req.session.user || { facebookid: '', googleid: '', twitterid: '' };
    if (person) {
      personquery = 'UPDATE person SET Email = "'+ req.body.person.email +'", Name = "'+ req.body.person.name +'", Phone = "'+ req.body.person.phone +'" WHERE ID = "'+ person.ID +'";';      
    }else{
      personquery = 'INSERT INTO person (Active, Complete, Email, Name, Password, Phone) VALUES (0, 0, "'+ req.body.person.email +'", "'+ req.body.person.name +'", "'+ req.body.person.password +'", "'+ req.body.person.phone +'");';
    };
    gamepointsDB.connection.query(personquery, function(err, results) {
      if (err) {
        console.log('Error signing person.');
        throw err;
      };
      var userquery = '';
      // console.log('results: ' + JSON.stringify(results));
      getuser(req, (results.insertId == 0 ? person.ID : results.insertId), function(req, user, personid){
        if (user) {
          userquery = 'UPDATE User SET Address = "'+ req.body.user.address +'", AditionalIndications = "'+ req.body.user.aditionalindications +'", Canton_City = "'+ req.body.user.city +'", Country = "'+ req.body.user.country +'", District_Town = "'+ req.body.user.town +'", FacebookToken = "'+ sessionUser.facebookid +'", GoogleToken = "'+ sessionUser.googleid +'", Province_State = "'+ req.body.user.state +'", TwitterToken = "'+ sessionUser.twitterid +'" WHERE ID = '+ user.ID +';';
        } else{
          userquery = 'INSERT INTO User (Address, AditionalIndications, Canton_City, Country, District_Town, FacebookToken, GoogleToken, person_ID, Province_State, TwitterToken) VALUES ("'+ req.body.user.address +'", "'+ req.body.user.aditionalindications +'", "'+ req.body.user.city +'", "'+ req.body.user.country +'", "'+ req.body.user.town +'", "'+ sessionUser.facebookid +'", "'+ sessionUser.googleid +'", '+ personid +', "'+ req.body.user.state +'", "'+ sessionUser.twitterid +'");';          
        };
        // console.log('userquery: '+userquery);
        gamepointsDB.connection.query(userquery, function(err, results) {
          if (err) {
            console.log('Error signing user.');
            throw err;
          };
          if (req.body.person.comment) {
            getadministrator(req, personid, function(req, administrator, personid){
              var administratorquery = '';
              if (administrator) {
                administratorquery = 'UPDATE administrator SET Comment = "'+ req.body.person.comment +'" WHERE ID = '+ administrator.ID +';';  
              } else{
                administratorquery = 'INSERT INTO administrator (Comment, person_ID, Type) VALUES ("'+ req.body.administrator.comment +'", '+ personid +', "microAdmin");';
              };
              // console.log(administratorquery);
              gamepointsDB.connection.query(administratorquery, function(err, results) {
                if (err) {
                  console.log('Error signing administrator.');
                  throw err;
                };
                req.session.administrator = administrator || {id: results.insertId, personid: personid, type: "microAdmin", comment: req.body.administrator.comment};
                res.render('admin/signup', { title: 'Game Points, registro de administrador', message: 'Usuario administrador registrado con éxito.', person: req.session.person, user: req.session.user, administrator: req.session.administrator });
              });
            });
          } else{
            res.render('dashboard', { title: 'Game Points, registro de usuario', message: 'Usuario registrado con éxito.', person: req.session.person, user: req.session.user, administrator: null });
            res.send({ message: '' });
          };
        });
      });
    });
  });
};

getperson = function(req, email, callback){
  console.log('executing personexist...');
  var query = 'SELECT ID FROM person where Email = "'+ email +'"';
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
  var query = 'SELECT ID FROM User where person_ID = '+ personid ;
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
  var query = 'SELECT ID FROM administrator where person_ID = '+ personid ;
  gamepointsDB.connection.query(query, function(err, results) {
    if (err) {
      console.log('Error in administratorexist.');
      throw err;
    };
    callback(req, results[0], personid);
  });
};

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};