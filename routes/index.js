/* GnA Eduardo Oviedo Blanco
 * eduardo.oviedo@gnastudio.net
 * main navigation routes
 */

exports.index = function(req, res){
  res.render('index', {user: req.user});
};

exports.howitworks = function(req, res){
  res.render('howitworks', {user: req.user});
};

exports.abouth = function(req, res){
  res.render('abouth', {user: req.user});
};