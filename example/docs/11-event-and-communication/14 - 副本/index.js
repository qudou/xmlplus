xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                      <button id='btn'>aa</button>\
                      <a id='a' href='https://xmlplus.cn'>trigger</a>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.btn.on("click", function(e) {
                    const evt = new Event("click", {"bubbles":true, "cancelable":false});
                    //sys.a.elem().dispatchEvent(evt);
                    sys.a.trigger("click");
                });
            }
        },
        Widget: {}
    });
});