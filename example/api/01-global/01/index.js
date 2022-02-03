xmlplus("xp", function (xp, $_) {
    $_().imports({
        Example: {
            xml: "<h1>hello, world</h1>"
        }
    });
}).ready(function() {
    xp.startup("//xp/Example");
});