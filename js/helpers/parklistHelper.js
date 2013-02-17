/** cnv

*/
(function() {

    var myMap,allFeats, thisObj;
    console.log("load parklistHelp.js");

    // string prototype fix
    if(typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
      }
    }

	//define(['underscore', 'collections/ParkCollection', 'views/forms/list', 'text!templates/infowindows/park.html'], function(_, parkCollection, list, parkTemplate) {
    //define(['underscore', 'collections/ParkCollection', 'collections/LookupCollection', 'views/forms/list', 'text!templates/infowindows/park.html'], function(_, parkCollection, lookupCollection, list, parkTemplate) {
  define(['underscore', 'collections/ParkCollection', 'collections/LookupCollection'], function(_, parkCollection, lookupCollection) {

	  return {
      //var map;

		initialize: function(map) {
      myMap = map;
      thisObj = this;
      console.log("load parklistHelp.js");

      allFeats = new esri.layers.GraphicsLayer({id:"allFeats"});
      myMap.addLayer(allFeats, 2);
      myMap.reorderLayer("washrooms", 5);

		  var fillSymbol, lineSymbol, qTask, query, qTask2, query2, slsFillColor, slsLineColor;
		  dojo.require("esri.tasks.query");

      // query on parks data
      qTask2 = new esri.tasks.QueryTask("http://giswebsoc/ArcGISserver/rest/services/BaseMapServices/query_layers/MapServer/18");
		  query2 = new esri.tasks.Query();
		  query2.returnGeometry = true;
		  query2.outFields = ["PARK_NAME","FACILITIES"];
		  query2.where = "PARK_NAME is not null";
		  query2.outSpatialReference = map.spatialReference;

      qTask2.execute(query2, this.process);

      // query fields
		  qTask = new esri.tasks.QueryTask("http://giswebsoc/ArcGISserver/rest/services/BaseMapServices/query_layers/MapServer/19");
		  query = new esri.tasks.Query();
		  query.returnGeometry = true;
		  query.outFields = ["FACILITIES","FIELD_NAME"];
      query.where = "BOOKABLE = 'True'";
		  query.outSpatialReference = map.spatialReference;

      qTask.execute(query, this.processFields);

      // query buildings
		  qTask = new esri.tasks.QueryTask("https://gisapp.cnv.org/ArcGIS/rest/services/BaseMapServices/query_layers/MapServer/5");
		  query = new esri.tasks.Query();
		  query.returnGeometry = true;
		  query.outFields = ["BUILDING_NAME","WEBLINK"];
      query.where = "SUBTYPE_TYPE = 'Rec Centre'";
		  query.outSpatialReference = map.spatialReference;

      qTask.execute(query, this.process);

      // query trails
		  qTask = new esri.tasks.QueryTask("http://giswebsoc/ArcGISserver/rest/services/BaseMapServices/query_layers/MapServer/17");
		  query = new esri.tasks.Query();
		  query.returnGeometry = true;
		  query.outFields = ["FACILITIES","TRAIL_NAME"];
      //query.where = "OBJECTID IS NOT NULL";
      query.where = "TRAIL_NAME LIKE '%Spirit%' OR TRAIL_NAME LIKE '%Green%' OR TRAIL_NAME LIKE '%Canada%'";
		  query.outSpatialReference = map.spatialReference;

      qTask.execute(query, this.processTrails);

      parkCollection.comparator = function(park) {
        return park.get("name");
      };

      //parkCollection.sort();
      //return list.render();
      //});
      //}
	  },

    //** add the value to the lookup trie */
    addToTrie: function(value){
      if (value){
        var nameVals = value.split(";");
        for (var i=0; i< nameVals.length ; i++ ){
          lookupCollection.addValue((nameVals[i]).trim());
          //console.log(nameVals[i]);
        }
      }
    },

    //** add the value to the lookup trie */
    parseFacilities: function(facilities){
      var parsedFacilities = [];
      if (facilities) {
        var facVals = facilities.split(";");
        for (var i=0; i< facVals.length ; i++ ){
          lookupCollection.addValue((facVals[i]).trim());
          if ((facVals[i]).trim() == 'Book Field @ Rec Commision'){
            parsedFacilities.push('<a href="http://www.northvanrec.com/facilities/fields/park-field-booking.aspx" target="_blank">' + (facVals[i]).trim() + '</a>');
          }else if ((facVals[i]).trim().indexOf('Dog') > -1){
            parsedFacilities.push('<a href="http://www.cnv.org/server.aspx?c=3&i=57" target="_blank">' + (facVals[i]).trim() + '</a>');
          }else{
            parsedFacilities.push((facVals[i]).trim());
          }
          //console.log(facVals[i]);
        }
      }
      return parsedFacilities.join(', ');
    },

    processFields: function(results){
      var compiledTemplate, data, item, name, template, _i, _len, _ref,facilities, weblink;
      _ref = results.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];

        name = item.attributes["FIELD_NAME"];
        facilities = item.attributes["FACILITIES"];

        thisObj.addToTrie(name);

        data = {
          name:name,
          facilities: thisObj.parseFacilities(facilities)
        };

        var parkTemplate = '<div class="details"><table><tr><td valign="top"><b>Facilities: </b></td></tr><tr><td>{{ facilities }}</td></tr></table></div>';
        compiledTemplate = _.template(parkTemplate, data);
        template = new esri.InfoTemplate(name, compiledTemplate);
        item.setInfoTemplate(template);

        parkCollection.add({
          name: name,
          facilities: facilities,
          graphic: item,
          map: myMap,
          type: "Field"
        });

      }
    },

    processTrails: function(results){
      var compiledTemplate, data, item, name, template, _i, _len, _ref,facilities, weblink;
      _ref = results.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];

        name = item.attributes["TRAIL_NAME"];
        facilities = item.attributes["FACILITIES"];

        thisObj.addToTrie(name);

        data = {
          name:name,
          facilities: thisObj.parseFacilities(facilities)
        };

        // cnv - set template here
        var spiritTrailName = 'Spirit Trail';
        var spiritTrailUrl = 'http://www.cnv.org/SpiritTrail/'
        var tcTrailName = 'Trans Canada Trail';
        var tcTrailUrl = 'http://tctrail.ca/';

        var parkTemplate = '<div class="details"><table><tr><td valign="top"><b>Facilities: </b></td></tr><tr><td>{{ facilities }}</td></tr></table></div>';
        compiledTemplate = _.template(parkTemplate, data);
        template = new esri.InfoTemplate(name, compiledTemplate);
        if (name.indexOf(spiritTrailName) !== -1 || name.indexOf(tcTrailName) !== -1)
        {
          var trailVals = name.split('; ');
          for (var x = 0; x<trailVals.length ; x++ )
          {
            if (trailVals[x] == spiritTrailName )
            {
              trailVals[x] = '<a target="_blank" href="' + spiritTrailUrl +'" >' + spiritTrailName + '</a>';
            }else if (trailVals[x] == tcTrailName)
            {
              trailVals[x] = '<a target="_blank" href="' + tcTrailUrl +'" >' + tcTrailName + '</a>';
            }
          }
          template.setTitle(trailVals.join(', '));
        }

        var parkTemplate = '<div class="details"><table><tr><td valign="top"><b>Facilities: </b></td></tr><tr><td>{{ facilities }}</td></tr></table></div>';
        compiledTemplate = _.template(parkTemplate, data);
        template = new esri.InfoTemplate(name, compiledTemplate);
        item.setInfoTemplate(template);

        parkCollection.add({
          name: name,
          facilities: facilities,
          graphic: item,
          map: myMap,
          type: "Trail"
        });

      }
    },

    process: function(results) {

        var compiledTemplate, data, item, name, template, _i, _len, _ref,facilities, weblink;
        _ref = results.features;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];

          name = item.attributes["PARK_NAME"];
          if (!name){
            name = item.attributes["BUILDING_NAME"];
          }

          facilities = item.attributes["FACILITIES"];
          weblink = item.attributes["WEBLINK"];

          // Add the value to the trie lookup
          thisObj.addToTrie(name);

          data = {
            name:name,
            facilities: thisObj.parseFacilities(facilities)
          };

          // cnv - set template here

          var parkTemplate = '<div class="details"><table><tr><td valign="top"><b>Facilities: </b></td></tr><tr><td>{{ facilities }}</td></tr></table></div>';
          compiledTemplate = _.template(parkTemplate, data);
          template = new esri.InfoTemplate(name, compiledTemplate);
          if (weblink){
            template.setTitle('<a target="_blank" href="' + weblink +'" >' + name + '</a>');
          }
          item.setInfoTemplate(template);

          parkCollection.add({
            name: name,
            facilities: facilities,
            graphic: item,
            map: myMap
          });

        }
      }
    }
	});
}).call(this);