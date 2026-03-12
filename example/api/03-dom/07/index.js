xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            css: "#klass { color: blue; }",
            xml: "<h1 id='example'>hello,world</h1>",
            fun: async function (sys, items, opts) {
				await xp.delay(0);
                sys.example.addClass("#klass");
                console.log(sys.example.css("color")); // rgb(0, 0, 255)
                sys.example.removeClass("#klass");
                console.log(sys.example.css("color")); // rgb(0, 0, 0)
            }
        }
    });
});