'use strict';
const path = require('path');

// had enabled by egg
exports.static = true;

exports.jade = {
    enable: true,
    package: 'egg-view-jade'
};

exports.mongoose = {
    enable: true,
    package: 'egg-mongoose',
};

exports.passport = {
    enable: true,
    package: 'egg-passport',
};

exports.passportLocal = {
    enable: true,
    package:'egg-passport-local',
};

exports.redis = {
    enable: true,
    package: 'egg-redis',
};

exports.validate = {
    enable: true,
    package: 'egg-validate',
};

exports.io = {
    enable: true,
    package: 'egg-socket.io',
};

exports.rest = {
    enable: true,
    package: 'egg-rest',
};

exports.cors = {
    enable: true,
    package: 'egg-cors',
};

exports.oss = {
    enable: true,
    package: 'egg-oss',
};

exports.sms = {
  enable: true,
  package: 'egg-sms',
};

exports.jwt = {
  enable: true,
  package: 'egg-jwt',
};