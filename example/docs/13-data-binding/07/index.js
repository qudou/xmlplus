xmlplus("xp", function (xp, $_) {
    $_().imports({
		Index: {
			xml: "<input id='index' type='text'/>",
			fun: function (sys, items, opts) {
				let proxy = this.bind({label: "hello, world"});
				console.log(proxy.label.value);
				proxy.label.value = "hi, world";
				console.log(proxy.label.value);
			}
		}
    });
});