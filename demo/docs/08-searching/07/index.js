xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
           xml: "<div id='index'>first\
                     <button id='foo'>foo</button>\
                     <button id='bar'>bar</button>last\
                 </div>",
           fun: function (sys, items, opts) {
               console.log(sys.foo.next().text());               // bar
               console.log(sys.bar.prev().text());               // foo
               console.log(sys.index.prev(), sys.index.next());  // undefined undefined
               console.log(sys.foo.prev(3).text());              // first
               console.log(sys.bar.next(3).text());              // last
           }
        }
    });
});