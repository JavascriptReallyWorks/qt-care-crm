module.exports = app => {
    app.get('/login', 'authCtrl.login');
    app.get('/change_password', app.controller.authCtrl.changePassword);
    app.post('/change_password', app.controller.authCtrl.newPassword);

    app.get('/logout', 'authCtrl.logout');
    app.post('/forget_password', app.controller.authCtrl.forgetPassword);
    app.get('/getCaptcha', 'authCtrl.getCaptcha');

    app.post('/doctor_login', app.controller.authCtrl.doctorLogin);
    app.post('/doctor_register', app.controller.authCtrl.doctorRegister);

    // login passport
    const options = {
        successRedirect:'/cs',
        failureRedirect: '/login?params=wrong'
    };
    const local = app.passport.authenticate('local', options);
    app.post('/login', local);


};