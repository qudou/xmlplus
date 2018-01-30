# 井字棋

井字棋（TicTacToe）是一个老少皆宜的小游戏，我们来看看如何设计与实现它。下面会涉及不少与 xmlplus 相关的知识点，当然你不需要都看懂，有个大概感觉就好了。当你学完[《文档》](/docs)的相关内容后，再来看看这一节，也许会有新的收获。

<img src="data:image/png;base64,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" class="img-responsive"/>

## 方块组件

我们从最简单的地方开始，先实现游戏界面网格的方块组件。方块组件非常简单，仅需要一个 `div` 元素和一些样式就好了，具体请看下面的代码：

```js
// 03-01
Square: {
    css: "#square { line-height: 48px; width: 48px; height: 48px; text-align: center; }\
          #square { margin-right: -1px; margin-top: -1px; padding: 0; border: 1px solid #999;}",
    xml: "<div id='square'/>",
}
```

这个方块组件的长宽都是 `48px`，另外设置的值均为 `-1` 的 `margin-right` 和 `margin-top` 是为布局服务的，用于防止出现重复的边框。

此组件是一个简单的 `JSON` 对象，其中 `xml` 子项叫做视图项，`css` 子项叫做样式项，它们之间通过视图项中的 `div` 元素的 `id` 值联系起来。

## 网格组件

这里我们利用上面实现的 `9` 个方块组件组合成一个网格组件。具体请看下面的代码：

```js
// 03-01
Board: {
    css: "#board { width: 148px; height: 148px; margin: 0 auto; }\
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

观察该组件的视图项部分，每一个方块都被按顺序编了号。再看此网格组件的样式项部分可知，该组件的长宽均被设置为 `148px`，这是足够的，因为组件 Square 的 `margin-right` 和 `margin-top` 均被设置为 `-1`。

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