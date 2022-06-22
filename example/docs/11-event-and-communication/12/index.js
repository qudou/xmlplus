xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='span'>trigger</span>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.index.on("event", function(e, a, b) {
                    console.log(a, b);
                });
                sys.span.on("click", function(e) {
                    sys.span.trigger("event", [1,"hello"], false);
                });
            }
        }
    });
});