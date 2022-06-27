xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <button>button-A</button>\
                     <button>button-B</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.index.on("click", "*", function(e) {
                    console.log(this.localName(), this.text());
                });
            }
        }
    });
});