/*
 * GET home page.
 */
exports.index = function(req, res){
	var credentials = {};
	if (process.env.VCAP_SERVICES) {
		var configuration = JSON.parse(process.env.VCAP_SERVICES);
		credentials = configuration['mysql-5.1'][0]['credentials'];
	};
	res.render('index', { title:  credentials.user});
};

/*
 * GET admin home page.
 */
exports.admin = function(req, res){
	res.render('admin/index', { title: 'Game Points Administration' });
};

/*
 * GET admin whoweare.
 */
exports.whoweare = function(req, res){
	res.render('admin/whoweare', { title: 'Game Points Administration' });
};

/*
 * GET admin howitworks.
 */
exports.howitworks = function(req, res){
	res.render('admin/howitworks', { title: 'Game Points Administration' });
};

/*
 * GET admin microprovider.
 */
exports.microprovider = function(req, res){
	res.render('admin/microprovider', { title: 'Game Points Administration' });
};

/*
 * GET admin signup.
 */
exports.signup = function(req, res){

	res.render('admin/signup', { title: 'Game Points Administration', message: '', user: '' });
};