module.exports = app => {

    const isLocalhost = app.middlewares.isLocalhost();

    app.post('/localhost/driver/user/create', isLocalhost, app.controller.driverCtrl.userCreate);


    app.post('/localhost/driver/user/create', isLocalhost, app.controller.driverCtrl.userCreate);
    app.post('/localhost/driver/user/update', isLocalhost, app.controller.driverCtrl.userUpdate);
    app.post('/localhost/driver/user/signdoc', isLocalhost, app.controller.driverCtrl.userSigndoc);
    app.post('/localhost/driver/user/record/status', isLocalhost, app.controller.driverCtrl.getUserStatus);
    app.post('/localhost/driver/pland/active/status', isLocalhost, app.controller.driverCtrl.getUserStatus);

    app.post('/localhost/driver/pland/active/change', isLocalhost, app.controller.driverCtrl.changeStatus);


    app.post('/localhost/driver/user/summary/file', isLocalhost, app.controller.driverCtrl.userSummaryFile);
    app.post('/localhost/driver/user/summary/json', isLocalhost, app.controller.driverCtrl.userSummaryJson);

    app.post('/localhost/driver/pland/trial/file', isLocalhost, app.controller.driverCtrl.plandTrialFile);
    app.post('/localhost/driver/pland/trial/json', isLocalhost, app.controller.driverCtrl.plandTrialJson);


};