module.exports = app => {
  // qtc-officical-web QTC Care会员登录
  app.post('/api/qtcWeb/login', app.controller.qtc.officialWeb.login);

  // qtc-officical-web 发送验证码
  app.get('/api/qtcWeb/sendCode/:phone', app.controller.qtc.officialWeb.sendCode);
};