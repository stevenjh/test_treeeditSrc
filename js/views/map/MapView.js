(function() {

  define(['backbone', 'helpers/popuphelper', 'helpers/extentfactory', 'esri/layers/GeoRSSLayer', 'helpers/symbolHelper'], function(Backbone, popup, extents, symbolHelper) {
    var MapView, mapLoadHandle, drawToolbar, selectedTemplate, mapClickListener, self;
    return MapView = Backbone.View.extend({
      tagName: 'div',
      id: 'map',
      className: 'claro',
      initialize: function() {},
      render: function() {
        console.log('render the map');
        return this;
      },

      removeMapLoaded: function(){
        console.log('removeMapLoaded');
        dojo.disconnect(mapLoadHandle);
      },

      ready: function() {
        var map, osm, refUrl, refLayer, labelLayerUrl, labelLayer, _this = this, disruptionsPolygon, disruptionsPolyline;
        self = this;

        map = new esri.Map(this.id, {
          //infoWindow: popup.create(),
          extent: extents.cnv(),
          slider: true,
          sliderStyle: "small",
          logo: false

        });

        $(window).resize(function() {
          map.resize();
          return map.reposition();
        });

		    /** to raise mapLoaded event */
        mapLoadHandle = dojo.connect(map, "onLayersAddResult", function(results) {
			    /* backbone event */
          return _this.trigger("mapLoaded", map);
        });

		    /** to know when map updating, or more specifically finished updating */
        dojo.connect(map, "onUpdateStart", function() {
          var lyr;
          lyr = map.getLayer(map.layerIds[0]);
          return dojo.connect(lyr, "onUpdateEnd", function() {
			      /* backbone event listened for in ViewManager */
            return _this.trigger("mapExtentChanged");
          });
        });

        /** catch click events to define custom behaviour  */
        mapClickListener = dojo.connect( map, "onClick", function(evt){
          console.log("map click");
          return _this.trigger("mapClickEvent", evt);
        });

        // toolbar to manage feature creation
        drawToolbar = new esri.toolbars.Draw(map);


        // listen for completion of drawing
        dojo.connect(drawToolbar, "onDrawEnd", function(geometry) {
          _this.trigger("BBonDrawEnd", geometry, selectedTemplate);
        });



        // basemap details
        ref_url = "http://gisapp.cnv.org/ArcGIS/rest/services/BaseMapServices/property/MapServer";
        refLayer = new esri.layers.ArcGISTiledMapServiceLayer(ref_url);

        return map.addLayers([refLayer]);

      },

      /* manage the map interaction states
      */
      setMapEvent: function(src, params){
        if (src == "templatePicker"){
          console.log('BBsetMapEvent - templatePicker');

          if (params){
            // turn off map click listener
            dojo.disconnect(mapClickListener);

            switch (params.featureLayer.geometryType) {
              case "esriGeometryPoint":
                drawToolbar.activate(esri.toolbars.Draw.POINT);
                break;
              case "esriGeometryPolyline":
                params.template.drawingTool === 'esriFeatureEditToolFreehand' ? drawToolbar.activate(esri.toolbars.Draw.FREEHAND_POLYLINE) : drawToolbar.activate(esri.toolbars.Draw.POLYLINE);
                break;
              case "esriGeometryPolygon":
                params.template.drawingTool === 'esriFeatureEditToolFreehand' ? drawToolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON) : drawToolbar.activate(esri.toolbars.Draw.POLYGON);
                break;
            }

            //drawToolbar.activate(esri.toolbars.Draw.POINT);
            selectedTemplate = params;
          }else{
            //no tempalte picked, reset map to select/query mode
            drawToolbar.deactivate();

            mapClickListener = dojo.connect( map, "onClick", function(evt){
              console.log("map click");
              return self.trigger("mapClickEvent", evt);
            });
          }
        }

      }

    });
  });

}).call(this);
