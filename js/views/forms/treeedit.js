(function() {

  define(['jquery', 'backbone', 'dijit/form/FilteringSelect', 'dojo/store/Memory', 'dijit/form/DateTextBox', 'esri/dijit/editing/TemplatePicker-all', 'esri/dijit/editing/Editor-all','esri/layers/FeatureLayer', 'esri/IdentityManager'], function($, Backbone, FilteringSelect, Memory, DateTextBox) {
    //
    console.log('views/forms/treeedit.js');

    var LookupView, xhr, treeEditLayer, map, editLayerLoadHandle, dummyFeatureCollection, dummyFeatureLayer;
    var genusInit = false;

    return LookupView = Backbone.View.extend({
      tagName: 'editDiv',
      id: 'treeedit',
      render: function() {
        var content = "<div id='editor'></div><div id='inspector'></div><div id='creator' style='display: none'>Create new:<hr/>Genus:<br/><input id='genusSelect'><br/>Source:<br/><input id='sourceText'/>Plant Date:<br/><input type='text' name='plantDate' id='plantDate'  /></div>"
        this.$el.append(content);
        return this;
      },

      initialize: function(map) {
        console.log('views/forms/treeedit.js init');
        _this = this;
        console.log(map.extent);

        this.map = map;
        console.log('views/forms/treeedit.js IdentityManager');
        esri.config.defaults.geometryService = new esri.tasks.GeometryService("http://gisapp.cnv.org/ArcGIS/rest/services/Geometry/GeometryServer");

        /* Load in the layers that are to be edited*/
        esri.config.defaults.io.proxyUrl = "http://giswebsoc/proxy/proxy.ashx";

        treeEditLayer = new esri.layers.FeatureLayer("https://gisapp.cnv.org/ArcGIS/rest/services/BaseMapServices/EditLayers/FeatureServer/4", {
          mode: esri.layers.FeatureLayer.MODE_ONDEMAND,
          id: 'treeEditLayer',
          isEditable: 'true',
          minScale: 2500,
          visible:true,
          outFields: ["OBJECTID", "SOURCE", "UNITID", "BOUNDARY_T", "HANSEN_GENUS", "HANSEN_PLANT_DATE", "GIS_EDITOR", "GIS_EDIT_DATE",  "SHAPE"]
          //outFields: ["*"]
        });

        this.map.addLayers([treeEditLayer]);

        // will initilize the editing tools once authenticated.
        dojo.connect(treeEditLayer, 'onLoad', function(){
          console.log('treeEditLayer onLoad called');
          _this.initEditing();
        });

        // not sure if needed now as managing the edit workflow
        /*dojo.connect(treeEditLayer, 'onBeforeApplyEdits', function(a,u,d){
          console.log('onBeforeApplyEdits called');
          _this.trigger('BBonBeforeApplyEdits',a,u,d);
        });*/

        // not using info window
        /*dojo.connect(map.infoWindow, 'onShow',function(){
          map.infoWindow.hide();
        }); */

        //return this.initEditing(results);
        //editLayerLoadHandle = dojo.connect(map, "onLayersAddResult", function(results){
        //  return _this.trigger("editLayerLoaded", results);
        //});

      },


      // starts the template picker widget
      initEditing: function(){
        $('#startEdit').css({display:'none'});

        var results = [this.map._layers['treeEditLayer']];
        console.log('views/forms/treeedit.js initEditing');

        /** set up feature layer infos */
        var featureLayerInfos = dojo.map(results, function(result) {
          return {
            "featureLayer": result
          };
        });

        /** add featurLayer fieldInfos for each feature. */
        var treeFieldInfos = [
          {'fieldName': 'UNITID','tooltip': 'The tree id.', 'label':'Unitid:','isEditable':false},
          {'fieldName': 'HANSEN_GENUS', 'tooltip': 'Hansen Genus Value', 'label':'Genus','isEditable':true},
          {'fieldName': 'SOURCE','label':'Source:','isEditable':true},
          {'fieldName': 'HANSEN_PLANT_DATE', 'label':'Plant Date','isEditable':true},
          {'fieldName': 'BOUNDARY_T', 'label':'Boundary?','isEditable':true},
          {'fieldName': 'GIS_EDITOR', 'label':'Last editor','isEditable':false},
          {'fieldName': 'GIS_EDIT_DATE', 'label':'Edit date','isEditable':false}
        ];

        featureLayerInfos[0]["fieldInfos"] = treeFieldInfos;

        // set up the template picker/ legend
        var templatePicker = new esri.dijit.editing.TemplatePicker({
          featureLayers: results,
          //rows: 3,
          columns: 2,
          showTooltip:false//,
          //style: "height: 120px; width: 220px;"
        }, "editor");

        /** set up attribute inspector (to take it out of the map) */
        var attInsp = new esri.dijit.AttributeInspector({
          layerInfos: featureLayerInfos
        },'inspector');


        /** initilize a dummy feature layer to use for
         *  could not get inspector to work on a dummy feature so manually creating the required dijits
         */
         /**

        dummyFeatureCollection = {};
        dummyFeatureCollection.layerDefinition = dojo.fromJson(results[0]._json);
        dummyFeatureCollection.featureSet = {
          "features" : [{
            "attributes" :{
              "OBJECTID" : 1,
              "UNITID" : "dummy"
            },
            "geometry"  :  { "x": 0, "y": 0 }
          }],
          "geometryType":"esriGeometryPoint"
        } ;


        dummyFeatureLayer = new esri.layers.FeatureLayer(dummyFeatureCollection, {
          outFields: ["HANSEN_GENUS", "HANSEN_PLANT_DATE", "SOURCE"],
          id: 'dummyFeatureLayer'
        });

        var dummyFeatureLayerInfos = {}
        dummyFeatureLayerInfos.featureLayer = dummyFeatureLayer;
        dummyFeatureLayerInfos.fieldInfos = [
          {'fieldName': 'HANSEN_GENUS', 'tooltip': 'Hansen Genus Value', 'label':'Genus','isEditable':true},
          {'fieldName': 'SOURCE','label':'Source:','isEditable':true},
          {'fieldName': 'HANSEN_PLANT_DATE', 'label':'Plant Date','isEditable':true},
          {'fieldName': 'BOUNDARY_T', 'label':'Boundary?','isEditable':true}
        ];



        // set up attribute inspector to handle creating new features
        var dummyAttInsp = new esri.dijit.AttributeInspector({
          layerInfos: dummyFeatureLayerInfos
        },'creator');

          */


        // start template picker
        templatePicker.startup();

        // event from template picker , pass to view manager to set what will happen on the map
        dojo.connect( templatePicker, "onSelectionChange", function(){
          _this.trigger('BBsetMapEvent', 'templatePicker' ,templatePicker.getSelected());

          // set the inspector panel to show a new set of details trimed down for creating new features.
          if (templatePicker.getSelected())
          {


            if (genusInit)
            {
              // exists already
              console.log('treeedit.js - init creator panel');
            }else{
              var genusStore = new Memory({
                      data: templatePicker.getSelected().featureLayer.fields[35].domain.codedValues
                  });

              var filteringSelect = new FilteringSelect({
              id: "genusSelect",
              name: "genus",
              value: "",
              store: genusStore ,
              searchAttr: "name"
              }, "genusSelect");

              genusInit = true;

              var plantDateInput = DateTextBox({
                id: "plantDate",
                name: "plantDate"
              },plantDate);

            }

            /** attempted to use a dummy feature with inspector abandoned for manual dijits

            //would or should test for geom types in making these dummies
            var dummyPt = esri.geometry.Point(0,0, _this.map.spatialReference);
            var sms = new esri.symbol.SimpleMarkerSymbol().setStyle(              esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE).setColor(                new dojo.Color([255,0,0,0.5]));

            var dummyAttr = templatePicker.getSelected().template.prototype.attributes;

            dummyAttr.UNITID = 'dummy';
            dummyAttr.OBJECTID = 1;

            // create a dummy inspector object of the selected feature to show 'create' attributes
            var dummyGraphic = new esri.Graphic(dummyPt, sms, dummyAttr, null);
            //dummyGraphic = templatePicker.getSelected().template.prototype;
            //dummyFeatureLayer.graphics = [dummyGraphic];

            dummyFeatureLayer.applyEdits([dummyGraphic], null, null);

            var query = new esri.tasks.Query();
            query.outFields = ["HANSEN_GENUS", "HANSEN_PLANT_DATE", "SOURCE"];
            query.where = "UNITID = 'dummy'";
            //query.where = "OBJECTID = 1";

            dummyFeatureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW);

            //dummyFeatureLayer._selectedFeatures = dummyFeatureLayer.graphics;

            */




            $("#inspector").hide();
            $("#creator").show();
          }
          else{
            $("#creator").hide();
            $("#inspector").show();
          }

        });

        //raise events from inspector delete button.
        dojo.connect ( attInsp, 'onDelete', function(feat){
          _this.trigger('BBinspOnDelete', feat);
        });

        //raise events from inspector delete button.
        dojo.connect ( attInsp, 'onAttributeChange', function(feature, fieldName, fieldValue){
          _this.trigger('BBinspOnAttributeChange', feature, fieldName, fieldValue);
        });

      },

      /** starts the editor dijit
      initEditingOrig: function(){
        $('#startEdit').css({display:'none'});

        var results = [this.map._layers['treeEditLayer']];
        console.log('views/forms/treeedit.js initEditing');

        // set up feature layer infos
        var featureLayerInfos = dojo.map(results, function(result) {
          return {
            "featureLayer": result
          };
        });

        // set up attribute inspector (to take it out of the map)
        var attInsp = new esri.dijit.AttributeInspector({
          layerInfos: featureLayerInfos
        },'inspector');

        var settings = {
          map: this.map,
          attributeInspector:attInsp,
          layerInfos: featureLayerInfos
        };

        var params = {
          settings: settings
        };
        var editorWidget = new esri.dijit.editing.Editor(params, 'editor');

        //var options = {snapKey:dojo.keys.copyKey};
        //this.map.enableSnapping(options);

        editorWidget.startup();
      },*/


      events: {
        //"click #initEditing": "initEditing"
      }

    });

  });

}).call(this);