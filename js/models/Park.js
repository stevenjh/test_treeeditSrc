/** cnv

*/
(function() {

	define(['backbone'], function(Backbone) {

    // set model variables
	  var Park, slsLineColor, lineSymbol, slsFillColor, fillSymbol, specialTrailLineSymbol, trailLineSymbol, selectedLineSymbol, parkLineSymbol, parkFillSymbol, selectedParkFillSymbol;
    var selected;

    // set the symbology styles required
    specialTrailLineSymbol  = esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([1, 1, 1, 0.01]), 3);
    trailLineSymbol  = esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([1, 1, 1, 0.01]), 0);
    //trailLineSymbol = esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([153, 124, 6]), 2);
    selectedLineSymbol = esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0 ,0 ]), 2);
    parkLineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([40, 181, 45]), 2);
    parkFillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, parkLineSymbol, new dojo.Color([0, 0, 0, 0.0]));
    fieldLineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([40, 181, 45]), 0.5);
    fieldFillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, fieldLineSymbol, new dojo.Color([0, 0, 0, 0.0]));
    selectedParkFillSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, selectedLineSymbol, new dojo.Color([0, 0, 0, 0.0]));

	  return Park = Backbone.Model.extend({
      initialize: function(park) {
        this.park = park;

        // set as true then reset to standard symbology
        this.selected = true;
        this.reset();

        // add the graphic to the map
        this.park.map.getLayer("allFeats").add(this.park.graphic);

        return {
          defaults: {
            name: "",
            facilities: "",
            graphic: null,
            map: null,
            type: null
          }

        };

      },

      // old method used to zoom to individual graphic
      zoom: function() {
        var extent;
        extent = this.park.graphic.geometry.getExtent();
        return this.park.map.setExtent(extent, true);
      },

      // resets the model graphic to regular symbology
      reset: function() {
        //console.log("park reset - " + this.park.name);
        if (this.selected){
          if (this.park.graphic.geometry.type == "polyline"){
            this.park.graphic.setSymbol(trailLineSymbol);

//            if (this.park.name){
//              if (this.park.name.toLowerCase().indexOf('trail') !== -1){
//                this.park.graphic.setSymbol(specialTrailLineSymbol);
//              }else{
//                this.park.graphic.setSymbol(trailLineSymbol);
//              }
//            }else{
//              this.park.graphic.setSymbol(trailLineSymbol);
//            }
          }else{
            if (this.park.type == 'Field')
            {
              this.park.graphic.setSymbol(fieldFillSymbol);
            }else{
              this.park.graphic.setSymbol(parkFillSymbol);
            }
          }
          this.selected = false;
        }

      },

      // updates the model grapic to be of the 'selected/ matched' style
      // return feature extent, allowing zooming to all
      addModelMatch: function() {
        this.selected = true;
        if (this.park.graphic.geometry.type == "polyline"){
          this.park.graphic.setSymbol(selectedLineSymbol);
        }else{
          this.park.graphic.setSymbol(selectedParkFillSymbol);
        }

        return this.park.graphic.geometry.getExtent();
		  }

	  });
	});

}).call(this);