'use strict';
const fs = require('fs');
const path = require("path");
const crypto = require('crypto');
const env = process.env.EGG_SERVER_ENV;

const kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.KafkaClient({
        kafkaHost: "localhost:9092",
        connectRetryOptions:{
            retries: 10,
            factor: 2,
            minTimeout: 1 * 1000,
            maxTimeout: 60 * 1000,
            randomize: true,
        },
    });

const producer = new Producer(client);


module.exports = app => {
    app.beforeStart(async () => {
        // 应用会等待这个函数执行完成才启动	+        // Load seed
        app.logger.info('加载初始化数据...');
        app.loader.loadFile(path.join(app.config.baseDir, 'app/seed.js'));
    });

    // from agent
    app.messenger.on('csListener', data => {
        const ctx = app.createAnonymousContext();
        ctx.runInBackground(async () => {
            await ctx.service.pubsubService.newPublication(data);
        });
    });

    app.messenger.on('initService', async data => {
        const ctx = app.createAnonymousContext();
        app.producer = producer;

        ctx.service.driverService.watchDriverServer();
        ctx.service.socketService.removePreviousSocket();   //删除启动前 redis 剩余的socket记录
        let resourcePath = app.config.resourcePath;
        if (!fs.existsSync(resourcePath.mp3Path)) {
            fs.mkdirSync(resourcePath.mp3Path);
        }
        if (!fs.existsSync(resourcePath.voicePath)) {
            fs.mkdirSync(resourcePath.voicePath);
        }
        if (!fs.existsSync(resourcePath.userFilePath)) {
            fs.mkdirSync(resourcePath.userFilePath);
        }
        if (!fs.existsSync(resourcePath.download)) {
            fs.mkdirSync(resourcePath.download);
        }

        // 禁用
        //ctx.service.migrationService.migrateMedicalRecord();
    });

    app.messenger.on('refreshWechatService', token => {
        const ctx = app.createAnonymousContext();
        ctx.service.wechatService.newWechatAPI(token);
    });



        // triggered by passport plugin
    app.passport.verify(function*(ctx, user) {

        //ucsf环境暂时disable验证码
        let captchaInput = ctx.request.body.captcha;
        if (env === 'prod') {
            if (captchaInput.toUpperCase() !== ctx.session.captcha.toUpperCase())
                return null;
        }

        if (user.password) {
            let hash = crypto.createHash("sha1");
            hash.update(user.password);
            user.password = hash.digest('hex');
        }

        let loginUser = yield ctx.model.User.findOne({
            name: user.username,
            pass: user.password,
            crm_role: {$exists: true}
        }, {pass: 0}).lean();
        if (!loginUser) return null;
        let userWithMenu = {...loginUser}; // 防止直接给mongoose model赋值
        let crmRole = yield ctx.model.CrmRole.findOne({ name: userWithMenu.crm_role });
        userWithMenu.role = crmRole;
        if (userWithMenu.crm_admin) {
            userWithMenu.role.menu.push({
                "name": "在线问答管理",
                "url": ".answer_chat_manager"
            }, {
                "name": "用户管理",
                "url": ".user_manager"
            }, {
                "name":"服务管理",
                "url":".product_service"
            });
        };
        console.log('---loginUser--')
        console.log(loginUser)
        return userWithMenu; //赋值 ctx.passport.user && ctx.user
    });


    class CustomController extends app.Controller {
        get user() {
            return this.ctx.user;
        }

        get req() {
            return this.ctx.request;
        }

        get body() {
            return this.ctx.request.body;
        }

        get userService() {
            return this.ctx.service.userService;
        }

        get csService() {
            return this.ctx.service.csService;
        }

        get wechatService() {
            return this.ctx.service.wechatService;
        }

        get tool() {
            return this.ctx.service.tool;
        }

        get pubsubService() {
            return this.ctx.service.pubsubService;
        }

        success(content) {
            var res = {};
            if (content) res = { content };
            res.status = 'ok';
            this.ctx.body = res;
        }

        fail(content) {
            var res = {};
            if (content) res = { content };
            res.status = 'fail';
            this.ctx.body = res;
        }

        json(data) {
            this.ctx.body = data;
        }

        notFound() {
            this.ctx.body = null;
        }

        checkAndRespond(data) {
            if (data) this.success(data);
            else this.notFound();
        }

        failAndRespond(data) {
            if (data) this.fail(data);
            else this.notFound();
        }

        checkStatusAndRespond(data) {
            if (data && data.status === 'ok') this.success();
            else this.notFound();
        }
    }
    app.Controller = CustomController;
};
