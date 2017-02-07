xmlplus("xp", function ( xp, $_, t) {
  $_().imports({
      Index: {
          xml: "<button id='foo'>foo</button>",
          fun: function (sys, items, opts) {
              console.log(xp.isArray([])); // 这里xp与xmlplus等价
              sys.foo.on("click", function (e) {
                  console.log("hello, world");
              });
              sys.foo.css("border", "1px solid red").text("bar");
          }
      }
  });
});