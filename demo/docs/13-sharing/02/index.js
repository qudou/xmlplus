xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <Audio id='foo'/>\
                     <Audio id='bar'/>\
                  </div>",
            map: { share: "Audio" },
            fun: function (sys, items, opts) {
                 console.log(sys.foo == sys.bar);     // false
                 console.log(items.foo == items.bar); // true
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