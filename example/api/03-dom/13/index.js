xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<h1 id='example'>hello, world</h1>",
            fun: async function (sys, items, opts) {
				await xp.delay(0);
                sys.example.height(100);
                console.log(sys.example.height());
            }
        }
    });
});