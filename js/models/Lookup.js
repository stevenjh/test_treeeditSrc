/** cnv lookup model is container for the Trie (I think)
    so functions of the model will be wrappers on the functions of trie

*/
(function() {
  console.log('models/Lookup');
	define(['backbone'], function(Backbone) {
	  var Lookup;
	  return Lookup = Backbone.Model.extend({
		
      initialize: function(lookup) {
        this.lookup = lookup;
        return {
          defaults: {
            name: "",
            facilities: ""
          }
		    };
      },
      findValue: function(sub) {
              console.log('model - look up: ' + sub);
              // lookup result in trie  // return list of stings to the view // view populate
        return value;
      },

      addValue: function(val) {
        console.log('model - look up: ' + sub);
        return value;
      }
	  });
	});

}).call(this);