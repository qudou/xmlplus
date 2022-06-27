xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <Button id='button'/>\
                  </div>",
            fun: function (sys, items, opts) {
                this.on("event", function (e, msg) {
                    console.log(4, msg);
                });
                sys.index.on("event", function (e, msg) {
                    console.log(2, msg);
                });
                sys.index.on("event", function (e, msg) {
                    console.log(3, msg);
                });
                sys.button.on("event", function(e, msg) {
                    console.log(1, msg);
                });
            }
        },
        Button: {
            xml: "<button id='button'>click</button>",
            fun: function (sys, items, opts) {
                sys.button.on("click", function (e) {
                    this.trigger("event", "hi, bob!");
                });
            }
        }
    });
});