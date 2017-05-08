xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<h1 id='example'>hello, world</h1>",
            map: { nofragment: true },
            fun: function (sys, items, opts) {
                sys.example.height(100);
                console.log(sys.example.height());
            }
        }
    });
});