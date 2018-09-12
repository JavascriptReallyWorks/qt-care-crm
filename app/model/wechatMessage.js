module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const WechatMessageSchema = new mongoose.Schema({
        clientId: String,
        createdAt: Date,
        fromUserId: String,
        fromUserName: String,
        msgType: String,
        replyType: Number,
        replierId: String,
        replying: Boolean,

        event: String,
        eventKey: String,
        picUrl: String,
        voiceUrl: String,
        recognition: String,
        content: String,

        mediaId: String,
        content_wechat_append: String,
        intent_name: String,
        tplName: String,

        order: Number,
        page: Number,
        total: Number,
        hits: [{}],   // {} or Object or Schema.Types.Mixed, 任意结构
        btns: [{
            _id: false,
            display: String,
            value: String
        }]


    });

    return conn27017.model('WechatMessage', WechatMessageSchema, 'wechat_message');
}