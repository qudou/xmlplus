xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<div id='example'/>",
            fun: function (sys, items, opts) {
                sys.example.data("key", "value");
                console.log(sys.example.data("key"));   // value
            }
        }
    });
});