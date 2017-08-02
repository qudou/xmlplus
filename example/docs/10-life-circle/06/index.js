xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <button id='foo'>destory</button>\
                     <h1 id='bar'>Hello, world</h1>\
                  </div>",
            fun: function (sys, items, opts) {
                var timer = setInterval(function() {
                    console.log("Hello, world");
                }, 1000);
                sys.bar.on("willRemoved", function() {
                    clearInterval(timer);
                });
                sys.foo.once("click", sys.bar.remove);
            }
        }
    });
});