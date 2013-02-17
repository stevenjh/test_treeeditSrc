/** cnv

*/
(function() {

	define(['backbone', 'models/Park'], function(Backbone, Park) {
	  var ParkCollection, collectionExtent;
	  ParkCollection = Backbone.Collection.extend({
      model: Park,

      // zoom to feature - don't believe is used
      zoomByCid: function(cid) {
        var park;
        park = this.getByCid(cid);
        return park.zoom();
      },

      // compile extent of all features that match
      buildExtent: function(x) {
        if (collectionExtent)
        {
          if (x.xmax >collectionExtent.xmax ){
            collectionExtent.xmax = x.xmax;
          }if (x.ymax >collectionExtent.ymax ){
            collectionExtent.ymax = x.ymax;
          }if (x.xmin <collectionExtent.xmin ){
            collectionExtent.xmin = x.xmin;
          } if (x.ymin <collectionExtent.ymin ){
            collectionExtent.ymin = x.ymin;
          }

        }else{
          collectionExtent = x;
        }        
      },

      // called from the LookupResultsView
      findFromLookup: function(value) {
        //console.log('ParkCollection - findFromLookup called');

        // clear the last stored extent
        collectionExtent = null;

        // iterate parks collection to idetify either name or facilities
        for (var i = 0, l = this.models.length; i<l; i++){
          // used to determin result on model
          var draw = false;

          var name = this.models[i].park.name;
          var facilities = this.models[i].park.facilities;
          
          // Check by name
          if (name){
            if (name.toLowerCase().replace("'","").indexOf(value.toLowerCase()) !== -1){
              draw = true;
            }
          }

          // Check for facility contains value
          if (facilities){
            if (facilities.toLowerCase().indexOf(value.toLowerCase()) !== -1){
              draw = true;
            }
          }

          // apply the draw state needed on the model
          // calls the addModelMatch of the park/ facility feature
          // returns an extent, passed to buildExtent to calculate required zoom
          if (draw){
            this.buildExtent(this.models[i].addModelMatch());          
          }else{
            this.models[i].reset();
          }
        }

        // for loop over
        // set the map extent the to collectionExtent we've just built
        this.models[0].park.map.setExtent(collectionExtent, true);
      },

      clear:function(){
        for (var i = 0, l = this.models.length; i<l; i++){
          this.models[i].reset();
        }
      }

    });
    return new ParkCollection;
  });

}).call(this);