xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                      <Widget id='widget'/>\
                      <button id='trigger'>trigger</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.index.on("event", function(e) {
                    console.log(e.target.elem());
                });
                sys.trigger.on("click", function(e) {
                    sys.widget.trigger("event");
                });
            }
        },
        Widget: {}
    });
});