xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<input id='index' type='text'/>",
            fun: function (sys, items, opts) {
                this.bind({index: "hello, world"});
            }
        }
    });
});
