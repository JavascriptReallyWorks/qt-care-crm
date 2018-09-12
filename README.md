获取请求参数
```
this.ctx.query
this.ctx.params
this.ctx.request.body

```

设置 Header
```
通过 ctx.set(key, value) 方法可以设置一个响应头，ctx.set(headers) 设置多个 Header
```

angular 线上webpack环境 => 本地非打包测试环境
```
// config.defaults.js
config.static = {
    prefix: '',
    // dir: path.join(appInfo.baseDir, 'app/public/build')  //线上webpack环境
    dir: path.join(appInfo.baseDir, 'app/public')   //本地非打包测试环境
};

// csCtrl.js
async cs() {
    // await  this.ctx.render('cs.jade', { user: this.ctx.user });  //线上webpack环境
    await  this.ctx.render('cs_test.jade', { user: this.ctx.user });     //本地非打包测试环境
}
```