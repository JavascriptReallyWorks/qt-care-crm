/**
 * Created by lele on 17/10/13.
 */
const WechatAPI = require('wechat-api');

module.exports = {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    schedule: {
        type: 'worker', // 指定所有的 worker 都需要执行
        immediate: true,
        interval: '10m', // 10 分钟间隔
        disable:true, // 暂时关闭
        // disable: process.env.EGG_SERVER_ENV === 'local', // 本地开发环境不执行
    },
    // task 是真正定时任务执行时被运行的函数，第一个参数是一个匿名的 Context 实例
    * task(ctx) {
        //定时获取微信token
        try {
            const wechatConfig = ctx.app.config.ZLZD_WECHAT_CONFIG;

            let api = new WechatAPI(wechatConfig.appid, wechatConfig.appSecret);

            let getToken = () => {
                return new Promise((resolve, reject) => {
                    api.getLatestToken(function (err, token) {
                        if(!err) {
                            resolve(token);
                        }
                        else{
                            ctx.logger.error(`
                                ================== WechatAPI getLatestToken Error ===================
                                Error: ${err}
                            `);
                        }
                    });
                });
            };

            let token = yield getToken();
            if (token) {
                console.log(new Date().toLocaleTimeString(), ":create wechatAPI", wechatConfig.appid, wechatConfig.appSecret);
                ctx.app.messenger.sendToApp('newWechatToken', token);

                // menu
                api.createMenu(ctx.app.CONSTANT.QTC_WECHAT.MENU, function (err) {
                    ctx.logger.error(`
                        ================== WechatAPI createMenu Error ===================
                        Error: ${err}
                    `);
                })
            }
        }
        catch (e) {
            ctx.logger.error(`
                ================== update_token schedule Error ===================
                Error: ${e}
            `);
        }
    }
};