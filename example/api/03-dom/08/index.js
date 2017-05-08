xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Example: {
            xml: "<div id='example'>\
                    <h1 id='hello'>hello</h1>\
                  </div>",
            fun: function (sys, items, opts) {
                console.log(sys.example.contains(null));             // false
                console.log(sys.example.contains(document.body));    // false
                console.log(sys.example.contains(sys.example));      // true
                console.log(sys.example.contains(sys.hello));        // true
                console.log(sys.example.contains(sys.hello.elem())); // true
            }
        }
    });
});