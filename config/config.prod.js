'use strict';

const path = require('path');

module.exports = appInfo => {
    const config = {};

    config.signingKey = "ZE8265NUE8XBLER304L4HV5B16K3AZOG7VCIH6JW9OJ3NLDMP3MRG15J46XAS3XVFZCAMBFK80DB9MUPQ17ELU"; //Ceiling(4 * 64 /3)
    config.encryptionKey = "RU05G79PWM89ZBHWCFLG0KH6035UOV74SG02EOD115F"; // Ceiling(4 * 32 /3)

    config.static = {
        prefix: '',
        dir: path.join(appInfo.baseDir, 'app/public/build')
    };

    config.mongoose = {
        clients: {
            db27017: {
                url:'mongodb://127.0.0.1:27017/qtc',
                options:{},
            }
        },
    };

    config.security = {
        csrf: {
            enable: false
        },
        domainWhiteList: ['http://localhost:7001']
    };

    config.middleware = ['isCRM'];

    config.isCRM = {
        match: '/cs'
    };

    return config;
};
