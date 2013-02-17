/** cnv - to manage the results of lookup

*/
(function() {

	define(['backbone', 'models/Lookup', 'trie'], function(Backbone, Lookup) {

    console.log('collections/LookupCollection.js');
	  var LookupCollection, myTrie;

    console.log('b4 create trie');


    myTrie = new Trie();
    console.log('af create trie');

	  LookupCollection = Backbone.Collection.extend({
		  model: Lookup,
        
      findByLookup: function(sub){
          console.log('collection - lookup value: ' + sub);
          var value, words;
          value = myTrie.find(sub.toLowerCase());
          if (value)
          {
            words = value.getWords();
          }else{
            words ="";
          }
          console.log('collection - found values: ' + words);
          return [sub,words];
      },

      // add value to the lookup trie, covert to lower case and check entry does not exist first.
      addValue:function(val){
        //console.log('collections/LookupCollection.js - addValue - ' + val);
        var fVal = val.toLowerCase()
        if (!myTrie.find(fVal)){
          myTrie.add(fVal);
        }          
        //console.log('collections/LookupCollection.js - after addValue');
      }

	  });
	  return new LookupCollection;
	});

}).call(this);