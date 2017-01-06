xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
			css: "#header { border-bottom: 1px solid #e5e5e5; }\
				  #docs {  margin-bottom: 40px; }",
            xml: "<div id='index'>\
					<Banner id='header'/>\
					<ViewStack id='stack'>\
						<Main id='main'/>\
						<Docs id='docs'/>\
					</ViewStack>\
				  </div>"
        },
		Banner: {
			xml: "<header id='header' class='navbar navbar-static-top bs-docs-nav' xmlns:i='banner'>\
					<div class='container'>\
					   <i:Title id='title'/>\
					   <i:Nav id='nav'/>\
					</div>\
				  </header>"
		},
		Main: {
			xml: "<main class='bs-docs-masthead' id='content' role='main'>\
				  <div class='container'>\
					<span class='bs-docs-booticon bs-docs-booticon-lg bs-docs-booticon-outline'>X</span>\
					<p class='lead'>Bootstrap 是最受欢迎的 HTML、CSS 和 JS 框架，用于开发响应式布局、移动设备优先的 WEB 项目。</p>\
					<p class='lead'>\
					  <a href='getting-started#download' class='btn btn-outline-inverse btn-lg'>下载 XMLPlus</a>\
					</p>\
					<p class='version'>当前版本： v3.3.0 | 文档更新于：2014-10-31</p>\
				  </div>\
				 </main>"
		},
		Docs: {
			xml: "<div class='container bs-docs-container' xmlns:i='docs'>\
					<div class='row'>\
						<i:Content id='content' class='col-md-9'/>\
						<div class='col-md-3'>\
							<div class='bs-docs-sidebar hidden-print hidden-xs hidden-sm affix-top'><i:Nav id='nav'/></div>\
						</div>\
					</div>\
					<AJAX id='ajax' type='GET'/>\
				  </div>",
            fun: function( sys, items, opts ) {
                sys.nav.on("change", function (e, target) {
                    items.ajax({url: target});
                });
                sys.ajax.on("success", items.content.val);
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
        },
		ViewStack: { 
			xml: "<div/>",
			fun: function ( sys, items, opts ) {
				var args, children = this.children(),
					table = children.call("hide").hash(),
					ptr = table[opts.index] || children[0];
				if ( ptr ) ptr = ptr.show().trigger("show", null, false);
				this.on("switch", function ( e, to ) {
					table = this.children().hash();
					if ( !table[to] || table[to] == ptr ) return;
					e.stopPropagation();
					args = [].slice.call(arguments).slice(2);
					args.unshift(ptr + '');
					ptr.hide().trigger("hide", to + '', false);
					ptr = table[to].show().trigger("show", args, false);
				});
				return Object.defineProperty({}, "selected", { get: function() {return ptr;}});
			}
		},
    });
	$_("banner").imports({
		Title: {
			xml: "<div class='navbar-header'>\
			        <button class='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='.bs-navbar-collapse'>\
			      	    <span class='sr-only'>Toggle navigation</span>\
			      	    <span class='icon-bar'></span>\
			      	    <span class='icon-bar'></span>\
			      	    <span class='icon-bar'></span>\
			        </button>\
			        <a href='../' class='navbar-brand'>XMLPlus</a>\
			      </div>"
		},
		Nav: {
			xml: "<nav class='navbar-collapse bs-navbar-collapse collapse' role='navigation' aria-expanded='false' style='height: 1px;'>\
                   <ul class='nav navbar-nav'>\
                     <li class='active'><a>起步</a></li>\
                     <li><a>文档</a></li>\
                     <li><a>组件</a></li>\
                     <li><a>示例</a></li>\
                   </ul>\
				   <ul class='nav navbar-nav navbar-right'>\
					<li><a target='_blank'>高薪工作</a></li>\
					<li><a target='_blank'>优站精选</a></li>\
					<li><a target='_blank'>官方博客</a></li>\
				   </ul>\
				 </nav>"
		}
	});
    $_("docs").imports({
        Nav: {
            css: "#nav { width: 100%; }\
                  .bs-docs-sidebar .nav>li>a { cursor: pointer; font-size: 14px; }",
            xml: "<ul id='nav' class='nav bs-docs-sidenav'>\
                    <li dt='01-components-and-space' id='first'><a>组件与空间</a></li>\
                    <li dt='02-naming'><a>命名</a></li>\
                    <li dt='03-abstract'><a>抽象</a></li>\
                    <li dt='04-dynamic-interface'><a>动态接口</a></li>\
                    <li dt='05-static-interface'><a>静态接口</a></li>\
                    <li dt='06-parameter-mapping'><a>参数映射</a></li>\
                    <li dt='07-path'><a>路径</a></li>\
                    <li dt='08-inheritting'><a>继承</a></li>\
                    <li dt='09-searching'><a>检索</a></li>\
                    <li dt='10-nesting'><a>嵌套</a></li>\
                    <li dt='11-life-circle'><a>生命周期</a></li>\
                    <li dt='12-events-and-communication'><a>事件与通信</a></li>\
                    <li dt='13-message-and-communication'><a>消息与通信</a></li>\
                    <li dt='14-sharing'><a>共享与通信</a></li>\
                    <li dt='15-lazy-instantiation'><a>延迟实例化</a></li>\
                 </ul>",
            fun: function( sys, items, opts ) {
                var prev = sys.first;
                setTimeout(function() {
                    sys.first.trigger("click");
                });
                sys.nav.on("click", "./li", function (e) {
                    e.stopPropagation();
					window.scrollTo(window.scrollX,0);
                    prev.removeClass("active");
                    prev = this.trigger("change", this.attr("dt")).addClass("active");
                });
            }
        },
        Content: {
            xml: "<div id='content' class='col-md-9'/>",
            fun: function( sys, items, opts ) {
                var content = sys.content.elem();
                function setValue( e, value ) {
                    var regexp = /\<body\>((.|\r|\n)*)\<\/body\>/g;
                    regexp.test(value);
                    content.innerHTML = RegExp.$1.trim();
                    content.lastChild.removeAttribute("class");
                }
                return { val: setValue };
            }
        }
    });
});