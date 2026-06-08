xmlplus("xp", function (xp, $_) {
    $_().imports({
		Index: {
			xml: "<div id='index'>\
					<input id='text' type='text'/>\
				  </div>",
			fun: function (sys, items, opts) {
				window.proxy = this.bind({text: "hello, world"});
			}
		}
    });
});