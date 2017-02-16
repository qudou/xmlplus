xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <Button>click me</Button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.index.on("click", function(e) {
                    console.log("I'm in Index");
                });
            }
        },
        Button: {
            xml: "<button id='button'/>",
            fun: function (sys, items, opts) {
                sys.button.on("click", function(e) {
                    e.stopPropagation();
                    console.log("I'm in Button");
                });
            }
        }
    });
});