/* Eduardo Oviedo Blanco
 * eduardo.oviedo@gmail.com
 * article model
 */

var gamepointsdb = require('mysqlGamePoints');

exports.getall = function(lastid, next){
  gamepointsdb.connection.query('select * from article left join articlestock
  on article.id = articlestock.articleid
  order by case when articlestock.sku is null then 1 else 0 end, articlestock.sold;', function(err, results) {
    if(err) { 
      return next(err);
    };
    next(new game(vals[0]));
  });
};