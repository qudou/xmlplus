xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<Wrapper>\
                     <button>foo</button>\
                     <button>bar</button>\
                 </Wrapper>"
        },
        Wrapper: {
            xml: "<div>\
                      <h1 id='alice'>alice</h1>\
                      <button>bob</button>\
                  </div>",
            map: { appendTo: "alice" },
            fun: function (sys, items, opts) {
                this.children().forEach(function(item) {
                    console.log(item.text());
                });
            }
        }
    });
});