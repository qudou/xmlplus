xmlplus("xp", function (xp, $_) {
    $_().imports({
        Example: {
            xml: "<div id='example'>\
			        <button id='item'/>\
			      </div>",
            fun: function (sys, items, opts) {
				let data = [1,2,3,4];
                let proxy = sys.item.bind(data);
				console.log(xp.exports(proxy.model));  // [1,2,3,4]
            }
        },
        Example: {
            xml: "<div id='example'>\
			        <button id='item'/>\
			      </div>"
        }
    });
});