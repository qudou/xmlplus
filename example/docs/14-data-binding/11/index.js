xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<input id='index' type='text'/>",
            fun: function (sys, items, opts) {
				var elem = this.elem();
				function model(value) {
					if (value == undefined)
						return elem.value.substr(1);
					elem.value = '#' + value;
				}
				setTimeout(() => {
					window.ret = sys.index.bind("hello, world");
				},0);
				return { model: model };
            }
        }
    });
});