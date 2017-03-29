# 动态接口

在上一章，结合示例讲了如何构建自定义组件，以及如何从抽象的角度看待组件。抽象的意义在于封装用户不必知道的细节，只暴露用户需要知晓的接口。从这一章开始就来具体谈谈与组件相关的接口。

组件的接口可分为静态接口与动态接口两部分。所谓静态接口，可以理解为在组件初始化时允许给组件提供的参数。而由函数项所返回的公有属性或者函数，则是可被使用任意多次的，称为动态接口。

静态接口由标签属性、相关联的配置项以及参数项按一定的优先级综合指定，最后生成的参数值会作为函数项的第三个参数传入。动态接口按提供者划分，又可以分为全局接口、系统对象接口与值对象接口。本章只谈动态接口，静态接口留待下一章讲述。

## 全局接口

全局接口由全局对象 xmlplus 或 xp 提供。下面给出的是所有的全局接口列表。

- [startup](/api#全局-startup)：实例化一个组件
- [guid](/api#全局-guid)：获取系统内的唯一的全局标识符
- [error](/api#全局-error)：抛出一个错误
- [ready](/api#全局-ready)：在页面文档加载后激活回调函数
- [type](/api#全局-type)：判断一个对象的所属类型
- [isWindow](/api#全局-isWindow)：判断一个对象是不是窗体
- [isArray](/api#全局-isArray)：判断一个对象是不是数组类型
- [isFunction](/api#全局-isFunction)：判断一个对象是不是函数类型
- [isNumeric](/api#全局-isNumeric)：判断一个对象是否数值型
- [isPlainObject](/api#全局-isPlainObject)：判断一个对象是简单对象
- [isEmptyObject](/api#全局-isEmptyObject)：判断一个对象是否空对象
- [isSystemObject](/api#全局-isSystemObject)：判断一个对象是否框架的系统对象
- [extend](/api#全局-extend)：将两个或多个对象的内容合并到第一个对象中
- [expand](/api#全局-expand)：对系统接口进行扩展
- [each](/api#全局-each)：遍历一个数组或者其它对象
- [parseXML](/api#全局-parseXML)：将给定的字符串解析为 XML 文档
- [hasNamespace](/api#全局-hasNamespace)：判定当前系统是否包含给定的命名空间
- [hasComponent](/api#全局-hasComponent)：判定当前系统中是否包含给定的组件
- [clearLibrary](/api#全局-clearLibrary)：按照给定的模式清除当前系统中相关命名空间及组件
- [getElementById](/api#全局-getElementById)：由给定的标识符获取相关对象

对于这些接口的使用，下面仅给出了几个示例，具体内容请参看 [全局接口](/api#全局)。

```js
// 04-01
console.log(xp.isArray([]));          // true
console.log(xp.isPlainObject({}));    // true
console.log(xp.isSystemObject(null)); // false
``` 

## 系统对象接口

系统对象接口只有系统对象才拥有，系统对象接口可简称为系统接口。按功能来划分，系统接口可以分为五大类：

### 集合对象接口

集合对象接口也称为集体对象接口。如[《命名》](/docs#命名)章节中所述，系统对象可以分为个体对象与集体对象。集体对象的部分接口源自数组，下面给出的是非数组包含的集体对象接口。

- [call](/api#集合-call)：遍历集合对象，并调用给定的函数，其中函数的参数由函数名的后续实参提供
- [hash](/api#集合-hash)：将类数组形式的集合对象转化包含键值对的普通对象
- [values](/api#集合-values)：将包含系统对象的集合转化成包含值对象的集合

对于上述接口的具体细节请参看 [集合接口](/api#集合)。下面的接口是集体对象拥有的数组对象接口。

```
every | forEach | indexOf | map | pop | push | shift | slice | some | splice | unshift
```

这些接口的用法与普通数组的接口用法一致。不过需要注意，上述的 `slice` 函数已经过改造，其返回的是集合对象。

### 与 DOM 元素相关的接口

由于每一组件对象都对应一个 DOM 元素对象，所以系统提供了相关的操作 DOM 元素对象的接口。通过这些系统接口可以间接地操作 DOM 元素对象，以下简称 DOM 元素对象为节点。

- [text](/api#DOM-text)：获取或者设置节点的文本
- [prop](/api#DOM-prop)：获取或者设置节点的属性值
- [removeProp](/api#DOM-removeProp)：移除节点的属性值
- [attr](/api#DOM-attr)：获取或者设置节点的属性值
- [removeAttr](/api#DOM-removeAttr)：移除节点的属性值
- [addClass](/api#DOM-addClass)：添加类
- [removeClass](/api#DOM-removeClass)：移除类
- [contains](/api#DOM-contains)：判断当前对象的是否包含给定对象
- [css](/api#DOM-css)：获取或者设置样式值
- [show](/api#DOM-show)：显示节点
- [hide](/api#DOM-hide)：隐藏节点
- [width](/api#DOM-width)：获取或者设置节点的宽度
- [height](/api#DOM-height)：获取或者设置节点的高度
- [offsetParent](/api#DOM-offsetParent)：获取最近定位的祖先元素
- [offset](/api#DOM-offset)：获取或者设置节点的偏移
- [position](/api#DOM-position)：获取节点的位置
- [scrollTop](/api#DOM-scrollTop)：返回或设置当前对象的滚动条的垂直位置
- [scrollLeft](/api#DOM-scrollLeft)：返回或设置当前对象的滚动条的水平位置

对于上述接口的详细用法请参看 [DOM 接口](/api#DOM)。

### 与组件生命周期相关的接口

这类接口主要完成组件对象的创建、移除与替换的操作。

- [append](/api#生命周期-append)：给当前组件对象子级追加一个组件对象
- [before](/api#生命周期-before)：在当前组件对象之前插入一个组件对象
- [replace](/api#生命周期-replace)：用新的组件对象替换掉当前组件对象
- [remove](/api#生命周期-remove)：移除掉当前组件对象

这些接口的用法在后续章节[《生命周期》](/docs#life-circle)中有详细的介绍。

### 组件检索接口

这类接口用于在视图项的组件对象集中检索相关的组件对象。

- [sys](/api#检索-sys)：以文档节点为上下文查找对象，返回系统对象集
- [items](/api#检索-items)：以文档节点为上下文查找对象，返回组件值对象集
- [find](/api#检索-find)：以当前节点为上下文查找对象，返回系统对象集
- [get](/api#检索-get)：获取当前节点某一子节点对象，返回系统对象
- [first](/api#检索-first)：获取当前节点的第一个子节点对象，返回系统对象
- [last](/api#检索-last)：获取当前节点的最后一个子节点对象，返回系统对象
- [next](/api#检索-next)：获取当前节点的下一个节点对象，返回系统对象
- [prev](/api#检索-prev)：获取当前节点的前一个节点对象，返回系统对象
- [children](/api#检索-children)：获取当前节点的所有子节点对象，返回系统对象集

上面的接口中，前两个比较特殊，它们属于通用检索接口，分别等于函数项的前两个参数。它们的用法在后续章节[《检索》](docs#searching)中会有详细的介绍。

### 与组件通信相关接口

这类接口用于在各组件对象之间进行通信。通信分为两类，一类是事件通信，另一类是消息通信。下面的系统接口中，前四者属于事件通信接口，后四者属于消息通信接口。

- [on](/api#通信-on)：侦听事件
- [off](/api#通信-off)：取消事件侦听
- [once](/api#通信-once)：仅一次侦听事件
- [trigger](/api#通信-trigger)：派发事件
- [watch](/api#通信-watch)：侦听消息
- [unwatch](/api#通信-unwatch)：取消消息侦听
- [glance](/api#通信-glance)：仅一次侦听消息
- [notify](/api#通信-notify)：派发消息

这些接口的用法在后续章节[《事件与通信》](docs#事件与通信)及[《消息与通信》](docs#消息与通信)中有详细的介绍。

### 其它类别接口

这类接口用于获取或者设置与组件对象相关联的一些信息。

- [value](/api#其它-value)：获取组件对象的值对象
- [localName](/api#其它-localName)：获取组件对象相应的组件名
- [namespace](/api#其它-namespace)：获取组件对象所属的命名空间
- [guid](/api#其它-guid)：获取组件对象的唯一标识符
- [toString](/api#其它-toString)：获得组件对象的 id 或者唯一标识符
- [serialize](/api#其它-serialize)：序列化视图项或者视图项所对应的 HTML DOM 文档树
- [data](/api#其它-data)：获取或者设置组件所绑定的数据
- [removeData](/api#其它-removeData)：移除组件所绑定的数据

## 值对象接口

不同于系统对象接口，值对象接口由函数项返回。值对象接口可以简称为值接口。通过函数项的第二个参数可以获取值对象接口。下面结合前面设计的组件 IPv4Box 来看看值对象接口的使用。

```js
// 04-02
Index: {
    xml: "<Ipv4Box id='ipbox'/>",
    fun: function (sys, items, opts) {
        items.ipbox.value = "192,168,0,1";
        console.log(items.ipbox.value);
        console.log(sys.ipbox.value() == items.ipbox);
    }
}
```

对于接口 value 的使用，前一章已经讲过了，这里主要注意函数项的最后一行。运行示例，控制台打印出的值是 `true`，这说明系统函数 `sys.ipbox.value` 的返回值与 `items.ipbox` 是相等的。下面是 `value` 接口的一种可能的使用方式：

```js
sys.ipbox.css("color","blue").value().value = "192,168,0,1";
```

上面代码中，系统函数 `css` 返回的是 `sys.ipbox` 的引用。系统函数 `value` 属于 `sys.ipbox` 的一个接口。`value` 函数不用提供任何的输入参数，它返回的是对等的 `items.ipbox` 的引用。在某些场合，这可以简化代码的书写。

## 不同类型对象之间的接口差异

在[《组件与空间》](/docs#组件与空间)中，描述了系统内部的五种组件类型。按照拥有的接口数量划分，可以分为两类，其中 HTML 元素对象和自定义组件对象拥有所有的系统对象接口（排除 `sys` 与 `items`），而其余的组件，包括文本，CDATASection 描述以及注释，则只拥有如下的部分系统接口。

- [before](/api#生命周期-before)：在当前对象之前插入一个对象
- [replace](/api#生命周期-replace)：替换掉当前对象
- [remove](/api#生命周期-remove)：移除掉当前对象
- [next](/api#检索-next)：获取当前节点的下一个节点对象，返回系统对象集
- [prev](/api#检索-prev)：获取当前节点的前一个节点对象，返回系统对象集
- [text](/api#其它-text)：获取或者设置节点的文本
- [guid](/api#其它-guid)：获取组件对象的唯一标识符
- [toString](/api#其它-toString)：获得组件对象的 id 或者唯一标识符

另外，根据系统的运行环境不同，HTML 元素对象和自定义组件对象所拥有系统对象接口也有区别。在浏览器端，它们拥有前面所述的所有系统对象接口。但在服务端，以下接口不可见。

- [width](/api#DOM-width)：获取或者设置节点的宽度
- [height](/api#DOM-height)：获取或者设置节点的高度
- [offsetParent](/api#DOM-offsetParent)：获取最近定位的祖先元素
- [offset](/api#DOM-offset)：获取或者设置节点的偏移
- [position](/api#DOM-position)：获取节点的位置
- [scrollTop](/api#DOM-scrollTop)：返回或设置当前对象的滚动条的垂直位置
- [scrollLeft](/api#DOM-scrollLeft)：返回或设置当前对象的滚动条的水平位置