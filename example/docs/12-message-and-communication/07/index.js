xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<span id='index'>foo</span>",
            fun: function (sys, items, opts) {
                sys.index.watch("msg", function(e) {
                    sys.index.unwatch("msg");
                    console.log(this.text());
                });
                sys.index.notify("msg").notify("msg");
            }
        }
    });
});