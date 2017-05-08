xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <Audio id='foo'/>\
                     <Audio id='bar'/>\
                     <Audio id='alice'/>\
                  </div>",
            map: { share: "Audio" },
            fun: function (sys, items, opts) {
                 sys.bar.remove();
                 console.log(sys.foo, sys.bar, sys.alice); // Object undefined Object
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