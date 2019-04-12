module.exports = app => {
  const jwt = app.middleware.jwt();

  //qtc-officical-web 保险会员登录
  // app.get('/api/insurance/getOrder',  app.controller.insurance.order.show);

  //qtc-officical-web 获取当前用户保单列表
  app.get('/api/insurance/getUserOrders', jwt, app.controller.insurance.order.getUserOrders);

  //qtc-officical-web 根据保单id获取某一个保单信息
  app.get('/api/insurance/getOrderById/:id', jwt, app.controller.insurance.order.getOrderById);

};

