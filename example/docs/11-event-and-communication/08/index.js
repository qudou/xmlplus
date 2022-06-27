xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <button id='button'>click</button>\
                  </div>",
            fun: function(sys, items, opts) {
                sys.index.on("event", function(e) {
                    console.log("hello, world");
                });
                sys.button.on("click", function(e) {
                    this.trigger("event");
                });
            }
        }
    });
});