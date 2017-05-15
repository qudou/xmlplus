xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<List id='index'>\
                     <List id='list'/>\
                     <button id='append'>append</button>\
                     <button id='remove'>remove</button>\
                     <button id='modify'>modify</button>\
                  </List>",
            fun: function (sys, items, opts) {
                sys.append.on("click", function() {
                    sys.list.append("Item");
                });
                sys.remove.on("click", function() {
                    sys.list.first() && sys.list.first().remove();
                });
                sys.modify.on("click", function() {
                    var item = sys.list.first();
                    item && (item.value().data = {color: "blue", shape: "rectangle"});
                });
            }
        },
        Item: {
            xml: "<li id='item'>\
                     <span id='color'>red</span>\
                     <span id='shape'>square</span>\
                  </li>",
            fun: function (sys, items, opts) {
                function getValue() {
                    return {color: sys.color.text(), shape: sys.shape.text()};
                }
                function setValue(obj) {
                    sys.color.text(obj.color);
                    sys.shape.text(obj.shape);
                }
                return Object.defineProperty({}, "data", { get: getValue, set: setValue});
            }
        },
        List: {
            xml: "<ul id='list'/>"
        }
    });
});