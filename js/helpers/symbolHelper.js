(function() {

  define(function() {
    return {
      simpleMarker: function() {
        return new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 1]));
      },
      lineSymbol: function() {
        return new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 70, 127, 0.5]), 2);
      },
      polygonSymbol: function() {
        return new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NONE, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 0), new dojo.Color([0, 70, 127, 0.5]));
      }
    };
  });

}).call(this);
