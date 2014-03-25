var User = require('./../../models/user');

exports.getRandomLogo = function(test){
    var pass = true;
    var value = '';
    for (var i = 300 - 1; i >= 0; i--) {
      value = User.getRandomLogo();
      pass = pass * !(typeof value === 'undefined');
    };
    test.ok(pass, 'Random logo should not be undefined. pass = '+ Boolean(pass));
    test.done();
};

exports.group = {
  test5: function(test){
    test.ok(true, "this assertion should pass");
    test.done();
  },
  test6: function(test){
    test.ok(true, "this assertion should pass");
    test.done();
  }
};