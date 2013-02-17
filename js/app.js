(function() {

  define(['backbone', 'views/ViewManager'], function(Backbone, VM) {
    var initialize;
    console.log("init");
    initialize = function() {
      var vm;
      vm = new VM();
      return vm.render();
    };
    return {
      initialize: initialize
    };
  });

}).call(this);
