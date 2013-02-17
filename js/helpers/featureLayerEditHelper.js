/** cnv

*/
(function() {

    var _this = this, standby;
    console.log("load featureLayerEditHelper.js");

    // string prototype fix
    if(typeof String.prototype.trim !== 'function') {
      String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
      }
    }

  define(['underscore','dojox/widget/Standby'], function(_, Standby) {
    standby = new Standby({target: "map-container"});
    document.body.appendChild(standby.domNode);
    standby.startup();
	  return {
      //var map;

      // this is never called.
      initialize: function() {
        _this = this;
        console.log("load featureLayerEditHelper.js");

      },

      /*onBeforeApplyEdits: function (adds, updates, deletes, nextId){
        console.log('start - onBeforeApplyEdits : ' + new Date().getTime());
        if (adds)
        {
          console.log(dojo.toDom(nextId).childNodes[0].childNodes[0].childNodes[0].data);
            var newNextId = dojo.toDom(nextId).childNodes[0].childNodes[0].childNodes[0].data;
            console.log('fetchNextId callback method called: ' + newNextId);
            adds[0].attributes['UNITID'] = newNextId;
            adds[0].attributes['GIS_EDITOR'] = esri.id.credentials[0].userId;
        }

        if (updates)
        {
          updates[0].attributes['GIS_EDITOR'] = esri.id.credentials[0].userId;
        }
        console.log('end - onBeforeApplyEdits : ' + new Date().getTime());
      },*/


      // takes the set values, applies defaults and calculated values
      addNewFeature : function(geometry, selectedTemplate, nextId){
        console.log('flEditHelper - addNewFeature : ' + new Date().getTime());
        //esri.show(dojo.byId("loadingImg"));
        standby.show();

        var newAttributes = dojo.mixin({},selectedTemplate.template.prototype.attributes);
        var newGraphic = new esri.Graphic(geometry,null,newAttributes);
        var newNextId = dojo.toDom(nextId).childNodes[0].childNodes[0].childNodes[0].data;
        //when features are added - add them to the undo manager

        // set attributes on graphic
        newGraphic.attributes['UNITID'] = newNextId;
        newGraphic.attributes['GIS_EDITOR'] = esri.id.credentials[0].userId;
        newGraphic.attributes['GIS_EDIT_DATE'] = Date.now();

        // set created date and creation attributes (source, species, plant date, etc..)
        newGraphic.attributes['HANSEN_GENUS'] = dijit.byId("genusSelect").get('displayedValue');
        newGraphic.attributes['SOURCE'] = dojo.getObject('sourceText').value;
        newGraphic.attributes['HANSEN_PLANT_DATE'] = Date.parse(dijit.byId("plantDate").get('value'));


        selectedTemplate.featureLayer.applyEdits([newGraphic], null, null, function() {
          //esri.hide(dojo.byId("loadingImg"));
          standby.hide();
          /**
          var operation = new esri.dijit.editing.Add({
            featureLayer: selectedTemplate.featureLayer,
            addedGraphics: [newGraphic]
          });

          //undoManager.add(operation);

          //checkUI();*/
        });

      },

      // manages the deletion of features, maybe just a masked deletion
      deleteFeature: function(feature){
        console.log('flEditHelper - deleteFeature : ' + new Date().getTime());
        var layer = feature.getLayer();

        // check the create date, if made by the same user inside the last few minutes, allow delete.
        layer.applyEdits(null, null, [feature]);
        layer.clearSelection();

      },


      // manages the updating of features from the attribute inspector
      updateFeature: function (feature, fieldName, newFieldValue){
        console.log('flEditHelper - updateFeature : ' + new Date().getTime());

        var originalFeature = feature.toJson();
        feature.attributes[fieldName] = newFieldValue;
        feature.attributes['GIS_EDITOR'] = esri.id.credentials[0].userId;
        feature.attributes['GIS_EDIT_DATE'] = Date.now();

        var layer = feature.getLayer();
        layer.applyEdits(null, [feature], null, function() {
          var operation = new esri.dijit.editing.Update({
            featureLayer: layer,
            preUpdatedGraphics: [new esri.Graphic(originalFeature)],
            postUpdatedGraphics: [feature]
          });
        });

      },


      // used to fetch the next unitid
      deferredFetchNextId: function(template, geom){
        var tableName = "CITY_TREES";
        var this2 = this;
        var nextId;

        var urlRequest = "https://gisapp.cnv.org/testing/cnvgisservice/NextId/" + tableName; // + "?format=json";
        var xhrArgs = {
          url: urlRequest,
          type: "GET",
          //dataType: "jsonp",
          //jsonpCallback: 'callback',
          dataType: "xml",
          timeout: 5000,
          success: function (webResults) {
            nextId = webResults.childNodes[0].childNodes[0].childNodes[0].childNodes[0].data;
          },
          error: function (ex, ey, ez){
            console.log("error: ");
            console.log(ex);
            console.log(ey);
            console.log(ez);
          },
          complete: function (x){
            //console.log("complete: " + x);
          }
        };

        var deferred = dojo.xhrGet(xhrArgs);
        return deferred;
      }

    }
	});
}).call(this);