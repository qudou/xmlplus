xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <Audio id='foo'/>\
                     <Audio id='bar'/>\
                  </div>",
            fun: function (sys, items, opts) {
                 console.log(sys.foo == sys.bar);     // false
                 console.log(items.foo == items.bar); // false
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