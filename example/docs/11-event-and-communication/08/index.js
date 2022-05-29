xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='span'>trigger</span>\
                  </div>",
            fun: function(sys, items, opts) {
                sys.index.on("event", function(e) {
                    console.log("hello, world");
                });
                sys.span.trigger("event");
            }
        }
    });
});