xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<List id='index'/>",
            fun: function (sys, items, opts) {
                items.index.value = ["Item 1", "Item 2", "Item 3"];
            }
        },
        Item: {
            xml: "<li id='item'/>"
        },
        List: {
            xml: "<ul id='list'/>",
            fun: function (sys, items, opts) {
                function setValue(array) {
                    var list = sys.list.children();
                    for ( var i = 0; i < array.length; i++ )
                        (list[i] || sys.list.append("Item")).show().text(array[i]);
                    for ( var k = i; k < list.length; k++ )
                        list[k].hide();
                }
                return Object.defineProperty({}, "value", { set: setValue });
            }
        }
    });
});