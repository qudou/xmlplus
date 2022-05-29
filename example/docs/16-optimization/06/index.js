xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<List id='list'/>",
            fun: function (sys, items, opts) {
                items.list.value = ["hello","world"];
                items.list.value = ["1","2","3","4"];
            }
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
        },
        Item: {
            xml: "<li id='item'/>"
        }
    });
});
