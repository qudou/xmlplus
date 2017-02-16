xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<div id='example'/>",
            fun: function (sys, items, opts) {
                console.log(sys.example.guid());  // 一个组件对象标识符
            }
        }
    });
});