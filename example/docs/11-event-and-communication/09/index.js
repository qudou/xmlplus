xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <button id='button'>click</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.index.on("event", function(e, a, b) {
                    console.log(a, b); // 1 hello
                });
                sys.button.on("click", function(e) {
                    this.trigger("event", [1,"hello"]);
                });
            }
        }
    });
});