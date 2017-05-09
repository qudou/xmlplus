xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<TextBox id='index'/>",
            fun: function (sys, items, opts) {
                items.index.on("input", e => {
                    console.log(items.index.prop("value"));
                });
            }
        },
        TextBox: {
            xml: "<div class='input-group'>\
                      <span class='input-group-addon'>https://example.com/users/</span>\
                      <input id='input' class='form-control' aria-describedby='basic-addon3'/>\
                  </div>",
            fun: function (sys, items, opts) {
                return sys.input;
            }
        }
    });
});