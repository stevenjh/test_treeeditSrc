(function() {

  define(function() {
    return {
      losAngeles: function() {
        return new esri.geometry.Extent({
          xmin: -13286420.39,
          ymin: 3993285.76,
          xmax: -13025954.7,
          ymax: 4136625.11,
          spatialReference: {
            wkid: 102113
          }
        });
      },
      cnvWGS84: function() {
        return new esri.geometry.Extent({
          xmin: -13706850,
          ymin: 6324111,
          xmax: -13694620,
          ymax: 6333063,
          spatialReference: {
            wkid: 102100
          }
        });
      },
      cnv: function() {
        return new esri.geometry.Extent({
          xmin: 490004,
          ymin: 5458793,
          xmax: 499783,
          ymax: 5467175,
          spatialReference: {
            wkid: 26910
          }
        });
      }
    };
  });

}).call(this);
