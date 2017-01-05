xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='top'>\
					<AJAX id='ajax' type='GET'/>\
					<div id='test'/>\
				  </div>",
            fun: function( sys, items, opts ) {
				sys.ajax.on("success", function( e, data ) {
					/\<body\>(.*)\<\/body\>/g.test(data);
					var aaa = data.match(/\<body\>(.*)\<\/body\>/g);
					console.log(data, aaa);
				});
                items.ajax({url: "/02-naming"});
            }
        },
		AJAX: {
			xml: "<void id='ajax'/>",
			opt: { url: "http://xmlplus.net/", type: "POST", data: null, timeout: 5000, async: true },
			fun: function ( sys, items, opts ) {
				return function ( options_ ) { 
					var xhr = new XMLHttpRequest,
						options = xp.extend({}, opts, options_);
					xhr.timeout = options.timeout;
					xhr.ontimeout = xhr.onerror = function (event) {
						sys.ajax.trigger(event.type, event);
					};
					xhr.onload = function (event) {
						if ( xhr.status != 200 )
							return sys.ajax.trigger("error", event);
						sys.ajax.trigger("success", [xhr.responseText], false);
					};
					xhr.open(options.type, opts.url + options.url, options.async);
					xhr.send(options.data && JSON.stringify(options.data));
				};
			}
		}
    });
});