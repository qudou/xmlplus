xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
			css: "#sidebar, #content { border: 1px solid #AAA; min-height: 300px; }",
            xml: "<div class='container'>\
					<AJAX id='ajax' type='GET'/>\
					<div class='row'>\
						<div id='sidebar' class='col-sm-3'>\
							<h2>目录</h2>\
							<Nav id='nav'/>\
						</div>\
						<div id='content' class='col-sm-9'> </div>\
					</div>\
				  </div>",
			fun: function( sys, items, opts ) {
				sys.nav.on("change", function (e, target) {
					items.ajax({url: target});
				});
				var regexp = /\<body\>((.|\r|\n)*)\<\/body\>/g;
				sys.ajax.on("success", function ( e, data ) {
					regexp.test(data);
					sys.content.last().replace(RegExp.$1.trim()).removeAttr("class");
				});
			}
        },
		Banner: {
			css: "#banner { background: #222; color: #fafafa; position: fixed; top: 0; height: 50px; box-shadow: 0 0 5px rgba(0,0,0,0.5); width: 100%; z-index: 100; }",
			xml: "<div id='banner'/>"
		},
		Nav: {
			xml: "<ul id='nav' class='nav nav-tabs nav-stacked'>\
				  <li><a href='#' dt='01-components-and-space' id='first'>组件与空间</a></li>\
				  <li><a href='#' dt='02-naming'>命名</a></li>\
				  <li><a href='#' dt='03-abstract'>抽象</a></li>\
				  <li><a href='#' dt='04-dynamic-interface'>动态接口</a></li>\
				  <li><a href='#' dt='05-static-interface'>静态接口</a></li>\
				  <li><a href='#' dt='06-parameter-mapping'>参数映射</a></li>\
				  <li><a href='#' dt='07-path'>路径</a></li>\
				  <li><a href='#' dt='08-inheritting'>继承</a></li>\
				  <li><a href='#' dt='09-searching'>检索</a></li>\
				  <li><a href='#' dt='10-nesting'>嵌套</a></li>\
				  <li><a href='#' dt='11-life-circle'>生命周期</a></li>\
				  <li><a href='#' dt='12-events-and-communication'>事件与通信</a></li>\
				  <li><a href='#' dt='13-message-and-communication'>消息与通信</a></li>\
				  <li><a href='#' dt='14-sharing'>共享与通信</a></li>\
				  <li><a href='#' dt='15-lazy-instantiation'>延迟实例化</a></li>\
				</ul>",
			fun: function( sys, items, opts ) {
				setTimeout(function() {
					sys.first.trigger("click");
				});
				sys.nav.on("click", "./li/a", function (e) {
					e.preventDefault();
					e.stopPropagation();
					this.trigger("change", this.attr("dt"));
				});
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