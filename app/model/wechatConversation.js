module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const WechatConversationSchema = new mongoose.Schema({
        $id: String,
        clientId: String,
        clientName: String,
        replyType: Number,
        interactive: Boolean,
        createdAt: Number,
        updatedAt: {type:Number, index: true},
        lastMessage: String,
        lastUserId: String,
        lastUserName: String,
        replierId: { type: String, default: '' },
        replying: { type: Boolean, default: false},
        firstConv: Boolean
    });

    return conn27017.model('WechatConversation', WechatConversationSchema, 'wechat_conversation');
};