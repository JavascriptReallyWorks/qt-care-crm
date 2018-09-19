'use strict';

const util = require('util');


module.exports = app => {
    class conversationService extends app.Service {

        //redis启动成功后监听
        async newMessage(message) {
            const { ctx, service } = this;
            if (message && (message.fromUserId !== message.clientId)) { // 非客户发出的消息

                // 传给 wechatAPI
                let uid = message.clientId;

                if (typeof message === 'string') {
                    app.wechatAPI.sendText(uid, message, function (err,result) {
                        if (err) {
                            ctx.logger.error(`
                                ================== app.wechatAPI.sendText error ===================
                                Message: ${message} 
                                Error: ${err}
                            `);
                        }
                    });
                }

                if (message !== null && typeof message === 'object') {
                    let content = "";
                    let msgType = (message.msgType || "").toUpperCase();
                    switch (msgType) {
                        case "TEXT":
                            content = message.content || "";
                            content = ctx.helper.getWechatHtmlContent(content);
                            //TODO 上传html中的图片
                            if (content.trim() !== "")
                                app.wechatAPI.sendText(uid, content, function (err,result) {
                                    if (err) {
                                        if (err) {
                                            ctx.logger.error(`
                                                ================== app.wechatAPI.sendText error ===================
                                                Message: ${message} 
                                                Error: ${err}
                                            `);
                                        }
                                    }
                                });
                            break;

                        case "IMAGE":
                            if (message.mediaId) {
                                app.wechatAPI.sendImage(uid, message.mediaId, function (err,result) {
                                    if (err) {
                                        ctx.logger.error(`
                                            ================== app.wechatAPI.sendImage error ===================
                                            Message: ${message} 
                                            Error: ${err}
                                        `);
                                    }
                                });
                            }
                            else{
                                ctx.logger.error(`
                                    ================== app.wechatAPI.sendImage NO message.mediaId ===================
                                    Message: ${message} 
                                `);
                            }
                            break;

                        default:
                            break;
                    }
                }
            }
        };

        async createConversation(user, message) {
            const { ctx, service } = this;
            let data = {
                clientId: user.fromUserId,
                clientName: user.fromUserName,
                firstConv: true,
                replyType: app.config.CONSTANT.CONVER.REPLY_TYPE.LZJ,
                createdAt: (new Date()).getTime(),
                updatedAt: (new Date()).getTime(),
            };

            let pack = {
                operation:{
                    method:'POST_ONE',
                    table:'CONVERSATION'
                },
                payload:data
            };

            await service.pubsubService.publish('chat', pack);
            await ctx.helper.delay(1000);
            this.pushMessage(user, message);

        };

        pushMessage(user, message) {
            const { ctx, service } = this;
            createNewMessage(ctx, user, message).then(async function(newMsg) {
                newMsg.clientId = user.fromUserId || message.FromUserName;
                //  发送新消息
                let pack = {
                    operation:{
                        method:'POST_ONE',
                        table:'MESSAGE'
                    },
                    payload:newMsg
                };
                await service.pubsubService.publish('chat', pack);
            });
        };

    }

    return conversationService;
};


let createNewMessage = function(ctx, user, message) {
    let newMsg = {
        fromUserId: message.FromUserName,
        fromUserName: user.fromUserName,
        createTime: message.CreateTime,
        msgType: message.MsgType,
        createdAt: (new Date()).getTime()
    };


    let msgType = message.MsgType.toUpperCase();


    return new Promise((resolve, reject) => {
        switch (msgType) {
            case "TEXT":
                newMsg.content = message.Content;
                resolve(newMsg);
                break;
            case "EVENT":
                newMsg.event = message.Event;
                newMsg.eventKey = (message.EventKey && message.EventKey !== "") ? message.EventKey : message.Event;
                resolve(newMsg);
                break;

            case "IMAGE":
                newMsg.picUrl = message.PicUrl;
                newMsg.mediaId = message.MediaId;
                //下载图片
                downloadImg(ctx, newMsg, function(fileUrl) {
                    console.log("fileUrl", fileUrl)
                    if (fileUrl) {
                        newMsg.picUrl = fileUrl;
                    }
                    resolve(newMsg);
                });
                break;
            case "VOICE":
                newMsg.format = message.Format || "";
                newMsg.recognition = message.Recognition || "";
                newMsg.mediaId = message.MediaId || "";
                newMsg.msgId = message.MsgId || "";
                downloadVoice(ctx, newMsg, function(fileUrl) {
                    if (fileUrl) {
                        newMsg.voiceUrl = fileUrl;
                    }
                    console.log(newMsg)
                    resolve(newMsg);
                });
                break;
            case "VIDEO":
                newMsg.thumbMediaId = message.ThumbMediaId;
                newMsg.mediaId = message.MediaId;
                resolve(newMsg);
                break;
            case "SHORTVIDEO":
                newMsg.thumbMediaId = message.ThumbMediaId;
                newMsg.mediaId = message.MediaId;
                resolve(newMsg);
                break;
            case "LOCATION":
                newMsg.location_X = message.Location_X;
                newMsg.location_Y = message.Location_Y;
                newMsg.scale = message.Scale;
                newMsg.label = message.Label;
                resolve(newMsg);
                break;
            case "LINK":
                newMsg.title = message.Title;
                newMsg.description = message.Description;
                newMsg.url = message.Url;
                resolve(newMsg);
                break;
        }
        // resolve(newMsg);
    });
};

/* deprecated
let sendMessage = function(ctx, message) {

    let wechatService = ctx.service.wechatService;

    let uid = message.clientId;
    if (message) {
        if (util.isString(message)) {
            wechatService.sendContent(uid, null, message);
        }
        let content = "";
        if (util.isObject(message)) {
            let msgType = (message.msgType || "").toUpperCase();
            switch (msgType) {
                case "TEXT":
                    content = message.content || message.text || "";
                    content = ctx.helper.getWechatHtmlContent(content);
                    //TODO 上传html中的图片
                    if (content.trim() !== "")
                        wechatService.sendContent(uid, message.fromUserId, content);
                    break;

                case "IMAGE":
                    if (message.mediaId) {
                        wechatService.sendImageMedia(uid, message.fromUserId, message.mediaId);
                    }
                    break;
                default:
                    content = message.content || message.text || "";
                    if (content.trim() !== "")
                        wechatService.sendContent(uid, message.fromUserId, content);
                    break;
            }
        }
    }
};
*/


let downloadImg = function(ctx, newMsg, callback) {
    let wechatAPI = ctx.app.wechatAPI;
    console.log("downloadImg", newMsg.mediaId)
    wechatAPI.getMedia(newMsg.mediaId, function(err, result, res) {

        if (!err) {
            ctx.service.uploadService.uploadBuffer(newMsg.picUrl, newMsg.mediaId, result, function(data) {
                let fileUrl = newMsg.picUrl;
                if (data.url) {
                    fileUrl = data.url.replace(/^http:/, "");

                }
                callback(fileUrl);
            })
        }
    });
};


let downloadVoice = function(ctx, newMsg, callback) {
    let wechatAPI = ctx.app.wechatAPI;
    console.log("downloadVoice")
    wechatAPI.getMedia(newMsg.mediaId, function(err, result, res) {
        if (!err) {
            ctx.service.uploadService.downloadVoice(result, newMsg.mediaId, function(data) {
                console.log(data);
                let fileUrl = data.url ? data.url.replace(/^http:/, "") : "";
                callback(fileUrl);
            })
        }
    });
};