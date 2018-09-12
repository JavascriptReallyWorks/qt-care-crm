const mock = require('egg-mock');
const assert = require('assert');

const mockUser = {
        _id:'59ee8103534dc8bfe350941c',
        "name" : "catxxx",
        "nickname" : "catxxx",
        "crm_role" : "qt_cs",
        "crm_admin" : true,
        "user_type" : "crm"
    };

describe('pubsubService', () => {


    let app,ctx,constant;
    before(() => {
        app = mock.app();
        return app.ready();
    });
    beforeEach(() => {
        ctx = app.mockContext({
            user: mockUser
        });
    });
    // afterEach(mock.restore);


    it('pubsubService create one conversation', async () => {
        let data = {
            clientId: mockUser._id,
            clientName: mockUser.nickname,
            replyType: 230,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        let pack = {
            operation:{
                method:'POST_ONE',
                table:'CONVERSATION'
            },
            payload:data
        };
        await ctx.service.pubsubService.publish('chat', pack);

        await ctx.helper.delay(300);    // 延迟 300ms
        // 检查更新对话
        let conv = await ctx.model.WechatConversation.findOne({createdAt:data.createdAt});
        // assert(conv);
        assert.equal(conv.clientId, data.clientId);
        assert.equal(conv.clientName, data.clientName);
        assert.equal(conv.replyType, data.replyType);
        assert.equal(conv.createdAt, data.createdAt);
        assert.equal(conv.updatedAt, data.updatedAt);

        await ctx.model.WechatConversation.findByIdAndRemove(conv._id);
    });



    it('pubsubService get many conversations', async () => {
        let options = {
            condition: {
                replyType: 'manual',
            },
            paging: {
                from: 'last',
                page: 1,
                pageSize: 10
            }
        };

        let pack = {
            operation:{
                method:'GET_MULTI',
                table:'CONVERSATION'
            },
            payload:options
        };

        let data = await ctx.service.pubsubService.get(pack);
        assert(data.count);
        assert(data.conversations);
    });


    it('pubsubService get one conversation', async () => {
        let conversation = await ctx.model.WechatConversation.findOne();
        let pack = {
            operation:{
                method:'GET_ONE',
                table:'CONVERSATION'
            },
            payload:{
                clientId:conversation.clientId
            }
        };

        let data = await ctx.service.pubsubService.get(pack);
        assert.equal(data._id.toString(), conversation._id.toString());
    });


    it('pubsubService get many messages', async () => {
        let message = await ctx.model.WechatMessage.findOne();
        let options = {
            condition: {
                clientId: message.clientId
            },
            paging: {
                from: 'last',
                page: 1,
                pageSize: 10
            }
        };
        let pack = {
            operation:{
                method:'GET_MULTI',
                table:'MESSAGE'
            },
            payload:options
        };

        let data = await ctx.service.pubsubService.get(pack);
        assert(data.count);
        assert(data.messages);
        assert(data.messages.length = 10);
    });



    it('pubsubService create message >>> update conversation', async () => {
        let conversation = await ctx.model.WechatConversation.findOne();
        let data = {
            content: 'new message' + Date.now(),
            msgType: 'text',
            clientId: conversation.clientId,
            fromUserId: mockUser._id,
            fromUserName: mockUser.nickname,
            createdAt: Date.now(),
            replyType: otherReplyType(conversation.replyType),
            replierId: otherReplierId(conversation.replierId),
            replying: true,
        };
        await ctx.service.pubsubService.publish('chat', {
            operation:{
                method:'POST_ONE',
                table:'MESSAGE'
            },
            payload:data
        });

        await ctx.helper.delay(300);
        // 检查新建消息
        let newMessageArr = await ctx.model.WechatMessage.find().sort({_id:-1}).limit(1);
        let newMessage = newMessageArr[0];
        assert.equal(newMessage.content, data.content);
        assert.equal(newMessage.msgType, data.msgType);
        assert.equal(newMessage.clientId, data.clientId);
        assert.equal(newMessage.fromUserId, data.fromUserId);
        assert.equal(newMessage.fromUserName, data.fromUserName);

        // 检查更新对话
        let conv = await ctx.model.WechatConversation.findOne({clientId:conversation.clientId});
        assert.equal(conv.lastMessage, data.content);
        assert.equal(conv.lastUserId, data.fromUserId);
        assert.equal(conv.updatedAt, data.createdAt);
    });


    it('pubsubService update conversation with subMethod M_TO_1 and 1_TO_M', async () => {
        let conversation = await ctx.model.WechatConversation.findOne({
            replying:false,
            replierId:''
        });

        // M_TO_1
        let data = {
            _id:conversation._id,
            replierId: mockUser._id,
        };
        await ctx.service.pubsubService.publish('chat', {
            operation:{
                method:'PUT_ONE',
                subMethod:'M_TO_1',
                table:'CONVERSATION'
            },
            payload:data
        });

        await ctx.helper.delay(300);
        // 检查更新对话
        let conv = await ctx.model.WechatConversation.findOne({_id:conversation._id});
        assert.equal(conv.replierId, data.replierId);
        assert.equal(conv.replying, true);


        // 1_TO_M
        let data1 = {
            _id:conversation._id,
            replyType: conversation.replyType,
        };
        await ctx.service.pubsubService.publish('chat', {
            operation:{
                method:'PUT_ONE',
                subMethod:'1_TO_M',
                table:'CONVERSATION'
            },
            payload:data1
        });

        await ctx.helper.delay(300);
        // 检查更新对话
        let conv1 = await ctx.model.WechatConversation.findOne({_id:conversation._id});
        assert.equal(conv1.replierId, '');
        assert.equal(conv1.replying, false);
    });
});





let otherReplyType = function (replyType) {
    var types = [230, 310, 450, 460];
    for(let i=0; i<types.length; i++){
        if(types[i] !== replyType)
            return types[i];
    }
};

let otherReplierId = function (replierId) {
    if(!replierId || replierId !== mockUser._id)
        return mockUser._id;
    else
        return '59ee8124534dc8bfe350941d'; // qt_cs_1
}
