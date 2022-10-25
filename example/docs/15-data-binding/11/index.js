xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<input id='index' type='text'/>",
            fun: function (sys, items, opts) {
				sys.index.bind("hello, world");
				var elem = this.elem()
				return Object.defineProperty({}, "model", {
					get: () => { return elem.value.replace(/#/,'') },
					set: value => elem.value = '#' + value
				});
            }
        }
    });
});