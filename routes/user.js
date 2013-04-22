/*
 * POST admin login
 */

exports.adminlogin = function(req, res){
	console.log(req.body.user.email);
	console.log(req.body.user.password);
};

/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};