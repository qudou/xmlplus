xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
           xml: "<div id='index'>\
                     <button id='foo'>foo</button>\
                     <button id='bar'>bar</button>\
                 </div>",
           fun: function (sys, items, opts) {
               console.log(sys.index.children().length); // 2
           }
        }
    });
});