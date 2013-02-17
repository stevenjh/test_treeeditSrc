(function() {

  require({
    async: 1,
    parseOnLoad: true,
    aliases: [["text", "dojo/text"]],
    packages: [
      /*{
        name: "jquery",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/jquery",
        main: "jquery-1.7.2.min"
      },*/
       /* {
        name: "jqueryui",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/jqueryui",
        main: "jquery-ui-1.8.20.custom.min"
      },*/
      {
        name: "jquery",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/jqueryui2",
        main: "jquery-1.8.2"
      },
      {
        name: "jqua",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/jqueryui2/ui",
        main: "jquery.ui.core"
      },
      {
        name: "jqub",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/jqueryui2/ui",
        main: "jquery.ui.widget"
      },
      {
        name: "jquc",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/jqueryui2/ui",
        main: "jquery.ui.position"
      },
      {
        name: "jqud",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/jqueryui2/ui",
        main: "jquery.ui.selectmenu"
      },
      {
        name: "jqu4",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/jqueryui2/ui",
        main: "jquery.ui.widget"
      }/*,
      {
        name: "jquery.bootstrap",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/boostrap",
        main: "boostrap.min"
      }*/, {
        name: "underscore",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/lodash",
        main: "lodash.min"
      }, {
        name: "backbone",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/backbone",
        main: "backbone-min"
      }, {
        name: "trie",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/libs/trie",
        main: "trie"
      }, {
        name: "templates",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/templates"
      }, {
        name: "views",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/views"
      }, {
        name: "models",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/models"
      },{
        name: "collections",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/collections"
      }, {
        name: "helpers",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js/helpers"
      }, {
        name: "app",
        location: location.pathname.replace(/\/[^/]+$/, "") + "/js",
        main: "app"
      }
    ]
  });

  define.amd.jQuery = true;

  require(['jquery', 'app', 'dojo/ready', 'underscore'], function($, App, ready, _) {
    return $(document).ready(function() {
      return ready(function() {
		_.templateSettings = {
	      interpolate: /\{\{(.+?)\}\}/g,
		  evaluate: /\{\#(.+?)\}\}/g
	    };
        return App.initialize();
      });
    });
  });

}).call(this);
