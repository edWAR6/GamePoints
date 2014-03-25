exports.testSomething = function(test){
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

exports.testSomethingElse = function(test){
    test.ok(true, "this assertion should fail");
    test.done();
};

exports.group = {
  test3: function(test){
    test.ok(true, "this assertion should pass");
    test.done();
  },
  test4: function(test){
    test.ok(true, "this assertion should pass");
    test.done();
  }
};