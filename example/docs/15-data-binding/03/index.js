xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<input id='text' type='text'/>",
            fun: function (sys, items, opts) {
                this.bind({text: "hello, world"});
            }
        }
    });
});
