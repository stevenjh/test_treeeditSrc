/** cnv

*/
(function() {

    var myMap,lookupFeats, thisObj, type, value, lookup, plookup, lookupSymbol;
    var qTask, query;

    console.log("load lookupHelper.js");

    // string prototype fix
    if(typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
      }
    }

	//define(['underscore', 'collections/ParkCollection', 'views/forms/list', 'text!templates/infowindows/park.html'], function(_, parkCollection, list, parkTemplate) {
    //define(['underscore', 'collections/ParkCollection', 'collections/LookupCollection', 'views/forms/list', 'text!templates/infowindows/park.html'], function(_, parkCollection, lookupCollection, list, parkTemplate) {
  define(['backbone', 'underscore', 'helpers/mapClickHelper'], function(Backbone, _, mch) {
	  return {
      //var map;

      initialize: function(map) {
        myMap = map;
        _.extend(this, Backbone.Events);
        this2 = this;



        lookupFeats = new esri.layers.GraphicsLayer({id:"allFeats"});
        lookupSymbol =  new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_X, 10,
         new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID,
         new dojo.Color([255,0,0]), 2),
         new dojo.Color([0,255,0,0.25]));

        myMap.addLayer(lookupFeats);
        console.log("init addressLookupHelper.js");

        this2.on("mapClickEvent", function(){
          //alert('huh');
        });


      },

      newLookup: function(resultVal){
        this.type = resultVal.data('type');
        this.value = resultVal.text().trim();
        this.lookup = resultVal.data('lookup');
        this.plookup = resultVal.data('plookup');

        lookupFeats.clear();

        if (type == 'feature'){
          parkCollection.findFromLookup(resultVal.text().trim());
        }else if (type = 'address'){
          this.lookupAddress(resultVal.data('lookup'));
        }
      },

      lookupAddress: function(key){
        // query fields
        qTask = new esri.tasks.QueryTask("http://gisapp.cnv.org/ArcGIS/rest/services/BaseMapServices/query_layers/MapServer/6");
        query = new esri.tasks.Query();
        query.returnGeometry = true;
        query.outFields = [];
        query.where = "PRC_ROLL_NO = '" + this.lookup + "'";
        query.outSpatialReference = myMap.spatialReference;

        qTask.execute(query, this.processAddress);
      },

      processAddress: function(addresses){
        _ref = addresses.features;
        var gra = _ref[0];
        myMap.centerAndZoom(gra.geometry, 5);
        gra.setSymbol(lookupSymbol);
        lookupFeats.add(gra);

        //dojo.dispatch("mapClickEvent", gra.geometry);
        mch.mapClick(myMap, gra.geometry);


      }
    }
	});
}).call(this);