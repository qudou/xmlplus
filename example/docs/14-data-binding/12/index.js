xmlplus("xp", function (xp, $_) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
			        <button id='item'/>\
			      </div>",
            fun: function (sys, items, opts) {
				let data = [1,2,3,4];
                let proxy = sys.item.bind(data);
				console.log(xp.proxyToJSON(proxy));  // [1,2,3,4]
            }
        }
    });
});