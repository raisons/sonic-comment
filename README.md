# halo-comment

[Sonic](https://github.com/go-sonic/sonic)博客系统评论插件

移植自Halo 2.0的评论组件[plugin-comment-widget](https://github.com/halo-dev/plugin-comment-widget)，接口重新适配Sonic。

## Usage
> 1. 需要vue3
> 
> 2. 需要将`sonic-comment.css`和`sonic-comment.iife.js`放在相同目录下, 例如sonic的`upload`目录。
> 
> 3. 如果需要emoji表情，也需要将emoji/all.json也放在目录下
> 
> 4. [npm地址](https://www.npmjs.com/package/sonic-comment?activeTab=code)

也可以使用CDN：
```html
<script src="https://cdn.jsdelivr.net/npm/sonic-comment@1.1.0/dist/sonic-comment.iife.js"></script>
```

### 手动引入
1. 无需手动引入css文件，只需引入vue3和`sonic-comment.iife.js`即可，js中会自动加载相同目录下的css文件。
2. 在主题对应的模板文件中加入以下代码
```html
<div id="comment"></div>
<script src="https://cdn.staticfile.org/vue/3.3.4/vue.global.prod.js"></script>
<script src="/upload/sonic-comment.iife.js"></script>
<script>
    SonicComment.init("#comment", {
        target: "posts", // Required， posts|journals|sheets
        targetId: 1, // Required
        emoji: "/upload/emoji/all.json", // Optional
        colorScheme: "light", // Optional, system | dark | light，默认为light
    })
</script>
```

### 使用模板引入

1. 需要现在`后台/系统/博客设置/评论设置`中设置`评论模块JS`, 例如：`/upload/sonic-comment.iife.js`
2. 可以设置`后台/系统/博客设置/评论设置`中选择`评论者头像`
3. 在主题对应的模板文件中合适的位置加入以下代码
    ```html
    {{template "global.sonic_comment" .}}
    ```
