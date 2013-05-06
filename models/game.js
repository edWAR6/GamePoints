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

exports.getall = function(lastid, next){
  var query = 'select game.* from game left join gamestock on game.id = gamestock.gameid left join user on gamestock.userid = user.id left join person on user.personid = person.id left join administrator on person.id = administrator.personid ';
  query += 'where ((person.active = 1 and person.complete = 1) || (person.id is null)) ';
  query += 'order by star DESC, case when gamestock.sku is null then 1 else 0 end, gamestock.sold, case when administrator.type is null then 1 else 0 end, administrator.type ';
  query += 'limit '+ lastid +','+ 20 +';';
  console.log(query);
  gamepointsdb.connection.query(query, function(err, results) {
    if(err) { 
      return next(err);
    };
    next(err, results);
  });
};