xmlplus("xp", function (xp, $_) {
    $_().imports({
        Example: {
            fun: async function (sys, items, opts) {
				await xp.delay(1000);
				console.log("hello, world");
            }
        }
    });
});