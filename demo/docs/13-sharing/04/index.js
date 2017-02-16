xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <Audio id='foo'/>\
                     <Music id='bar'/>\
                  </div>",
            map: { share: "Audio" },
            fun: function (sys, items, opts) {
                 console.log(sys.foo == sys.bar);     // false
                 console.log(items.foo == items.bar); // false
            }
        },
        Music: {
            xml: "<Audio id='music'/>",
            map: { share: "Audio" },
            fun: function (sys, items, opts) {
                return items.music;
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