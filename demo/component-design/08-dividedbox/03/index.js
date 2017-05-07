xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            css: "#index { width: 640px; height: 480px; box-sizing: border-box; border: 1px solid #AAA; }",
            xml: "<VDividedBox id='index'>\
                     <Editor id='top'/>\
                     <Editor id='bottom'/>\
                  </VDividedBox>"
        },
        VDividedBox: {
            css: "#vbox { position:relative; width:100%; height:100%; box-sizing: border-box; }\
                  #top { top: 0; height: 30%; } #bottom { bottom: 0; height: calc(70% - 5px); }\
                  #top,#bottom { left: 0; right: 0; position: absolute; }\
                  #handle { height: 5px; width: 100%; position:absolute; left:0; top: 30%; z-index:11; cursor:row-resize; }\
                  #mask { width: 100%; height: 100%; position: absolute; display: none; z-index: 10; }",
            xml: "<div id='vbox'>\
                    <div id='top'/>\
                    <div id='handle' draggable='true'/>\
                    <div id='bottom'/>\
                    <div id='mask'/>\
                  </div>",
            map: { format: {"int": "percent"}, appendTo: "top" }, 
            fun: function (sys, items, opts) {
                var percent = 50;
                sys.handle.on("dragstart", function (e) {
                    sys.mask.show();
                    sys.vbox.on("dragover", dragover);
                });
                sys.vbox.on("dragend", function (e) {
                    sys.mask.hide();
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
        },
        Editor: {
            css: ".CodeMirror { height:100%; height: 100%; font-size: 14px; }\
                  .CodeMirror-gutters { border-right: 1px solid %border-color; background: linear-gradient(to right,%header-gradient-from 0,%header-gradient-to 100%); }\
                  #editor { position: relative; width: 100%; height: 100%; box-sizing: border-box; border: 1px solid #AAA; }",
            map: { nofragment: true },
            opt: { lineNumbers: true, indentUnit: 4, mode: "text/html" }, 
            xml: "<div id='editor'/>",
            fun: function (sys, items, opts) {
                return CodeMirror(sys.editor.elem(), opts);
            }
        }
    });
});