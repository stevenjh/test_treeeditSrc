/** cnv
 *  to identify multiple features under a map click and pass to a common info window to allow paging between them.
*/
(function() {

    var popup, responseValues, resposneKeys, this2;
    console.log("load mapClickHelper.js");

    // string prototype fix
    if(typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
      }
    }

	//define(['underscore', 'collections/ParkCollection', 'views/forms/list', 'text!templates/infowindows/park.html'], function(_, parkCollection, list, parkTemplate) {
    //define(['underscore', 'collections/ParkCollection', 'collections/LookupCollection', 'views/forms/list', 'text!templates/infowindows/park.html'], function(_, parkCollection, lookupCollection, list, parkTemplate) {
  define(['underscore'], function(_) {

	  return {


      initialize: function() {

        console.log("start init mapClickHelper.js");
        this.responseValues = [];
        this.resposneKeys = [];
        this2 = this;
        this.popup = new esri.dijit.Popup(null, dojo.create("div"));
        this.popup.setContent("<b>Description</b>: ${content}");
        console.log("end init mapClickHelper.js");


      },

      mapClick: function(map, clickPoint){
        console.log("mapClickHelper.js - mapClick");
        // query for all features close to the clicked point, accounts for overlapping features
        //this2.responseValues = [];
        //this2.resposneKeys = [];
        //map.infoWindow.setFeatures([]);

        var mapLayers = [];

        var query = new esri.tasks.Query();
        //Query within 20 pixels of click point
        query.geometry = this.pointToExtent(map, clickPoint, 10);

        //looking at GeoRSS layer which is three layers
        mapLayers.push(map._layers['treeEditLayer']);
        //var mapLayers = map._layers['disruptionsPolyline', 'disruptionsPolygon'];
        //for (var i=0; i<mapLayers._fLayers.length ; i++)
        for (var i=0; i<mapLayers.length ; i++)
        {
          var subLayer = mapLayers[i];
          //var deferred = subLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW);
          subLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW, this.clickResponse);
        }

        //flPermits is a feature layer that has had setDefinitionExpression applied to show only select features


        //this.popup.setFeatures([deferred]);
        //map.infoWindow.setFeatures(this2.responseValues);

        //if (this2.responseValues.length >0)
        //{
        //  map.infoWindow.show(clickPoint);
        //}

        //this.popup.setFeatures(this2.responseValues);
        //this.popup.show(clickPoint);
      },

      clickResponse: function(result){
        console.log("clickResponse");
        for (var i = 0; i<result.length ; i++ )
        {
          //if (result[0].geometry.type != 'polygon')
          //{

/*            var contentVal = result[i].attributes.Content;

            //var format = {content:'<div>${content}</div>'};

            var template = new esri.InfoTemplate("", contentVal);
            template.title = result[i].attributes.Title;
            result[i].setInfoTemplate(template);

            this2.responseValues.push(result[i]);
            this2.resposneKeys.push(result[i].attributes.name);

*/
          //}
        }

        /**return dojo.map(response, function(result) {
            var content = result.attributes.description
            var template = new esri.InfoTemplate("", content);
            result.setInfoTemplate(template);
            responseValues.push(result);
        });*/
        //this2.responseValues = this2.responseValues.concat(result);
      },

      pointToExtent: function (map, point, toleranceInPixel) {
        var pixelWidth = map.extent.getWidth() / map.width;
        var toleraceInMapCoords = toleranceInPixel * pixelWidth;
        return new esri.geometry.Extent(point.x - toleraceInMapCoords,
        point.y - toleraceInMapCoords,
        point.x + toleraceInMapCoords,
        point.y + toleraceInMapCoords,
        map.spatialReference);
      }
    }
	});
}).call(this);