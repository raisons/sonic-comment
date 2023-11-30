# halo-comment

[Sonic](https://github.com/go-sonic/sonic)博客系统评论插件

移植自Halo 2.0的评论组件[plugin-comment-widget](https://github.com/halo-dev/plugin-comment-widget)

## Usage
引入vue3和js
> 需要将`sonic-comment.css`和`sonic-comment.iife.js`放在相同目录下
```html
<div id="comment"></div>
<script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
<script src="/sonic-comment.iife.js"></script>
<script>
    SonicComment.init("#comment", {
        target: 'posts',
        targetId: 1,
    })
</script>
```
