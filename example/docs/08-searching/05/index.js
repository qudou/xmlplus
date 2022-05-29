xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
           xml: "<div id='index'>first\
                     <button id='foo'>foo</button>\
                     <button id='bar'>bar</button>last\
                 </div>",
           fun: function (sys, items, opts) {
               console.log(sys.index.get(0).text());  // foo
               console.log(sys.index.get(1).text());  // bar
           }
        }
    });
});