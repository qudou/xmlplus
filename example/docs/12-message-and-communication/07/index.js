xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<span id='foo'>foo</span>",
            fun: function (sys, items, opts) {
                sys.foo.glance("msg", function(e) {
                    console.log(this.text());
                });
                sys.foo.notify("msg").notify("msg");
            }
        }
    });
});