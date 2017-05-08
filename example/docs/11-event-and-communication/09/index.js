xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <span id='span'>trigger</span>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.index.on("event", function(e, a, b) {
                    console.log(a, b); // 1 hello
                });
                sys.span.trigger("event", [1,"hello"]);
            }
        }
    });
});