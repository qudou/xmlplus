xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <button>click</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.index.on("click", function(e) {
                    console.log(e.currentTarget == sys.index); // true
                });
            }
        }
    });
});