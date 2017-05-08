xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<List id='index'>\
                     <Item>Item 1</Item>\
                     <Item>Item 2</Item>\
                  </List>"
        },
        Item: {
            xml: "<li id='item'/>"
        },
        List: {
            xml: "<ul id='list'/>"
        }
    });
});