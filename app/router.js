'use strict';

module.exports = app => {
    require('./router/authRouter')(app);
    require('./router/csRouter')(app);
    require('./router/ioRouter')(app);
    require('./router/pubsubExampleRouter')(app);
    require('./router/driverRouter')(app);
    require('./router/externalRouter')(app);
    require('./router/wechatRouter')(app);
    require('./router/qtc')(app);
    require('./router/insurance')(app);
};