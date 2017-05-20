# 井字棋

井字棋（TicTacToe）是一个老少皆宜的小游戏，我们来看看如何设计与实现它。下面会涉及不少与 xmlplus 相关的知识点，当然你不需要都看懂，有个大概感觉就好了。当你学完[《文档》](/docs)的相关内容后，再来看看这一节，也许会有新的收获。

<img src="data:image/png;base64,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" class="img-responsive"/>

## 方块组件

我们从最简单的地方开始，先实现游戏界面网格的方块组件。方块组件非常简单，仅需要一个 div 元素和一些样式就好了，具体请看下面的代码：

```js
// 03-01
Square: {
    css: "#square { line-height: 64px; width: 64px; height: 64px; text-align: center; }\
          #square { margin-right: -1px; margin-top: -1px; padding: 0; border: 1px solid #999;}",
    xml: "<div id='square'/>",
}
```

这个方块组件的长宽都是 `64px`，另外设置的值均为 `-1` 的 `margin-right` 和 `margin-top` 是为布局服务的，用于防止出现重复的边框。

此组件是一个简单的 JSON 对象，其中 `xml` 子项叫做视图项，`css` 子项叫做样式项，它们之间通过视图项中的 `div` 元素的 `id` 值联系起来。

## 网格组件

这里我们利用 9 个上面实现的方块组件组合成一个网格组件。具体请看下面的代码：

```js
// 03-01
Board: {
    css: "#board { width: 196px; height: 196px; margin: 0 auto; }\
          #board div { float: left; font-size: 36px; font-weight: bold; }",
    xml: "<div id='board'>\
            <Square id='0'/><Square id='1'/><Square id='2'/>\
            <Square id='3'/><Square id='4'/><Square id='5'/>\
            <Square id='6'/><Square id='7'/><Square id='8'/>\
          </div>",
    fun: function (sys, items, opts) {
        let curr, locked;
        sys.board.on("click", "//Square", function() {
            if (locked || this.text() != '') return;
            curr = this.text(curr && curr.text() == 'O' ? 'X' : 'O');
            curr.notify("board-change", [parseInt(this + '')]);
        });
        this.watch("game-start", e => {
            locked = false;
            sys.board.children().call("text", '');
        });
        this.watch("winner", e => locked = true);
    }
}
```

观察该组件的视图项部分，每一个方块都被按顺序编了号。再看此网格组件的样式项部分可知，该组件的长宽均被设置为 `196px`，这是足够的，因为组件 Square 的 `margin-right` 和 `margin-top` 均被设置为 `-1`。

注意该组件内部比方块组件多出了一个名为 `fun` 的子项，该子项叫做函数项，函数项包含了实现一些组件对象的初始化代码。此组件的函数项包含了方块的点击事件的响应代码以及对两个消息的侦听代码。对于具体的细节，可以先不理解。在读完本节内容后，你应该特别留意各组件对象之间是如何通过事件与消息之间传递来协作完成任务的。

## 胜负的判断

为了简化网格组件的内部逻辑，我们把胜负的判断独立出一个组件，该组件与网格组件之间的信息交互由系统的消息通信机制来实现。

```js
// 03-01
Winner: {
    fun: function (sys, items, opts) {
        let squares = Array(9).fill(null);
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],[1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        this.watch("board-change", (e, i) => {
            squares[i] = e.target.text();
            for (let i = 0; i < lines.length; i++) {
                const [a, b, c] = lines[i];
                if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
                    return this.notify("winner", squares[a]);
            }
        }).watch("game-start", e => squares = Array(9).fill(null));
    }
}
```

该组件对胜负的判断非常的机械化，但却是有效的。它的做法是遍历三横三纵和两对角线，看看是否有连成一线的，如果有的话派发一个消息后就返回。

## 消息面板组件

消息显示面板的作用主要是给出游戏过程中的一些文字提示，以及提供一个可以重新开始游戏的按钮。

```js
// 03-01
Info: {
    xml: "<div id='info'>\
            <div id='next'>Next player: X</div>\
            <a id='start' href='javascript:void(0)'>Game start</a>\
          </div>",
    fun: function (sys, items, opts) {
        this.watch("board-change", (e, i) => {
            let o = e.target.text() == 'O' ? 'X' : 'O';
            sys.next.text("Next player: " + o);
        }, 1);
        this.watch("winner", (e, winner) => {
            sys.next.text("Winner: " + winner)
        });
        sys.start.on("click", e => this.notify("game-start"));
        this.watch("game-start", e => sys.next.text('Next player: X'));
    }
}
```

该组件内部同样是通过系统的消息通信机制与其它组件进行通信。当用户点击游戏开始按钮时，该组件会派发一个游戏开始的消息；当接收到判断胜负的组件发来的消息时，则会显示胜负的结果；另外该组件还侦听了网格组件的变化以及时给出下一个落子用户的提示。

## 三组件的整合

有了上面实现的网格组件、胜负判断组件以及消息面板组件，我们通过简单的组合就可以得到我们预期的可工作的 TicTacToe 了。

```js
// 03-01
TicTacToe: {
    css: "#index { text-align: center; margin: 20px; }",
    xml: "<div id='index'>\
            <Board id='board'/>\
            <Winner id='winner'/>\
            <Info id='info'/>\
          </div>",
    map: { msgscope: true }
}
```

注意该组件内部多出了一个 `map` 子项，该子项叫映射项，它主要包含一个与组件相关的配置内容。上面包含为真值的 `msgscope` 用于隔离消息作用域，它可以防止消息之间污染。具体内容可以在 [消息与通信](/docs#消息与通信) 中找到。