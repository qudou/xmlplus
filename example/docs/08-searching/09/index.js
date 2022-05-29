xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
           xml: "<div id='index'>\
                     <button id='foo'>foo</button>\
                     <button id='bar'>bar</button>\
                 </div>",
           fun: function (sys, items, opts) {
               console.log(sys.index.kids(0).length); // 5
           }
        }
    });
});