(function() {

	define(['backbone', 'collections/ParkCollection', 'text!templates/forms/ParkListView.html'], function(Backbone, parkCollection, viewTemplate) {
    //define(['jquery', 'underscore', 'backbone', 'collections/ParkCollection'], function($, _, Backbone, parkCollection) {
	  /*
				# This list view will
				# handle rendering and events
				# of the sidebar list
	  */
	  var ListView;
	  ListView = Backbone.View.extend({
		//el: $("#sidebar>ul"),
		el: $("#nameTags"),
		//tagName: "ul",
		tagName: "div",
		initialize: function() {
		  return this.collection = parkCollection;
		},
		events: {
		  "click a": "clicked"
		},
		clicked: function(evt) {
		  var cid;
		  evt.preventDefault();
		  cid = $(evt.currentTarget).data("id");
		  return this.collection.zoomByCid(cid);
		},
		render: function() {
		  var data, template;
		  data = {
			parks: this.collection.models,
			_: _
		  };
          // cnv declare template here for build
          //var viewTemplate = "{# _.each(parks, function(park) { }} <span>  <a data-id='{{ park.cid }}' href='#'><u>{{ park.get(\"name\") }}</u></a> <span>{# }); }}";
		  template = _.template(viewTemplate, data);
		  $(this.el).html("");
		  return $(this.el).append(template);
		}
	  });
	  return new ListView;
	});
}).call(this);