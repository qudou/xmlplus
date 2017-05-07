xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            // 注：字体文件的引用是不允许跨域的，所以你必须将本示例部署到一个 web 服务器上才能看到效果
            css: "@font-face { font-family: 'iconfont';src: url('font/iconfont.eot?t=1484394095878');src: url('font/iconfont.eot?t=1484394095878#iefix') format('embedded-opentype'), url('/fonts/iconfont.woff?t=1484394095878') format('woff'), url('/font/iconfont.ttf?t=1484394095878') format('truetype'), url('font/iconfont.svg?t=1484394095878#iconfont') format('svg');}\
                  #msg, #home { font-family:'iconfont' !important; font-style:normal; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }\
                  #index > * { font-size: 48px; width: 48px; height: 48px; line-height: 48px; display: inline-block; }",
            xml: "<div id='index'>\
                    <Msg id='msg'/>\
                    <Home id='home'/>\
                  </div>"
        },
        Msg: {
            css: "#msg:before { content: '\\e608'; }",
            xml: "<div id='msg'/>"
        },
        Home: {
            xml: "<div id='unicode'>&#xe609;</div>"
        }
    });
});