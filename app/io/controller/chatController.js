
const CONVERSATION_ROOM_KEY = 'conversation_room';

module.exports = app => {
    class ChatController extends app.Controller {

        async userConnect(){
            const {ctx, service} = this;
            const pack = ctx.args[0];
            pack.type && service.socketService.userConnect(pack.type, ctx.session.passport.user._id, ctx.socket.id);
        }

        async joinRooms(){
            const {ctx} = this;
            try {
                let conversations = await ctx.model.WechatConversation.find({replierId: ctx.session.passport.user._id},{_id:1});
                conversations.forEach(async conv => {
                    let roomId = await app.redis.hget(CONVERSATION_ROOM_KEY,conv._id);
                    if(roomId){
                        ctx.socket.join(roomId);
                    }

                })

            } catch (err){
                throw err;
            }
        }

        async chat(){
            const {ctx, service} = this;
            const pack = ctx.args[0];
            const condRule = {
                operation: {
                    type:'object',
                    rule:{
                        method: 'string',
                        table: 'string',
                    }
                },
                payload: 'object'
            };
            // 校验参数
            ctx.validate(condRule, pack);
            try {
                const {operation, payload} = pack;
                const option = (operation.method + '_' + operation.table).toUpperCase();
                switch(option){
                    case 'GET_MULTI_MESSAGE':
                        try {
                            let data = await service.chatService.GET_MULTI_MESSAGE(payload.condition, payload.paging);
                            ctx.socket.emit('chat', {
                                operation:operation,
                                payload:data
                            });
                        } catch (err){
                            throw err;
                        }
                        break;

                    case 'GET_MULTI_CONVERSATION':
                        try {
                            let data = await service.chatService.GET_MULTI_CONVERSATION(payload.condition, payload.paging);
                            ctx.socket.emit('chat', {
                                operation:operation,
                                payload:data
                            });
                        } catch (err){
                            throw err;
                        }
                        break;

                    case 'POST_ONE_MESSAGE':
                    case 'PUT_ONE_CONVERSATION':
                    default:
                        service.pubsubService.publish('chat',pack);
                        break;

                }

            } catch (err){
                throw err;
            }
        }

        async GET_ONE_CONVERSATION(){
            const {ctx, service} = this;
            const pack = ctx.args[0];
            const condRule = {
                operation: {
                    type:'object',
                    rule:{
                        method: 'string',
                        table: 'string',
                    }
                },
                payload: 'object'
            };
            // 校验参数
            ctx.validate(condRule, pack);
            try {
                const {operation, payload} = pack;
                let data = await service.chatService.GET_ONE_CONVERSATION(payload);
                ctx.socket.emit('GET_ONE_CONVERSATION', {
                    operation:operation,
                    payload:data
                });

            } catch (err){
                throw err;
            }
        }
    }
    return ChatController;
};