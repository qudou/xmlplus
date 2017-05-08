xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                     <List id='list'/>\
                     <button id='append'>append</button>\
                     <button id='remove'>remove</button>\
                     <button id='modify'>modify</button>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.append.on("click", function() {
                    sys.list.append("Item").text("Item 1");
                });
                sys.remove.on("click", function() {
                    sys.list.first() && sys.list.first().remove();
                });
                sys.modify.on("click", function() {
                    sys.list.first() && sys.list.first().text("Item 2");
                });
            }
        },
        Item: {
            xml: "<li id='item'/>"
        },
        List: {
            xml: "<ul id='list'/>"
        }
    });
});