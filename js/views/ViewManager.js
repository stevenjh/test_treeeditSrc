(function() {

  define(['jquery', 'backbone', 'views/map/MapView','views/tools/mapSwitcher','helpers/lookupHelper', 'helpers/featureLayerEditHelper', 'views/forms/treeedit' , 'helpers/mapClickHelper'],
    function($,Backbone, MapView, mapSwitcherView, lookupHelper, flEditHelper, treeedit, mch) {
    var ViewManager, mapSwitcher,_this = this;
    return ViewManager = Backbone.View.extend({
      el: $('#map-container'),

      events: {
        "click #lSideToggle": "lSideToggle"
      },

      lSideToggle : function(){
        console.log("lSideToggle toggled");
        $('#lSideToggle').toggle(function(){
          console.log("lSideToggle toggled 1 ");
          $('#lside-container').animate({width:0});
          $('#main-container').animate({left:0}, function(){
            _this.map.resize();
          });
          $('#main-container').css({width:600});

        },function(){
          console.log("lSideToggle toggled 2 ");
          $('#lside-container').animate({width:250});
          $('#main-container').animate({left:250}, function(){
            _this.map.resize();
          });
          $('#main-container').css({width:350});
        })

      },

      render: function() {

        var mv, styleView, luView, treeEditView;

        mv = new MapView();
        this.$el.prepend(mv.render().el);

		    /** waits for mapLoaded from MapView */
        mv.on("mapLoaded", function(map) {

          /* set the ViewManager map reference to the MapView map */
          _this.map = map;
          _this.map.resize();

          // turn off the map loaded as causing loop
          console.log("call removeMapLoaded");
          mv.removeMapLoaded();

          // CNV Map Swither
          //var mapSwitcher;
          if (mapSwitcher == null)
          {
            mapSwitcher = new mapSwitcherView();
            $("#mapSwitcher").append(mapSwitcher.render(_this.map).el);
            mapSwitcher.show();
          }


          console.log("before addressLookupHelper");
          lookupHelper.initialize(map);

          /** Load up the  tree edit controler */
          treeEditView = new treeedit(_this.map);
          $("#lside-container").append(treeEditView.render().el);
          //treeEditView.initEditing();
          treeEditView.on("editLayerLoaded", function(results){console.log("tree edit map loaded resutls? ");});

          /**
                don't feel this logic should be here...
                but if additions, send via next id call,
                else, send straight to onBeforeApplyEdits

                Manage attribute/ update details */
          treeEditView.on("BBonBeforeApplyEdits", function (adds, updates, deletes){
            console.log('BBonBeforeApplyEdits - view manager');


            if (adds)
            {
              //call deferred event
              var deferred = flEditHelper.deferredFetchNextId(adds);
              deferred.then(function(value){
                console.log('BBonBeforeApplyEdits - deferred call success');
                flEditHelper.onBeforeApplyEdits(adds, updates, deletes, value );
              }, function (error) {
                console.log('BBonBeforeApplyEdits - deferred call error');
                //alert("Error: unalble to get GAZ_ID from Web Service, set GNID_ID Value to empty string!");
                // Do something on failure.
                //updateGraphic.attributes["GNIS_ID"] = "";
                //editFeatureLayer.applyEdits([updateGraphic], null, null, applyEditsSuccess, applyEditsError);
              });

              //flEditHelper.fetchNextId (adds, updates, deletes);

            }else{
              flEditHelper.onBeforeApplyEdits(adds, updates, deletes);
            }
          });


          /**  listens for changes in the event type to happen on the map
               updates behaviour to reflect this
          */
          treeEditView.on("BBsetMapEvent", function(src, params){
             console.log('BBsetMapEvent' + src);
             mv.setMapEvent(src, params);
          });

          // listen for deletes from the attribute inspector
          treeEditView.on("BBinspOnDelete", function(feature){
             flEditHelper.deleteFeature(feature);
          });

          // listen for updates from the attribute inspector (will need to add geom updating)
          treeEditView.on("BBinspOnAttributeChange", function(feature, fieldName, fieldValue){
             flEditHelper.updateFeature(feature, fieldName, fieldValue);
          });

        });


        /**  Manage map clicks to drive info window  */
        mv.on("mapClickEvent", function(evt){
          mch.mapClick(_this.map, evt.mapPoint);
        });

        styleView = null;

        /** 'require' is part of the dojo AMD loading */
        /*require(['views/tools/styletoolview'], function(StyleView) {
          styleView = new StyleView();
          $('#sidebar').append(styleView.render().el);
          return styleView.ready();
        });*/

        /* Event raised in MapView from map onUpdateEnd */
        mv.on("mapExtentChanged", function() {
        //return styleView.refilter();
        });

        mv.on("BBonDrawEnd", function(geom, selectedTemplate){
          console.log('BBonDrawEnd');
          var deferred = flEditHelper.deferredFetchNextId(selectedTemplate);
          deferred.then(function(value){
            console.log('BBonBeforeApplyEdits - deferred call success');
            //flEditHelper.onBeforeApplyEdits(adds, updates, deletes, value );
            flEditHelper.addNewFeature(geom, selectedTemplate, value);
          }, function (error) {
            console.log('BBonBeforeApplyEdits - deferred call error');
            //alert("Error: unalble to get GAZ_ID from Web Service, set GNID_ID Value to empty string!");
            // Do something on failure.
            //updateGraphic.attributes["GNIS_ID"] = "";
            //editFeatureLayer.applyEdits([updateGraphic], null, null, applyEditsSuccess, applyEditsError);
          });

        });


      luView = null;
      console.log("before views/forms/lookup init");
      require(['views/forms/lookup'], function(LookupView){
          luView = new LookupView();
          $('#lookupDiv').append(luView.render().el);
          //return luView.ready();
      });



		/** should this be part done using
			// Dojo 1.7 (AMD)

			require("dojo/ready", function(ready){
				 ready(function(){
					 setAfrobeat();
				 });
			});
		**/
        dojo.addOnLoad(function() {
          return mv.ready();
        });


        return this;
      }
    });
  });

}).call(this);
