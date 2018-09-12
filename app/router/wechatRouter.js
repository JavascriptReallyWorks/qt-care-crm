module.exports = app => {
    app.get('/api/wechat', app.controller.cs.wechatCtrl.wechat);
    app.post('/api/wechat', app.controller.cs.wechatCtrl.wechat);
};