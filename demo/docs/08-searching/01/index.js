xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
           xml: "<div id='index'>\
                     <button>foo</button>\
                     <button>bar</button>\
                 </div>",
           fun: function (sys, items, opts) {
               console.log(sys("//*").length); // 3
               sys("//button").call("css", "color", "blue");
           }
        }
    });
});