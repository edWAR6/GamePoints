/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * game model
 */

var gamepointsdb = require('mysqlGamePoints');

exports.load = function(selector, next){
  gamepointsdb.connection.query('select * from game where ?', selector, function(err, results) {
    if(err) { 
      return next(err);
    };
    next(new game(vals[0]));
  });
};

exports.create = function(values, next){
  gamepointsdb.connection.query('insert into game set ?', values, next);
};

exports.getall = function(, next){

};