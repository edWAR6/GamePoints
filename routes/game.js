/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * game model
 */

var gamemodel = require('../models/game');

/*
 * GET /
 */
exports.index = function(req, res){
  gamemodel.getall(0, function (err, results) {
    if (err) throw err;
    console.log('results:'+ JSON.stringify(results));
    res.render('index', { title: 'Game Points', games: results});
  });
};