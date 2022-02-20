xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<input id='index' type='text'/>",
            map: { bind: { model: {get: v=>{return v.replace(/#/,'')}, set: v=>{return '#'+v}}} },
            fun: function (sys, items, opts) {
                window.ret = sys.index.bind("hello, world");
            }
        }
    });
});