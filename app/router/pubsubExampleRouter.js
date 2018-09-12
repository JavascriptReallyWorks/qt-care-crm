module.exports = app => {
    app.post('/pubsub/login',  app.controller.cs.pubsubExampleCtrl.login);
    app.get('/pubsub/logout',  app.controller.cs.pubsubExampleCtrl.logout);
    app.post('/pubsub/getUser',  app.controller.cs.pubsubExampleCtrl.getUser);
    app.get('/pubsub/singleChat',  app.controller.cs.pubsubExampleCtrl.singleChat);
    app.get('/pubsub/multiChat',  app.controller.cs.pubsubExampleCtrl.multiChat);
    app.post('/pubsub/convIdOfUser',  app.controller.cs.pubsubExampleCtrl.convIdOfUser);



};