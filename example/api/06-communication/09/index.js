xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
			xml: "<div id='example'/>",
			fun: function (sys, items, opts) {
				this.watch("foo", ()=> console.log("foo"));
				this.watch("bar", ()=> console.log("bar"));
				console.log(this.messages()); // ["foo", "bar"]
			}
		}
    });
});