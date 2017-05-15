xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "html,body { width: 100%; height: 100%; margin: 0; padding: 0; }",
            xml: "<PullRefresh id='index'>\
                     <h1>Twitter</h1>\
                     <h2>Loren Brichter</h2>\
                  </PullRefresh>",
            fun: function (sys, items, opts) {
                this.on("ready", () => {
                    setTimeout(() => sys.index.trigger("complete"), 3000);
                });
            }
        },
        PullRefresh: {
            css: "#refresh { position: relative; height: 100%; cursor: pointer; overflow-y: hidden; }\
                  #page { height: 100%; transform: translateY(0); }\
                  #status, #content { transform: translateY(-40px); } #content { height: 100%; }",
            xml: "<div id='refresh' xmlns:i='pullrefresh'>\
                    <div id='page'>\
                        <i:Status id='status'/>\
                        <div id='content'></div>\
                    </div>\
                  </div>",
            map: { "appendTo": "content", "nofragment": true },
            fun: function (sys, items, opts) {
                var startY, translateY;
                sys.page.on("touchstart", function (e) {
                    startY = e.targetTouches[0].pageY;
                    translateY = parseInt(sys.page.css("transform").match(/\d+/)[0]);
                    sys.page.on("touchmove", touchmove).on("touchend", touchend).css("transition", "");
                });
                function touchmove(e) {
                    var offset = e.targetTouches[0].pageY - startY;
                    if ( offset > 0 ) {
                        sys.page.css("transform", "translateY(" + (offset + translateY) + "px)");
                        if (items.status.value != "release")
                            items.status.value = offset > 40 ? "release" : "pull";
                    }
                }
                function touchend(e) {
                    var offset = e.changedTouches[0].pageY - startY;
                    sys.page.off("touchmove").off("touchend").css("transition", "all 0.3s ease-in 0s");
                    if ( items.status.value == "loading" ) {
                        sys.page.css("transform", "translateY(40px)");
                    } else if ( offset < 40 ) {
                        sys.page.css("transform", "translateY(0)");
                    } else {
                        release();
                    }
                }
                function release() {
                    items.status.value = "loading";
                    sys.refresh.once("complete", () => {
                        items.status.value = "success";
                        setTimeout(e => {
                            sys.page.css("transform", "translateY(0)").once("webkitTransitionEnd", e => items.status.value = "pull");
                        }, 300);
                    });
                    sys.page.css("transform", "translateY(40px)").trigger("ready");
                }
            }
        }
    });
    $_("pullrefresh").imports({
        Status: {
            css: "#statusbar { height: 2.5em; line-height: 2.5em; text-align: center; }",
            xml: "<ViewStack id='statusbar'>\
                    <span id='pull'>Pull to refresh...</span>\
                    <span id='release'>Release to refresh...</span>\
                    <span id='loading'>Loading...</span>\
                    <span id='success'>Loading success</span>\
                  </ViewStack>",
            fun: function (sys, items, opts) {
                var status = "pull";
                function getValue() {
                    return status;
                }
                function setValue(value) {
                    sys.statusbar.trigger("switch", status = value);
                }
                return Object.defineProperty({}, "value", {get: getValue, set: setValue});
            }
        },
        ViewStack: { 
            xml: "<div id='viewstack'/>",
            fun: function (sys, items, opts) {
                var args, children = this.children(),
                    table = children.call("hide").hash(),
                    ptr = table[opts.index] || children[0];
                if (ptr) ptr = ptr.trigger("show").show();
                this.on("switch", function ( e, to ) {
                    table = this.children().hash();
                    if ( !table[to] || table[to] == ptr ) return;
                    e.stopPropagation();
                    args = [].slice.call(arguments).slice(2);
                    ptr.trigger("hide", [to+''].concat(args)).hide();
                    ptr = table[to].trigger("show", [ptr+''].concat(args)).show();
                });
                return Object.defineProperty({}, "selected", { get: function() {return ptr}});
            }
        }
    });
});