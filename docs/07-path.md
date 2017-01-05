# 路径

在xmlplus中，组件是以目录形式组织的，这与传统操作系统的目录树相像。于是组件的引用就分为两种方式，分别是`绝对路径`形式与`相对路径`形式，下面分别论述。

## 绝对路径

## 相对路径

与相对路径相关联的通配符有两个，一个是`.`，它代表当前组件所在的路径。另一个是`..`，它代表当前组件的前一个层级路径。

### 引用同级组件

下面示例中，组件`Index`和`Calendar`属于同级组件，它们都属于根命名空间`xp`。所以在组件`Index`中引用`Calendar`，可以使用路径`.`来代表当前目录。

```javascript
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
			xml: "<i:Calendar xmlns:i='.'/>" // 或者<Calendar/>也可以
		},
        Calendar: {}
    });
});
```

正如上面注释所述，在不会造成冲突的情况下，当前目录也可以忽略不写，直接写成`<Calendar/>`，这样会显得更为简洁。

### 引用上层组件

现在对前一个示例做些修改，把组件`Index`移到空间`xp/form`中。那么，相对组件`Index`而言，组件`Calendar`位于其上一层级，若要引用`Calendar`，就可以通过使用`..`来达到目标。

```javascript
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Calendar: {}
    });
    $_("form").imports({
        Index: {
			xml: "<i:Calendar xmlns:i='..'/>"
		}
    });
});
```