/**
 * Created by lele on 17/10/13.
 */
const WechatAPI = require('wechat-api');

module.exports = {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    schedule: {
        type: 'worker', // 指定所有的 worker 都需要执行
        immediate: true,
        interval: '100m', // 100 分钟间隔
        disable: process.env.EGG_SERVER_ENV === 'local', // 本地开发环境不执行
    },
    // task 是真正定时任务执行时被运行的函数，第一个参数是一个匿名的 Context 实例
    * task(ctx) {
        //定时获取微信token

        const wechatConfig = ctx.app.config.ZLZD_WECHAT_CONFIG;

        let api = new WechatAPI(wechatConfig.appid, wechatConfig.appSecret);

        let getToken = () => {
            return new Promise((resolve, reject) => {
                if (process.env.EGG_SERVER_ENV === 'prod') {
                    api.getLatestToken(function(err, token) {
                        resolve(token);
                    });
                } else {
                    resolve({ "access_token": "JSi5TouUaDR-n4n1Oc7gr0uuDz2LlF8X3vfqEuIxE7pYduYnB9WAh8FhidsAuD8O_vQeR4QY7NWsL8LQCY-oQVeIwGspbL5UaF_d6UP5_Q2FX0_FCw-uLcFzsydB8tN_SXXeAFAHMM", "expires_in": 7200 });
                }
            });
        };

        let token = yield getToken();
        if (token) {
            console.log(new Date().toLocaleTimeString(), ":create wechatAPI", wechatConfig.appid, wechatConfig.appSecret);
            ctx.app.messenger.sendToApp('newWechatToken',token);
        }
    }
};