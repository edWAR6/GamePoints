/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * game model
 */

/*
 * GET /admin
 */
exports.index = function(req, res){
  res.render('admin/index', { title: 'Game Points Administration' });
};

/*
 * GET /admin/whoweare
 */
exports.whoweare = function(req, res){
  res.render('admin/whoweare', { title: 'Game Points Administration' });
};

/*
 * GET /admin/howitworks
 */
exports.howitworks = function(req, res){
  res.render('admin/howitworks', { title: 'Game Points Administration' });
};

/*
 * GET /admin/microprovider
 */
exports.microprovider = function(req, res){
  res.render('admin/microprovider', { title: 'Game Points Administration' });
};

/*
 * GET /admin/signup
 */
exports.signup = function(req, res){
  res.render('admin/signup', { title: 'Game Points Administration', message: '', person: {}, user: {}, administrator: {} });
};

/*
 * GET /admin/contact
 */
exports.contact = function(req, res){
  res.render('admin/contact', { title: 'Game Points Administration', message: '' });
};

/*
 * GET /admin/games
 */
exports.games = function(req, res){
  res.render('admin/games', { title: 'Game Points-Mis juegos', message: '' });
};