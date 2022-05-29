xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <button id='foo'>destory</button>\
                     <Widget id='bar'/>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.foo.once("click", sys.bar.remove);
            }
        },
        Widget: {
            xml: "<h1>Hello, world</h1>",
            fun: function (sys, items, opts) {
                var timer = setInterval(function() {
                    console.log("Hello, world");
                }, 1000);
                this.on("willRemoved", function() {
                    clearInterval(timer);
                });
            }
        }
    });
});