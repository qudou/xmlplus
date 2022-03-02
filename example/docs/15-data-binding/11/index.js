xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<input id='index' type='text'/>",
            map: { bind: { model: {get: e=>{return e.value.replace(/#/,'')}, set: (e,v)=>{e.value='#'+v}}} },
            fun: function (sys, items, opts) {
                window.ret = sys.index.bind("hello, world");
            }
        }
    });
});