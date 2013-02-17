(function() {


  define(['jquery', 'underscore','collections/ParkCollection','helpers/lookupHelper'], function($ ,_ ,parkCollection, lookupHelper) {
    //window.LookupResultsView = Backbone.View.extend({
    var resultsDiv, resultsTemplate, resultsIndex, results;
    return LookupResultsView = Backbone.View.extend({

      tagName:"div",
        el: $("#lookupSugDiv"),

      initialize:function () {
        this.resultsIndex =0;
        resultsDiv = $('#lookupSugDiv');
        //ORIG resultsTemplate ="{# _.each(stems, function(stem) { }} <div id=\"lui\" data-id='{{ stub.substr(0, stub.length - 1) + stem }}'>  {{ stub.substr(0, stub.length - 1) + stem }} </div>{# }); }}";
        //ORIG ADDRESSES resultsTemplate ="{# _.each(values, function(value) { }} <div id=\"lui\" data-id='{{ type }}'  data-key='{{ value[1] }}'>  {{ value[0] }} </div>{# }); }}";
        resultsTemplate ="{# _.each(data, function(result) { }} <div id=\"lui\" data-type='{{ result.type }}'  data-lookup='{{ result.lookup }}'  data-plookup='{{ result.plookup }}'>  {{ result.value }} </div>{# }); }}";
      },

      render:function (results) {
        console.log('LookupResultsView render start');
        this.results = results;
        this.resultsIndex = 0;
        var template;
        // get handle on results div pass results data to renderer
        resultsDiv.html("");

        template = _.template(resultsTemplate, results);
        resultsDiv.html(template);
        return resultsDiv;
      },

      events: {
        "click #lui": "clicked",
        "mouseover #lui": "mouseOver",
        "mouseout #lui": "mouseOut"
      },

      resultSelect: function(resultVal){
        var type = resultVal.data('type');
        //var value = resultVal.text().trim();
        //var key = resultVal.data('key');

        if (type == 'feature'){
          parkCollection.findFromLookup(resultVal.text().trim());
        }else{
          lookupHelper.newLookup(resultVal);
        }
      },

      clicked: function(evt) {
        evt.preventDefault();
        var lookupBoxHandle = $('#lookupBox');
        console.log('LookupResultsView item clicked ' + $(evt.currentTarget).text().trim());

        // set the search box to be clicked value
        lookupBoxHandle[0].value = $(evt.currentTarget).text().trim();
        $(this.el).html("");
        //resultsDiv.html("");
        this.resultSelect($(evt.currentTarget));
        //parkCollection.findFromLookup($(evt.currentTarget).text().trim());
        this.resultsIndex = 0;

        //cid = $(evt.currentTarget).data("id");
        //return this.collection.zoomByCid(cid);
      },

      // takes the enter command from lookup view to select current keyboard highlght
      select: function(){
        var i = 0;
        var divElement;
        var ksResultsIndex = this.resultsIndex-1;
        $('#lookupSugDiv').children().each(function(){
          console.log(this);
          if (ksResultsIndex == i){
            divElement = $(this);
            //parkCollection.findFromLookup($(this).text().trim());
          }
          i++;
        });
        this.resultSelect(divElement);
        this.resultsIndex = 0;
      },

      mouseOver: function(evt) {
        console.log('itemMouseOver');
        $(evt.currentTarget).addClass("lookupHighlight");
      },

      mouseOut: function(evt){
        $(evt.currentTarget).removeClass("lookupHighlight");
      },

      selectDown: function(){
        if (this.resultsIndex < (this.results.data.length)){
          this.resultsIndex++;
          this.keySelect();
        }
      },

      // take the up key command from lookup view
      selectUp: function(){
        if (this.resultsIndex > 1){
          this.resultsIndex--;
          this.keySelect();
        }
      },

      // identifies the current record to hightlight from keyboard selection
      keySelect: function(){
        console.log('select: ' + this.resultsIndex);

        var i = 0;
        var ksResultsIndex = this.resultsIndex-1;

        // iterate over the individual suggestions
        $('#lookupSugDiv').children().each(function(){
          if (ksResultsIndex == i){
            $(this).addClass("lookupSelection");
            // set the lookup box text to be current selected item
            $('#lookupBox')[0].value = $(this).text().trim();
          }else{
            $(this).removeClass("lookupSelection");
          }
          i++;
        });

      }

    });
  });
}).call(this);