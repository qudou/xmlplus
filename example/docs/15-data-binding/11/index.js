xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<input id='index' type='text'/>",
            map: { bind: { model: {get: "getter", set: "setter"} } },
            fun: function (sys, items, opts) {
                setTimeout(function () {
                    window.ret = sys.index.bind("hello, world");
                }, 0);
                function getter(e) {
                    return e.value.replace(/#/,'');
                }
                function setter(e,v) {
                    e.value = '#' + v;
                }
                return { getter: getter, setter: setter };
            }
        }
    });
});