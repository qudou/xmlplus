xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<input id='text' type='text'/>",
            fun: function (sys, items, opts) {
                this.bind({text: "hello, world"});
            }
        }
    });
});
