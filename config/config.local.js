module.exports = appInfo => {
    const config = {};
    config.mongoose = {
        clients: {
            db27017: {
                url:'mongodb://127.0.0.1:27017/zlzhidao',
                options:{}
            }
        },
    };


    // config.middleware = ['isCRM','doctorAuth'];
    config.middleware = ['isCRM'];

    config.isCRM = {
        match: '/cs'
    };

    config.doctorAuth = {
        match:'/external/doctor'
    };

    config.io = {
        init: {}, // passed to engine.io
        namespace: {
            '/': {
                connectionMiddleware: [],
                packetMiddleware: [],
            },
            '/chat': {
                connectionMiddleware: [],
                packetMiddleware: [],
            },
            '/wechat': {
                connectionMiddleware: ['authLocal'],
                packetMiddleware: [],
            },
        },
        redis: {
            host: '127.0.0.1',
            port: 6379
        }
    };

    return config;
};