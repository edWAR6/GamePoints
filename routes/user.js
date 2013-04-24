var gamepointsDB = require('mysqlGamePoints');
/*
 * POST admin login
 */

exports.adminlogin = function(req, res){
	gamepointsDB.connection.connect();
	gamepointsDB.connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
		if (err) {
			console.log('mysql error');
			throw err;
		};
	  console.log('The solution is: ', rows[0].solution);

	  res.render('admin/login', { title:  req.body});
	});
	gamepointsDB.connection.end();

	console.log(req.body.user.email);
	console.log(req.body.user.password);
};

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};