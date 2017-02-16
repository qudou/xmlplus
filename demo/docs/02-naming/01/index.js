xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
           css: "#dog { color: red; }\
                 #cat { color: blue; }\
                 #animal { background: green; }",
           xml: "<div>\
                     <h1 id='dog'>dog</h1>\
                     <h1 id='cat'>cat</h1>\
                 </div>",
           ali: { animal: "/div/h1" },
           fun: function (sys, items, opts) {
               console.log(sys.dog.text());
               console.log(sys.cat.text());
               sys.animal.call("css", "border", "1px solid black");
           }
        }
    });
});