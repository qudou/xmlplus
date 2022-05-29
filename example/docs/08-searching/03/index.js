xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
           xml: "<div id='index'>\
                     <div id='sub'>\
                         <button id='foo'>foo</button>\
                     </div>\
                     <button id='bar'>bar</button>\
                 </div>",
           fun: function (sys, items, opts) {
               console.log(items("button", sys.index).length); // 1
               sys("button", sys.sub).call("css", "color", "blue");
           }
        }
    });
});