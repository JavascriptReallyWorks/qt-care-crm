'use strict';
const WechatAPI = require('wechat-api');

//let wechatAPI;

module.exports = app => {
    class wechatService extends app.Service {
        newWechatAPI(token){
            const wechatConfig = this.ctx.app.config.ZLZD_WECHAT_CONFIG;

            this.ctx.app.wechatAPI = new WechatAPI(wechatConfig.appid, wechatConfig.appSecret, function(callback) {
                console.log(new Date().toLocaleTimeString(), ":get token");
                callback(null, token);
            }, function(token, callback) {
                console.log(new Date().toLocaleTimeString(), ":save token", token);
                callback(null, token);
            });
        }

        sendContent(openid, csid, content) {
            const customerServers = app.config.ZLZD_WECHAT_CONFIG;

            let wechatAPI = app.wechatAPI;


            if (csid && customerServers[csid]) {
                wechatAPI.sendTextFromCs(openid, customerServers[csid].kf_account, content, function (err,result) {
                    if (err) {
                        console.log("send error：" + content);
                        console.log(err)
                    } else {
                        console.log("send message success: " + content );
                    }
                });
            } else {
                wechatAPI.sendText(openid, content, function (err,result) {
                    if (err) {
                        console.log("send error：" + content);
                        console.log(err)
                    } else {
                        console.log("send message success: " + content);
                    }
                });
            }
        }

        sendImageMedia(openid, csid, mediaId) {
            const customerServers = app.config.ZLZD_WECHAT_CONFIG;
            let wechatAPI = app.wechatAPI;

            if (csid && customerServers[csid]) {
                wechatAPI.sendImageFromCs(openid, customerServers[csid].kf_account, mediaId, function (err,result) {
                    if (err) {
                        console.log("send error：" + mediaId);
                        console.log(err)
                    } else {
                        console.log("send message success");
                    }
                });
            } else {
                wechatAPI.sendImage(openid, mediaId, function (err,result) {
                    if (err) {
                        console.log("send error：" + content);
                        console.log(err)
                    } else {
                        console.log("send message success");
                    }
                });
            }
        }
    }

    return wechatService;
};
