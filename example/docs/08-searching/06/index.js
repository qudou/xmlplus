xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
           xml: "<div id='index'>first\
                     <button id='foo'>foo</button>\
                     <button id='bar'>bar</button>last\
                 </div>",
           fun: function (sys, items, opts) {
               console.log(sys.index.first().text());  // foo
               console.log(sys.index.last().text());   // bar
               console.log(sys.index.first(3).text()); // first
               console.log(sys.index.last(3).text());  // last
           }
        }
    });
});