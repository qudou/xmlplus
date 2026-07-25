# 井字棋

这节我们来实现一个人机对战的井字棋（TicTacToe）游戏，我们来看看如何设计与实现它。源码会涉及不少与 xmlplus 相关的知识点，当然你不需要都看懂，有个大概感觉就好了。当你学完[《文档》](/docs)的相关内容后，再来看看这一节，也许会有新的收获。

该游戏在浏览器中打开即可运行，根据游戏界面的直观结构进行划分，我门在设计时，把游戏划分为三个部分，并对应三个组件。另外加上 AI ，此游戏大体分为四个模块。

## 状态栏

本组件用于显示游戏气处的状态，如：AI 正在思考、轮到哪方下或者赢家是谁等等。

```js
// 03-01
Status: {
	css: "#status { font-size: 1.5rem; margin-bottom: 20px; min-height: 40px; color: #64c8ff; }",
	xml: "<div id='status'>你的回合 (X)</div>"
}
```

## 游戏面板

本组件是玩家与 AI 对战的战场，由九个方块组成，像个井字，故名井字棋棋。

```js
// 03-01
Board: {
	css: "...",
	xml: "<div id='board'>\
			<div id='0'/><div id='1'/><div id='2'/>\
			<div id='3'/><div id='4'/><div id='5'/>\
			<div id='6'/><div id='7'/><div id='8'/>\
		  </div>",
	fun: function (sys, items, opts) {
		// ...
		return { makeMove, reset, lightWinner }
	}
}
```

## 重置按钮

本按钮用于重置游戏，玩家在任何时候可以重新开始与 AI 对战。

```js
// 03-01
ResetButton: {
	css: "...",
	xml: "<div id='resetButton'>\
			<button id='resetGame'>重新开始</button>\
		  </div>",
	fun: function (sys, items, opts) {
		sys.resetGame.on("click", ()=> this.trigger(`e/resetGame`));
	}
}
```

## AI 模块

本组件采用经典的 minmax 算法来实现核心的机器走棋功能，所以，玩家永远也赢不了 AI，最好的结果就是和棋。

```js
// 03-01
	AI: {
		xml: "<div id='computer'/>",
		fun: function (sys, items, opts) {
			function minimax(b, player, isMaximizing = true) {
				// ...
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
	}
```