'use strict';
const fs = require('fs');
const path = require("path");
const crypto = require('crypto');
const env = process.env.EGG_SERVER_ENV;
const Config = require('./config/config.json');


const kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.KafkaClient({
        kafkaHost: Config.kafka.kafkaHost,
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
        try{
            // 初始化数据
            app.loader.loadFile(path.join(app.config.baseDir, 'app/seed.js'));
        }
        catch (err){
            app.logger.error(`
                ================== app beforeStart err  ===================
                Error: ${err}
            `);
        }
    });

    app.ready(()=>{
        const ctx = app.createAnonymousContext();
        try {

            // init kafka producer and consumerGroup
            app.producer = producer;
            ctx.service.pubsubService.initKafkaListener();


            // 禁用, by Yang
            //ctx.service.migrationService.migrateMedicalRecord();
        }
        catch (err){
            ctx.logger.error(`
                ================== app.ready error ===================
                Error: ${err}
            `);
        }
    });


    // initial clean task for a random worker from agent
    app.messenger.on('initialClean', async () => {
        const ctx = app.createAnonymousContext();
        ctx.service.socketService.removePreviousSocket();   //删除启动前 redis 剩余的socket记录
    });

    // 定时更新 微信公众 token
    app.messenger.on('newWechatToken', token => {
        const ctx = app.createAnonymousContext();
        try {
            ctx.service.wechatService.newWechatAPI(token);
        }
        catch (err){
            ctx.logger.error(`
                ================== app.messenger.on("refreshWechatService") error ===================
                Error: ${err}
            `);
        }
    });



    // login strategy, triggered by passport plugin
    app.passport.verify(function*(ctx, user) {
        try {
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
            let userWithMenu = {...loginUser};
            userWithMenu.role = yield ctx.model.CrmRole.findOne({name: userWithMenu.crm_role});
            if (userWithMenu.crm_admin) {
                userWithMenu.role.menu.push({
                    "name": "在线问答管理",
                    "url": ".answer_chat_manager"
                }, {
                    "name": "用户管理",
                    "url": ".user_manager"
                }, {
                    "name": "服务管理",
                    "url": ".product_service"
                });
            }
            return userWithMenu; //赋值 ctx.passport.user && ctx.user
        }
        catch (err){
            ctx.logger.error(`
                ================== app.passport.verify error ===================
                Error: ${err}
            `);
        }
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

        // 从gateway上迁移的api返回格式
        httpSuccess(data) {
          const res = { success: true };
          if (data) {
              res.data = data;
          }
          this.ctx.body = res;
        }

        // 从gateway上迁移的api返回格式
        httpFail(message) {
            this.ctx.body = {
                message,
                success: false,
            };
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
