xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<List id='index'>\
                     <Item>Item 1</Item>\
                     <Item>Item 2</Item>\
                     <Item>Item 3</Item>\
                  </List>"
        },
        Item: {
            xml: "<li class='ui-state-default'><span class='ui-icon ui-icon-arrowthick-2-n-s'/><span id='data'/></li>",
            map: { appendTo: "data" },
            fun: function (sys, items, opts) {
                return { data: sys.data.text };
            }
        },
        List: {
            css: "#list{ list-style-type: none; margin: 0; padding: 0; width: 60%; }\
                  #list li { margin: 0 3px 3px 3px; padding: 0.4em; padding-left: 1.5em; font-size: 1.4em; height: 18px; }\
                  #list li span:first-child { position: absolute; margin-left: -1.3em; }",
            xml: "<ul id='list'/>",
            fun: function (sys, items, opts) {
                var elem = this.elem();
                $(elem).sortable();
                $(elem).disableSelection();
            }
        }
    });
});