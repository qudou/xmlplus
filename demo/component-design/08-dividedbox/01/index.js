xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#index { width: 640px; height: 480px; box-sizing: border-box; border: 1px solid blue; }\
                  #top, #bottom { width: 100%; height: 100%; background: #AAA; }",
            xml: "<VDividedBox id='index' percent='30'>\
                     <div id='top'/>\
                     <div id='bottom'/>\
                  </VDividedBox>",
            fun: function (sys, items, opts) {
                sys.top.on("click", e => sys.index.percent = 50);
            }
        },
        VDividedBox: {
            css: "#vbox { position:relative; width:100%; height:100%; box-sizing: border-box; }\
                  #top { top: 0; height: 30%; } #bottom { bottom: 0; height: calc(70% - 5px); }\
                  #top,#bottom { left: 0; right: 0; position: absolute; }\
                  #handle { height: 5px; width: 100%; position:absolute; left:0; top: 30%; z-index:11; cursor:row-resize; }",
            xml: "<div id='vbox'>\
                    <div id='top'/>\
                    <div id='handle' draggable='true'/>\
                    <div id='bottom'/>\
                  </div>",
            map: { format: {"int": "percent"}, appendTo: "top" }, 
            fun: function (sys, items, opts) {
                var percent = 50;
                sys.handle.on("dragstart", function (e) {
                    sys.vbox.on("dragover", dragover);
                });
                sys.vbox.on("dragend", function (e) {
                    e.stopPropagation();
                    sys.vbox.off("dragover", dragover);
                });
                function dragover(e) {
                    e.preventDefault();
                    setPercent((e.pageY - sys.vbox.offset().top) / sys.vbox.height() * 100);
                }
                function setPercent(value) {
                    sys.handle.css("top", value + "%");
                    sys.top.css("height", value + "%");
                    sys.bottom.css("height", "calc(" + (100 - value) + "% - 5px)");
                }
                setPercent(opts.percent || percent);
                sys.bottom.elem().appendChild(this.last().elem());
                return Object.defineProperty({}, "percent", {get: () => {return percent}, set: setPercent});
            }
        }
    });
});