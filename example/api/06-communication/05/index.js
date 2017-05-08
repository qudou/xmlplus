xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<div id='example'/>",
            fun: function (sys, items, opts) {
                sys.example.watch("msg", function (e) {
                    console.log(this.toString());
                }).notify("msg");
            }
        }
    });
});