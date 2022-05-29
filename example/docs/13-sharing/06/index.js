xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <Audio id='foo'/>\
                     <Audio id='bar'/>\
                  </div>",
            map: { share: "Audio" },
            fun: function (sys, items, opts) {
                 sys.foo.remove();
                 console.log(sys.foo, sys.bar); // undefined undefined
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