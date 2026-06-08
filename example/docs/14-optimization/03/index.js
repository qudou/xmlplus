xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <button id='btn'>before</button>\
                </div>",
            fun: function (sys, items, opts) {
                sys.btn.once("click", function () {
                    var fragment = document.createDocumentFragment();
                    fragment.appendChild(document.createElement("div"));
                    var lastChild = fragment.lastChild;
                    for (var i = 0; i < 100; i++)
                        sys.btn.before("<h2>foo</h2>", null, lastChild);
                    fragment.removeChild(lastChild);
                    sys.index.elem().insertBefore(fragment, sys.btn.elem());
                });
            }
        }
    });
});
