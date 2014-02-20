var test = require('tape');

function t(str, fn) {
  test(str, function(t) {
    fn(t);
    t.end();
  })
}

t("test set/get", function(t) {

  require('../').set({window: "foo", document: "bar"});

  t.equal("foo", require("../").window);
  t.equal("bar", require("../").document);

});
