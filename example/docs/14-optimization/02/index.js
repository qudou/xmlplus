xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                      <button id='btn'>append</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.btn.once("click", function () {
                    var fragment = document.createDocumentFragment();
                    for (var i = 0; i < 100; i++)
                        sys.index.append("<h2>foo</h2>", null, fragment);
                    sys.index.elem().appendChild(fragment);
                });
            }
        }
    });
});
