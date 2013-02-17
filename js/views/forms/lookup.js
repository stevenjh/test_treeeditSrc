(function() {

  define(['jquery', 'backbone', 'text!templates/forms/LookupView.html', 'collections/LookupCollection', 'collections/ParkCollection', 'views/forms/lookupResults'], function($, Backbone, LookupTemplate, lookupCollection, parkCollection, LookupResultsView) {

    console.log('views/forms/lookup.js');

    var LookupView, xhr;
    return LookupView = Backbone.View.extend({
      //id: 'styletool',

      initialize: function() {
        this.lur = new LookupResultsView();
        return this.filters = "";
      },

      render: function() {
        var content;
        content = _.template(LookupTemplate, "");
        this.$el.append(content);
        return this;
      },

      events: {
        //"select .lookupBoxClass":
        "keyup .lookupBoxClass": "search",
        //"keypress .lookupBoxClass": "onkeypress",
        "focus .lookupBoxClass": "onfocus"
      },

      search: function (event) {
        var codes, stub, stems, template, lur;
        results = [];
        var this2 = this;
        console.log('key press: ' + new Date().getTime());

        if (event.keyCode == 13) {
          console.log('enter');
          this.lur.select();
          event.preventDefault();
          // reset the results and redraw
          data ={};
          this.lur.render({data: data});
        }else if (event.keyCode == 27){
          event.preventDefault();
          console.log('escape');
          data ={};
          this.lur.render({data: data});
        }else if (event.keyCode == 38){
          event.preventDefault();
          console.log('up');
          this.lur.selectUp();
        }else if (event.keyCode == 40){
          event.preventDefault();
          console.log('down');
          this.lur.selectDown();
        }else{

          var key = $('#lookupBox').val();
          //console.log('search ' + key);

          // check if value looks like/ is an address
          if (key.length >=2 && !(isNaN(key.split(' ')[0])) ){
            console.log('looks like address: ' + key);
            console.log('submit address: ' + new Date().getTime());

            var urlRequest = "http://citygis.cnv.org/Services/cnvgisservice/Lookup/address/" + key.trim() + "?format=json";
            //var urlRequest = "http://gisapp.cnv.org/testing/cnvgisservice/Lookup/address/"  + key.trim() + "?format=json";
            if (this.xhr){
              this.xhr.abort();
              console.log('abort');
            }
            this.xhr = $.ajax({
              url: urlRequest,
              //dataType: "xml",
              type: "GET",
              dataType: "jsonp",
              jsonpCallback: 'callback',
              timeout: 5000,
              success: function (webResults) {
                console.log('start success : ' + new Date().getTime());

                this2.lur.render({data: webResults});

                console.log('end success   : ' + new Date().getTime());
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
            });

          }
          // check list of name and facilities
          else{
            codes = lookupCollection.findByLookup(key);
            stub = codes[0];
            stems = codes[1];
            console.log(stub + ' trie results: ' + stems);

            // format the results into their values
            var i = stems.length;
            while (i--)
            {
              results.push({'value': stub.substr(0, stub.length - 1) + stems[i],
                            'type' : 'feature',
                            'lookup' : '',
                            'plookup' : ''});

              //[stub.substr(0, stub.length - 1) + stems[i], '']);
            }


            /*data = {
              values: results,
              type: "feature",
                _: _
            };*/

            // render the lookup results
            console.log("results renderer called");
            this.lur.render({data: results});

          }
        }
      },

      onkeypress: function (event) {
        console.log('keypress ');
        if (event.keyCode == 13) {
          event.preventDefault();
        }else if (event.keyCode == 27){
          console.log('escape');
          event.preventDefault();
        }else if (event.keyCode == 38){
          console.log('up');
          event.preventDefault();
        }else if (event.keyCode == 40){
          console.log('down');
          event.preventDefault();
        }
      },

      onfocus: function (event) {
        console.log('focus');
        parkCollection.clear();
        $('#lookupBox')[0].value = "";
      }

    });

  });

}).call(this);