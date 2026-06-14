xmlplus("xp", function (xp, $_) {
    $_().imports({
        TicTacToe: {
            css: "#index { text-align: center; margin: 20px; }",
            xml: "<div id='index'>\
                    <Board id='board'/>\
                    <div id='next'>Next player: O</div>\
                    <a id='start' href='javascript:void(0)'>Game start</a>\
                  </div>",
			fun: function (sys, items, opts) {
                let squares = Array(9).fill(null);
                const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],[1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
				sys.start.on("click", e => {
					items.board.clear();
					sys.next.text('Next player: X');
					squares = Array(9).fill(null);
				});
                sys.board.on("e/board/change", (e, i) => {
                    let o = e.target.text() == 'O' ? 'X' : 'O';
                    sys.next.text("Next player: " + o);
                    squares[i] = e.target.text();
                    for (let i = 0; i < lines.length; i++) {
                        const [a, b, c] = lines[i];
                        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
							items.board.lock();
							sys.next.text("Winner: " + squares[a])
						}
                    }
                });
			}
        },
        Board: {
            css: "#board { width: 148px; height: 148px; margin: 0 auto; }\
                  #board div { float: left; font-size: 36px; font-weight: bold; }",
            xml: "<div id='board'>\
                    <Square id='0'/><Square id='1'/><Square id='2'/>\
                    <Square id='3'/><Square id='4'/><Square id='5'/>\
                    <Square id='6'/><Square id='7'/><Square id='8'/>\
                  </div>",
            fun: function (sys, items, opts) {
                let curr, locked = 0;
                function clear() {
                    locked = 0;
                    sys.board.kids().call("text", '');
                }
				function lock() {
					locked = 1;
				}
                sys.board.on("click", "//Square", function() {
                    if (locked || this.text() != '') return;
                    curr = this.text(curr && curr.text() == 'O' ? 'X' : 'O');
                    curr.trigger("e/board/change", [parseInt(this + '')]);
                });
				return { clear, lock };
            }
        },
        Square: {
            css: "#square { line-height: 48px; width: 48px; height: 48px;  text-align: center; }\
                  #square { margin-right: -1px; margin-top: -1px; padding: 0; border: 1px solid #999;}",
            xml: "<div id='square'/>",
        }
    });
});