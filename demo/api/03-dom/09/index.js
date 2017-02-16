xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<h1 id='example'>hello, world</h1>",
            map: { nofragment: true },
            fun: function (sys, items, opts) {
                console.log(sys.example.css("color")); // rgb(0, 0, 0)
                sys.example.css("color", "blue");
                console.log(sys.example.css("color")); // blue
            }
        }
    });
});