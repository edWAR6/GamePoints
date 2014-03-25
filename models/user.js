/* GnA Eduardo Oviedo Blanco
 * eduardo.oviedo@gnastudio.net
 * User model
 */

var gamepointsDB = require('mysqlGamePoints');

var find = function(mode, user, next){
  gamepointsDB.pool.getConnection(function(err, connection) {
    var query = 'select ';
    switch(mode) {
      case 'lite':
        query += 'u.id, u.points, u.name, u.email, u.password, u.photo, u.status from user u where ';
        break;
      case 'medium':
        query += 'u.id, u.points, u.name, u.email, u.password, u.phone, u.gender, u.birthday, u.photo, u.status from user u where ';
        break;
      case 'heavy':
        query += 'u.id, u.points, u.name, u.email, u.valid_email, u.password, u.facebookid, u.googleid, u.twitterid, u.phone, u.gender, u.birthday, u.language_id, u.country_id, u.province_state, u.canton_city, u.district_town, u.address, u.aditionalindications, u.photo, u.status from user u where ';
        break;
      default:
        query += '* from user where ';
    };
    if (user.id) {
      query +='u.id = '+ connection.escape(user.id) +' and ';
    };
    if (user.email) {
      query +='u.email = '+ connection.escape(user.email) +' and ';
    };
    if (user.twitterid) {
      query +='u.twitterid = '+ connection.escape(user.twitterid) +' and ';
    };
    if (user.facebookid) {
      query +='u.facebookid = '+ connection.escape(user.facebookid) +' and ';
    };
    if (user.googleid) {
      query +='u.googleid = '+ connection.escape(user.googleid) +' and ';
    };
    query +=' true;';
    connection.query(query, function(err, results) {    
      if (err) {
        console.log('Error finding user.\n'+ JSON.stringify(user) +'\n');
        console.log(err);
      };
      // TODO: load country and language objects.v
      // if (mode == 'heavy') {
      //   for (var i = results.length - 1; i >= 0; i--) {
      //     results[i].country = Country.find('lite', {id: results[i].country_id}, function(){
      //       results[i].language = Language.find('lite', {id: results[i].language_id}, function(){
      //         next(err, results);
      //       });
      //     });
      //   };
      // } else {
        next(err, results);
      // };
      connection.release();
    });
  });
};

var create = function(user, next){
  gamepointsDB.pool.getConnection(function(err, connection) {
    var query = 'insert into user set ?';
    connection.query(query, user, function(err, result){
      if (err) {
        console.log('Error inserting user.\n'+ JSON.stringify(user) +'\n');
        next(err);
      };
      user.id = result.insertId;
      next(err, user);
      connection.release();
    });
  });
};

var findOrCreate = function(profile, next){
  user = {
    points: 0,
    status: 'i'
  };
  if (profile.provider === 'twitter') {
    user.twitterid = profile.id;
    user.name = profile.displayName;
    // TODO: load country.
    // TODO: load language.
    user.photo = profile.photos[0].value;
  } else if (profile.provider === 'facebook'){
    user.facebookid = profile.id;
    user.email = profile.emails[0].value;
    user.name = profile.displayName;
    user.gender = profile.gender == 'male' ? 'm' : 'f';
    // TODO: load country.
    // TODO: load language.
    // TODO: load fb photo.
    user.photo = getRandomLogo();
    console.log(JSON.stringify(user));
  } else{
    user.googleid = profile.emails[0].value;
    user.name = profile.displayName;
    user.email = profile.emails[0].value;
    user.photo = getRandomLogo();
    console.log(JSON.stringify(user));
  };
  find('lite', {twitterid: user.twitterid, facebookid: user.facebookid, googleid: user.googleid}, function(err, results){
    if (err) {
      console.log('Error in findOrCreate, calling find.');
      next(err);
    };
    if (results && results.length > 0) {
      user = results[0];
      next(err, user);
    } else {
      create(user, function(err, newUser){
        if (err) {
          console.log('Error in findOrCreate, calling create.');
          next(err);
        };
        next(err, newUser);
      });
    };
  });
};

var getRandomLogo = function(){
  var logos = ['images/red-logo.png', 'images/blue-logo.png', 'images/yellow-logo.png', 'images/green-logo.png'];
  // Numbers between 0 - 3.
  return logos[( Math.floor(Math.random()*(3 - 0 + 1)) + 0 )];
}

exports.find = find;
exports.create = create;
exports.findOrCreate = findOrCreate;
exports.getRandomLogo = getRandomLogo;