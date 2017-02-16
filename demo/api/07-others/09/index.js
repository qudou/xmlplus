xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<h1 id='example'>hello, world</h1>",
            fun: function (sys, items, opts) {
                sys.example.emptySystemCall();
                sys.example.css("color", "blue");             // 此语句无任何效果
                sys.example.css("border", "1px solid red");   // 此语句生效
            }
        }
    });
});