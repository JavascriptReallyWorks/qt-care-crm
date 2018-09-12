'use strict';

const CONVERSATION_ROOM_KEY = 'conversation_room';

module.exports = app => {
    class socketService extends app.Service {
        async newEmission(conversation, operation, payload, preConversation){   //conversation更新后， preConversation更新前
            const {ctx, service} = this;
            const pack = {
                operation,
                payload
            };

            // 通知普通工作人员(客服，销售)
            if(operation.subMethod){        // PUT_ONE_CONVERSATION, 对话状态改变(接入，结束对话，指派), 改变replierId或replyType
                switch(pack.operation.subMethod.toUpperCase()){
                    case 'M_TO_1':
                        try {
                            // role channel, 删除排队对话, 前端对话被删除
                            const role = app.config.CONSTANT.CONVER.REPLY_TYPE_MAP[preConversation.replyType];
                            role && app.io.of('/wechat').emit(role, pack);

                            // room channel, 新增对话， 如果新replier在线，前端新增同一个对话
                            await ctx.helper.delay(300);    // 延迟 300ms
                            let newRoomId = conversation._id.toString() + Date.now();
                            await app.redis.hset(CONVERSATION_ROOM_KEY,conversation._id.toString(),newRoomId);
                            let socketIds = await app.redis.smembers('normal_socket_' + conversation.replierId);    // 新的replierId对应的socket
                            if(socketIds.length) {
                                let promises = [];
                                socketIds.forEach(socketId => {
                                    // console.log('socketId is for current user is: ' + socketId);
                                    promises.push(new Promise((resolve, reject) => {
                                        let socket = app.io.of('/wechat').sockets[socketId];
                                        if (socket) {
                                            socket.join(newRoomId, function (err) {
                                                if (!err)
                                                    resolve();
                                            });
                                        }
                                        else {
                                            resolve();
                                        }
                                    }));
                                });
                                await Promise.all(promises);
                                app.io.of('/wechat').in(newRoomId).emit('room_message', pack);
                            }
                        }
                        catch (err){
                            throw err;
                        }
                        break;

                    case '1_TO_1':
                        // room channel, 前一个接入者前端删除对话
                        let roomId = await app.redis.hget(CONVERSATION_ROOM_KEY,conversation._id.toString());
                        if(roomId){
                            app.io.of('/wechat').in(roomId).emit('room_message', pack);
                        }

                        // room channel, 如果新replier在线, 新replier前端新增对话
                        await ctx.helper.delay(300);
                        let newRoomId = conversation._id.toString() + Date.now();
                        await app.redis.hset(CONVERSATION_ROOM_KEY,conversation._id.toString(),newRoomId);
                        let socketIds = await app.redis.smembers('normal_socket_' + conversation.replierId);
                        let promises = [];
                        socketIds.forEach(socketId => {
                            promises.push(new Promise((resolve, reject) => {
                                let socket = app.io.of('/wechat').sockets[socketId];
                                if (socket) {
                                    socket.join(newRoomId, function (err) {
                                        if (!err)
                                            resolve();
                                    });
                                }
                                else {
                                    resolve();
                                }
                            }));
                        });
                        await Promise.all(promises);
                        app.io.of('/wechat').in(newRoomId).emit('room_message', pack);
                        break;

                    case '1_TO_M':
                        try{
                            // room channel, 前端删除对话
                            let roomId = await app.redis.hget(CONVERSATION_ROOM_KEY,conversation._id.toString());
                            if(roomId){
                                app.io.of('/wechat').in(roomId).emit('room_message', pack);
                            }
                            await app.redis.hdel(CONVERSATION_ROOM_KEY,conversation._id.toString());

                            await ctx.helper.delay(300);    // 延迟 300ms, 考虑到在同一replyType下由个人转入排队，同一个前端页面删除和新增之间需要delay
                            // role channel, 新增排队对话
                            const role = app.config.CONSTANT.CONVER.REPLY_TYPE_MAP[conversation.replyType];
                            role && app.io.of('/wechat').emit(role, pack);

                        }
                        catch (err){
                            throw err;
                        }
                        break;

                    case 'M_TO_M':
                        // old role channel, 删除排队对话, 前端对话被删除
                        const preRole = app.config.CONSTANT.CONVER.REPLY_TYPE_MAP[preConversation.replyType];
                        preRole && app.io.of('/wechat').emit(preRole, pack);

                        // new role channel, 新增排队对话
                        await ctx.helper.delay(300);
                        const role = app.config.CONSTANT.CONVER.REPLY_TYPE_MAP[conversation.replyType];
                        role && app.io.of('/wechat').emit(role, pack);
                        break;
                }
            }
            else {
                if(conversation.replierId){     // 如果已接听，room里广播
                    try {
                        let roomId = await app.redis.hget(CONVERSATION_ROOM_KEY, conversation._id.toString());
                        app.io.of('/wechat').in(roomId).emit('room_message', pack);
                    } catch (err){
                        throw err;
                    }
                }
                else{   // 未接听，role channel
                    const role = app.config.CONSTANT.CONVER.REPLY_TYPE_MAP[conversation.replyType];
                    role && app.io.of('/wechat').emit(role, pack);
                }
            }

            // 通知admin
            app.io.of('/wechat').emit('admin', pack);

        }

        async userConnect(userType, userId,socketId){
            await app.redis.sadd(userType + '_socket_' + userId, socketId);
        }

        async userDisconnect(userId, socketId){
            await app.redis.srem('normal_socket_' + userId, socketId);
        }

        removePreviousSocket(){
            let stream = app.redis.scanStream({
                match: 'normal_socket_*'
            });
            stream.on('data', function (keys) {
                // `keys` is an array of strings representing key names
                if (keys.length) {
                    let pipeline = app.redis.pipeline();
                    keys.forEach(function (key) {
                        pipeline.del(key);
                    });
                    pipeline.exec();
                }
            });
            stream.on('end', function () {
                console.log('delete previous socket done');
            });
        }
    }

    return socketService;
};