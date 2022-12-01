xmlplus("xp", function (xp, $_) {
    $_().imports({
        Example: {
            xml: "<div id='example'>\
			        <button id='item'/>\
			      </div>",
            fun: function (sys, items, opts) {
				let data = [1,2,3,4];
                let proxy = sys.item.bind(data);
				window.ret = proxy;
				console.log(xp.exports(proxy.model));  // [1,2,3,4]
            }
        }
    });
});