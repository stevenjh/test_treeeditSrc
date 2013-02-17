(function() {

  //define(['jquery', 'underscore', 'backbone', 'text!templates/tools/mapSwitcher.html', 'esri/dijit/BasemapGallery'], function($, _, Backbone, mapSwitcherTemplateHtml) {
    define(['jquery', 'underscore', 'backbone', 'esri/dijit/BasemapGallery', 'jqua','jqub','jquc','jqud'], function($, _, Backbone) {
    var mapSwitcherView, basemapGallery, mapSwitcherTemplateHtml;
    var mapIndex = 0;

    this.mapSwitcherTemplateHtml = mapSwitcherTemplateHtml;

    return mapSwitcherTemplate = Backbone.View.extend({
      id: 'basemapGallery',

      initialize: function(){
        console.log("init map switcher");
      },

      render: function(map) {
        var content;
        //content = _.template(mapSwitcherTemplate, "");
        //content = mapSwitcherTemplateHtml;

        content = '<select name="mapSwitch" id="mapSwitch"><option value="Streets" >Streets</option><option value="2012">2012</option><option value="2011">2011</option></select>';

        this.$el.append(content);
        this.map = map;
        return this;
      },

      show: function() {
        console.log("set up the map switcher");
        var basemaps;

        basemaps = [];

        //shared base map layers
        var labelLayer = new esri.dijit.BasemapLayer({
          url:"http://gisapp.cnv.org/ArcGIS/rest/services/BaseMapServices/fixed_labels/MapServer",
          isReference:true
        });

//        var fountainLayer = new esri.dijit.BasemapLayer({
//          url:"http://gisapp.cnv.org/ArcGIS/rest/services/BaseMapServices/CityMAP_layers/MapServer/",
//          visibleLayers:[2],
//          opacity: 0,
//          isReference:true
//        });
//
//        var trailLayer = new esri.dijit.BasemapLayer({
//          url:"http://giswebsoc/ArcGISserver/rest/services/BaseMapServices/query_layers/MapServer/",
//          visibleLayers:[17],
//          opacity: 1,
//          isReference:true
//        });


        // streets basemap
        var propertyLayer = new esri.dijit.BasemapLayer({
          url:"http://gisapp.cnv.org/ArcGIS/rest/services/BaseMapServices/property/MapServer"
        });
        var streetsMap = new esri.dijit.Basemap({
          layers:[propertyLayer,labelLayer],
          //layers:[propertyLayer,fountainLayer,trailLayer,labelLayer],
          title:"Streets",
          id:"Streets"
        });
        basemaps.push(streetsMap);

        // imagery 2012 basemap
        var imageryLayer = new esri.dijit.BasemapLayer({
          url:"http://gisapp.cnv.org/ArcGIS/rest/services/BaseMapServices/Imagery2012/MapServer"
        });
        var imageryMap = new esri.dijit.Basemap({
          layers:[imageryLayer, labelLayer],
          //layers:[imageryLayer,fountainLayer,trailLayer, labelLayer],
          title:"2012",
          id:"2012"
        });
        basemaps.push(imageryMap);

        // imagery 2011 basemap
        var imageryLayer2011 = new esri.dijit.BasemapLayer({
          url:"http://gisapp.cnv.org/ArcGIS/rest/services/BaseMapServices/Imagery2011/MapServer"
        });
        var imageryMap2011 = new esri.dijit.Basemap({
          layers:[imageryLayer2011, labelLayer],
          //layers:[imageryLayer,fountainLayer,trailLayer, labelLayer],
          title:"2011",
          id:"2011"
        });
        basemaps.push(imageryMap2011);

        basemapGallery = new esri.dijit.BasemapGallery({
          "showArcGISBasemaps": false,
          "basemaps":basemaps,
          "map": this.map
        });

        basemapGallery.select(basemaps[0].id);


        //console.log("before .selectmenu");
        //a = $('select#mapSwitch');

        require(['jquery', 'jqua','jqub','jquc','jqud'], function($) {
          try{
            this.$('select#mapSwitch').selectmenu();
          }catch(err){
          }

        });
        console.log("after .selectmenu");

       /* dojo.forEach(basemapGallery.basemaps, function(basemap) {
          //Add a menu item for each basemap, when the menu items are selected
          //dijit.byId("mapMenu").addChild(new dijit.MenuItem({
          $("#mapMenu")[0].addChild(new dijit.MenuItem({
            label: basemap.title,
            onClick: dojo.hitch(this, function() {
              this.basemapGallery.select(basemap.id);
            })
          }));

        });*/


        //basemapGallery.startup();
        return this;
      },

      events: {
        "select #mapSwitch" : "select",
        "click #mapSwitch" : "click",
        "change #mapSwitch" :  "change"
      },

      change : function(event){
        console.log('ddl change');
        this.click(event);
      },

      select : function(event){
        console.log('ddl select');
      },

      click : function(event){
        console.log('ddl click : ' + event.currentTarget.selectedIndex);
        if (!(this.mapIndex == event.currentTarget.selectedIndex)){
          console.log('change to : ' + event.currentTarget.options[event.currentTarget.selectedIndex]);

          basemapGallery.select( event.currentTarget.options[event.currentTarget.selectedIndex].value );
          this.mapIndex = event.currentTarget.selectedIndex;
        }
      }


    });
  });

}).call(this);