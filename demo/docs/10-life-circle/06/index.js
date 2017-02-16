xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <button id='foo'>append</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.foo.on( "click", function (event) {
                    var xml = "<h1>Hello, world</h1>";
                    var result = sys.index.append(xml);
                    result.css("text-decoration", "underline");
                });
            }
        }
    });
});