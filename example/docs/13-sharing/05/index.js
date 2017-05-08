xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'/>",
            map: { share: "Audio" },
            fun: function (sys, items, opts) {
                 var foo = sys.index.append("Audio");
                 var bar = sys.index.append("Audio");
                 console.log(foo == bar);                 // false
                 console.log(foo.value() == bar.value()); // true
            }
        },
        Audio: {
            xml: "<audio autoplay='autoplay'/>",
            fun: function (sys, items, opts) {
                return { desc: "audio desc" };
            }
        }
    });
});