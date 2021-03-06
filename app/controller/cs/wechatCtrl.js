const wechat = require('co-wechat');
const fs = require('fs');

module.exports = app => {
    class wechatCtrl extends app.Controller {

    }

    wechatCtrl.prototype.wechat = wechat(app.config.ZLZD_WECHAT_CONFIG).middleware(async(message, ctx) => {

        let openid = message.FromUserName;

        let appName = ctx.params.source;
        if (appName) {
            message.appName = appName;
        }

        let getUserP = new Promise((resolve, reject) => {
            ctx.service.userService.queryOneUserByOpenId(openid, function(user) {
                if (user) {
                    resolve(user);
                } else {
                    if(process.env.EGG_SERVER_ENV === 'prod') {
                        let wechatAPI = app.wechatAPI;
                        wechatAPI.getUser(openid, function (err, result) {
                            ctx.logger.error(`
                                ================== wechatAPI.getUser  ===================
                                userDate: ${result} 
                            `);

                            let userData = {
                                ...result,
                                user_type:'wechat',
                            };

                            let newUser = new ctx.model.User(userData);
                            newUser.save(function (err) {
                                if(!err)
                                    resolve(userData);
                            });

                        });
                    }
                    else{   // 测试环境
                        let user = {
                            nickname:'新用户:' + Date.now().toString().substr(-4),
                            openid,
                            user_type:'wechat',
                        };
                        let newUser = new ctx.model.User(user);
                        newUser.save(function (err) {
                            if(!err)
                                resolve(user);
                        });
                    }
                }

            })
        });

        getUserP.then(async (user) => {
            let wcUser = {
                fromUserId: user.openid,
                fromUserName: user ? (user.nickname || user.user_name || ('用户:' + Date.now().toString().substr(-6))) : ('用户:' + Date.now().toString().substr(-6))
            };

            // 查询单个对话
            let pack = {
                operation:{
                    method:'GET_ONE',
                    table:'CONVERSATION'
                },
                payload:{
                    clientId:openid
                }
            };

            let conv = await ctx.service.pubsubService.get(pack);
            if (conv) {
                ctx.service.conversationService.pushMessage(wcUser, message);
            } else {
                await ctx.service.conversationService.createConversation(wcUser, message);
            }
        }).catch(function(err) {
            console.error(err)
        });
        fs.appendFile("./messages.txt", JSON.stringify(message) + "\n");
        return '';
    });


    return wechatCtrl;
};