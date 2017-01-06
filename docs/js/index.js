xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#index { position: relative; height: 100%; opacity: 0; transition: opacity .5s ease-in-out; }\
				  #banner { border-bottom: 1px solid #e5e5e5; }\
				  #docs { margin-top: 40px; }\
				  .loading { position: fixed; top: 40%; left: calc(50% - 92px); font-size: 3em; color: #3D6AA2; font-family: Menlo, Consolas, Inconsolata, Monaco, 'Courier New', monospace, 'Source Code Pro'; transition: opacity .5s ease-in-out; }",
            xml: "<div id='index' xmlns:i='tools'>\
                    <Banner id='banner'/>\
                    <i:ViewStack>\
                        <Home id='home'/>\
                        <Docs id='docs'/>\
                    </i:ViewStack>\
                  </div>",
			map: { defer: "docs" },
            fun: function( sys, items, opts ) {
                sys.banner.on("change", function(e, target) {
                    sys.home.trigger("switch", target);
                });
				setTimeout(function() {
					document.getElementsByClassName("loading")[0].style.opacity = 0;
					sys.index.css("opacity", "1");
				}, 1000);
            }
        },
        Banner: {
            xml: "<header class='navbar navbar-static-top bs-docs-nav'>\
                     <div class='container' xmlns:i='banner'>\
                        <i:Title/>\
                        <i:Navigator/>\
                     </div>\
                  </header>"
        },
        Home: {
            xml: "<main class='bs-docs-masthead'>\
                  <div class='container'>\
                    <span class='bs-docs-booticon bs-docs-booticon-lg bs-docs-booticon-outline'>X</span>\
                    <p class='lead'>XMLPlus是一个颠覆性JS框架，用于快速开发前后端项目。</p>\
                    <p class='lead'>\
                      <a href='getting-started#download' class='btn btn-outline-inverse btn-lg'>下载 XMLPlus</a>\
                    </p>\
                    <p class='version'>当前版本： v1.5.1 | 文档更新于：2017-01-06</p>\
                  </div>\
                 </main>"
        },
        Docs: {
			css: "#docs { position: relative; }",
            xml: "<div id='docs' class='container bs-docs-container' xmlns:i='docs'>\
                    <div class='row'>\
                        <i:Content id='content' class='col-md-9'/>\
						<i:Overlay id='overlay'/>\
                        <div class='col-md-3'>\
                            <div class='bs-docs-sidebar hidden-print hidden-xs hidden-sm affix-top'><i:Navigator id='nav'/></div>\
                        </div>\
                    </div>\
                    <AJAX id='ajax' type='GET' xmlns='tools'/>\
                  </div>",
            fun: function( sys, items, opts ) {
                sys.nav.on("change", function (e, target) {
					sys.overlay.show();
                    items.ajax({url: target});
                });
                sys.ajax.on("success", function(e, data) {
					sys.overlay.hide();
					items.content.val(e, data);
					window.scrollTo(window.scrollX,0);
				});
            }
        }
    });
    $_("banner").imports({
        Title: {
            css: "#title { cursor: pointer; }",
            xml: "<div class='navbar-header'>\
                    <button class='navbar-toggle collapsed' type='button' data-toggle='collapse' data-target='.bs-navbar-collapse'>\
                        <span class='sr-only'>Toggle navigation</span>\
                        <span class='icon-bar'></span>\
                        <span class='icon-bar'></span>\
                        <span class='icon-bar'></span>\
                    </button>\
                    <a id='title' class='navbar-brand'>XMLPlus</a>\
                  </div>",
            fun: function( sys, items, opts ) {
                sys.title.on("click", function(e) {
                    this.trigger("change", "home");
                });
            }
        },
        Navigator: {
            css: "#nav li { cursor: pointer }",
            xml: "<nav id='nav' class='navbar-collapse bs-navbar-collapse collapse' role='navigation' aria-expanded='false' style='height: 1px;'>\
                   <ul class='nav navbar-nav'>\
                     <li id='startup'><a>起步</a></li>\
                     <li id='docs'><a>文档</a></li>\
                     <li id='components'><a>组件</a></li>\
                     <li id='examples'><a>示例</a></li>\
                   </ul>\
                   <ul class='nav navbar-nav navbar-right'>\
                    <li><a target='_blank'>高薪工作</a></li>\
                    <li><a target='_blank'>优站精选</a></li>\
                    <li><a target='_blank'>官方博客</a></li>\
                   </ul>\
                 </nav>",
            fun: function( sys, items, opts ) {
                var prev = sys.startup;
                sys.nav.on("click", "./ul/li", function (e) {
                    e.stopPropagation();
                    prev.removeClass("active");
                    prev = this.trigger("change", this.toString()).addClass("active");
                });
            }
        }
    });
    $_("docs").imports({
        Navigator: {
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
        },
		Overlay: {
			css: "#overlay{display:none;position:fixed;left:0;top:0;width:100%;height:100%;z-index:13000;-webkit-transition-duration:.4s;transition-duration:.4s}",
			xml: "<div id=\"overlay\"> <Loader/> </div>"
		},
		Loader: {
			css: "#preloader { position: absolute; left: 50%; top: 50%; padding: 8px; margin-left: -25px; margin-top: -25px; background: rgba(61, 106, 162, 0.8); z-index: 13500; border-radius: 5px; } #spinner { display: block; width: 34px; height: 34px; background-position: 50%; background-size: 100%; background-repeat: no-repeat; -webkit-animation: $spin 1s steps(12, end) infinite; animation: $spin 1s steps(12, end) infinite; background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\"); } @-webkit-keyframes $spin { 100% { -webkit-transform: rotate(360deg); } } @keyframes $spin { 100% { transform: rotate(360deg); } }",
			xml: "<div id=\"preloader\"> <span id=\"spinner\"/> </div>"
		}
    });
    $_("tools").imports({
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
        }
	});
});