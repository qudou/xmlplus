# 路径

在xmlplus中，组件是以目录形式组织的，这与传统操作系统的目录树相像，但有一些差别。于是组件的引用就分为两种方式，分别是绝对路径形式与相对路径形式，下面分别进行论述。

## 绝对路径

因为组件空间中可以包含多个根空间，所以要描述一个组件的绝对路径，必需以双反斜杆`//`开头，其后跟着的是根空间。请看下面的示例。

```javascript
xmlplus("mx", function (xp, $_, t) {
    $_().imports({
        Calendar: {}
    });
});
xmlplus("xp", function (xp, $_, t) {
    $_().imports({
        Index: {
            xml: "<i:Calendar xmlns:i='//mx'/>"
        }
    });
});
```

该示例中包含两个根空间，分别是`mx`和`xp`。其中，根空间`mx`包含组件`Calendar`，根空间`xp`包含组件`Index`，并且在`Index`中通过绝对路径引用了`Calendar`。

## 相对路径

与相对路径相关联的通配符有三个，一个是`/`，它代表根空间。另一个是`.`，它代表当前组件所在的路径。还有一个是`..`，它代表当前组件的前一个层级路径。

### 通过根通配符`/`引用组件

下面示例中，组件`Calendar`位于空间`//xp/form`，组件`Index`位于空间`//xp`，它们具有相同的根空间。所以在组件`Index`中可以通过指定路径`/form`来访问`Calendar`。

```javascript
xmlplus("xp", function (xp, $_, t) {
    $_("form").imports({
        Calendar: {}
    });
    $_().imports({
        Index: {
            xml: "<i:Calendar xmlns:i='/form'/>" // 也可以使用<i:Calendar xmlns:i='//form'/>
        }
    });
});
```

### 通过当前目录通配符`.`引用组件

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

### 通过上一层级通配符`..`引用组件

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

最后，对于同根空间组件的引用，应尽可能使用相对路径的方式。这有两个好处：一来可以简化引用空间来源的书写，另外当要更改根空间名称时，只需改动一个地方即可。