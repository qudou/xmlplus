xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<Target id='example'/>",
            fun: function (sys, items, opts) {
                var value = sys.example.val();
                console.log(value.text, value == items.example); // hello,world true
            }
        },
        Target: {
            fun: function (sys, items, opts) {
                return { text: "hello,world" };                  // 值对象由此返回
            }
        }
    });
});