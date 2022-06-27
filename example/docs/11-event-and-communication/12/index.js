xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <button id='btn'>click</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.index.on("click", function (e) {
                    console.log("1");
                });
                sys.btn.on("click", function(e) {
                    //e.stopPropagation();
                    e.stopImmediatePropagation();
                    console.log("2");
                });
                sys.btn.on("click", function(e) {
                    console.log("3");
                });
            }
        }
    });
});