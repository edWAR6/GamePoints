/*
 * GET home page.
 */
exports.index = function(req, res){
	res.render('index', { title: 'Expresóññóáí' });
};

/*
 * GET admin home page.
 */
exports.admin = function(req, res){
	res.render('admin/index', { title: 'Administrator' });
};