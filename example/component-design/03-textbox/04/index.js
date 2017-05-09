xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<div id='index'>\
                    <button id='focus'>focus</button>\
                    <button id='focus3'>focus 3</button>\
                    <button id='select'>select 2-5</button>\
                    <TextBox id='textbox' value='hello, world'/>\
                  </div>",
            fun: function (sys, items, opts) {
                sys.focus.on("click", e => items.textbox.focus());
                sys.focus3.on("click", e => items.textbox.focus(3));
                sys.select.on("click", e => items.textbox.select(2,5));
            }
        },
        TextBox: {
            xml: "<input id='input' type='text'/>",
            map: { attrs: { input: "disabled value placeholder readonly" } },
            fun: function (sys, items, opts) {
                var e = sys.input.elem();
                function select(start, end){
                    start == undefined && (start = 0);
                    end == undefined && (end = e.value.length);
                    e.focus();
                    e.setSelectionRange(start,end);
                }
                function focus(ptr) {
                    ptr == undefined && (ptr = e.value.length);
                    return select(ptr, ptr);
                }
                return {focus: focus, select: select};
            }
        }
    });
});