xmlplus("xp", function (xp, $_) {
    $_().imports({
		Index: {
			xml: "<input id='index' type='text' data-dispatch-event='true'/>",
			fun: function (sys, items, opts) {
				this.on("$/before/setting", (e, data) => {
					e.stopPropagation();
					data.value = "#" + data.value;
				});
				this.on("$/after/getting", (e, data) => {
					e.stopPropagation();
					data.value = data.value.substr(1);
				});
				window.proxy = sys.index.bind("haha");
			}
		}
    });
});