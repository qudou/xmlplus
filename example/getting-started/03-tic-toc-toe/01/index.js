/*!
 * tictactoe v1.0.0
 * https://xmlplus.cn
 * (c) 2017-2026 qudou
 * Released under the MIT license
 */

const [PLAYER, AI, EMPTY] = ['X', 'O', ''];
const winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],[1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

xmlplus("xp", function (xp, $_) {

$_().imports({
	TicTacToe: {
		css: "#ai { text-align: center; }\
			  #title { font-size: 2.5rem; margin-bottom: 20px; text-shadow: 0 0 10px rgba(100, 200, 255, 0.5); }",
		xml: "<AI id='ai'>\
		        <h1 id='title'>井字棋</h1>\
				<Status id='status'/>\
				<Board id='board'/>\
                <ResetButton id='reset'/>\
			  </AI>",
		fun: function (sys, items, opts) {
			let gameActive = true;
			let board = Array(9).fill(EMPTY);

			sys.board.on("e/cell/click", async (e, index) => {
				if (board[index] !== '' || !gameActive) return;
				makeMove(index, PLAYER);
				if (!gameActive) return;
				await xp.delay(300);
				makeMove(items.ai.minimax(board, AI).index, AI);
			});
			function makeMove(index, player) {
				board[index] = player;
				items.board.makeMove(index, player);
				let winner = items.ai.checkWinner(board);
				if (winner) {
					gameActive = false;
					items.board.lightWinner(board, winner);
					sys.status.text(winner === PLAYER ? '恭喜你赢了！' : 'AI赢了！');
				} else if (board.every(cell => cell !== EMPTY)) {
					gameActive = false;
					sys.status.text('平局！');
				} else {
					sys.status.text(player === PLAYER ? 'AI思考中...' : '你的回合 (X)');
				}
			}
			sys.reset.on("e/resetGame", () => {
				board = Array(9).fill(EMPTY);
				gameActive = true;
				items.board.reset();
				sys.status.text('你的回合 (X)');
			});
		}
	},
	AI: {
		xml: "<div id='computer'/>",
		fun: function (sys, items, opts) {
			function minimax(b, player, isMaximizing = true) {
				const winner = checkWinner(b);
				if (winner === AI) return { score: 10 };
				if (winner === PLAYER) return { score: -10 };
				if (b.every(cell => cell !== EMPTY)) return { score: 0 };
				const moves = [];
				for (let i = 0; i < 9; i++) {
					if (b[i] === EMPTY) {
						b[i] = player;
						const result = minimax(b, player === AI ? PLAYER : AI, !isMaximizing);
						moves.push({ index: i, score: result.score });
						b[i] = EMPTY;
					}
				}
				let bestMove;
				if (isMaximizing) {
					let bestScore = -Infinity;
					for (const move of moves) {
						if (move.score > bestScore) {
							bestScore = move.score;
							bestMove = move;
						}
					}
				} else {
					let bestScore = Infinity;
					for (const move of moves) {
						if (move.score < bestScore) {
							bestScore = move.score;
							bestMove = move;
						}
					}
				}
				return bestMove;
			}
			function checkWinner(b) {
				for (let pattern of winPatterns) {
					let [a, c, d] = pattern;
					if (b[a] && b[a] === b[c] && b[a] === b[d])
						return b[a];
				}
			}
			return { minimax, checkWinner };
		}
	},
	Status: {
		css: "#status { font-size: 1.5rem; margin-bottom: 20px; min-height: 40px; color: #64c8ff; }",
		xml: "<div id='status'>你的回合 (X)</div>"
	},
	Board: {
		css: "#board { display: grid; grid-template-columns: repeat(3, 100px); grid-template-rows: repeat(3, 100px); gap: 8px; margin: 0 auto 30px; width: fit-content; }\
		      #board div { width: 100px; height: 100px; background: rgba(255, 255, 255, 0.1); border: 2px solid rgba(100, 200, 255, 0.3); border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 3rem; font-weight: bold; cursor: pointer; transition: all 0.3s ease; }\
			  #board div:hover:not(.taken) { background: rgba(100, 200, 255, 0.2); transform: scale(1.05); }\
			  .$taken { cursor: not-allowed; }\
			  .$X { color: #ff6b6b; text-shadow: 0 0 15px rgba(255, 107, 107, 0.7); }\
			  .$O { color: #51cf66; text-shadow: 0 0 15px rgba(81, 207, 102, 0.7); }\
			  .$winner { animation: $pulse 0.5s ease-in-out infinite alternate; }\
			  @keyframes $pulse { from { transform: scale(1); } to { transform: scale(1.1); } }",
		xml: "<div id='board'>\
				<div id='0'/><div id='1'/><div id='2'/>\
				<div id='3'/><div id='4'/><div id='5'/>\
				<div id='6'/><div id='7'/><div id='8'/>\
			  </div>",
		fun: function (sys, items, opts) {
			let cells = sys.board.kids();
			sys.board.on("click", "//div/div", function() {
                this.trigger("e/cell/click", parseInt(this));
			});
			function makeMove(index, player) {
				cells[index].text(player);
				cells[index].addClass(`$taken $${player}`);
			}
			function reset() {
				cells.forEach(cell => {
					cell.text('');
					cell.removeClass(`$taken $X $O $winner`);
				});
			}
			function lightWinner(board, winner) {
                const winIndices = winPatterns.find(pattern => 
                    pattern.every(i => board[i] === winner)
                );
				winIndices.forEach(i => cells[i].addClass(`$winner`));
			}
			return { makeMove, reset, lightWinner }
		}
	},
	ResetButton: {
		css: "#resetButton { display: flex; gap: 15px; justify-content: center; }\
			  #resetGame { padding: 12px 30px; font-size: 1rem; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; font-weight: bold;}\
			  #resetGame { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }\
			  #resetGame:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4); }",
		xml: "<div id='resetButton'>\
			    <button id='resetGame'>重新开始</button>\
			  </div>",
		fun: function (sys, items, opts) {
			sys.resetGame.on("click", () => this.trigger(`e/resetGame`));
		}
	}
});

});