
module.exports = app => {
    class ChatService extends app.Service {

        async POST_ONE_CONVERSATION(pack){
            const {service} = this;
            try{
                let wc = await app.model.WechatConversation.create(pack.payload);
                await service.socketService.newEmission(wc, pack.operation, wc);
            } catch(err) {
                throw err;
            }
        }

        async PUT_ONE_CONVERSATION(pack){
            const {service} = this;
            if(!pack.payload._id)
                return;

            try{
                let wc = await app.model.WechatConversation.findById(pack.payload._id);
                let preWc = Object.assign({},wc.toObject());    // 没有toObject()的话，mongo数据存在wc._doc里
                let _payload = Object.assign({},pack.payload);
                // 强制更新 updatedAt
                _payload.updatedAt = Date.now();
                delete _payload._id;
                if(pack.operation.subMethod){   // 接入，结束对话，指派, 改变replierId或replyType
                    switch(pack.operation.subMethod.toUpperCase()){
                        case 'M_TO_1':
                            if(!_payload.replierId) {
                                return;
                            }
                            else{
                                _payload.replying = true;
                            }
                            break;

                        case '1_TO_1':
                            if(!_payload.replierId || !_payload.replyType) {
                                return;
                            }
                            else{
                                _payload.replying = true;
                            }
                            break;

                        case '1_TO_M':
                            if(!_payload.replyType) {
                                return;
                            }
                            else{
                                _payload.replying = false;
                                _payload.replierId = '';
                            }
                            break;


                        case 'M_TO_M':
                            if(!_payload.replyType) {
                                return;
                            }
                            else{
                                _payload.replying = false;
                                _payload.replierId = '';
                            }
                            break;
                    }
                }
                wc.set(_payload);
                let newWc = await wc.save();

                // 如果变为有效问答，通知在有效问答页面的管理员
                if(!preWc.interactive && newWc.interactive){
                    let newOperation = {
                        method:'POST_ONE',
                        table:'INTERACTIVE_CONVERSATION'
                    };
                    await service.socketService.newEmission(newWc, newOperation, newWc);
                }

                await service.socketService.newEmission(newWc, pack.operation, newWc, preWc);

            } catch(err) {
                throw err;
            }
        }

        async POST_ONE_MESSAGE(pack){
            const {service} = this;
            if(!pack.payload.clientId)
                return;
            try{
                let message = await app.model.WechatMessage.create(pack.payload);
                let wc = await app.model.WechatConversation.findOne({clientId:message.clientId});
                await service.socketService.newEmission(wc, pack.operation, message);


                let lastMessage;
                switch(pack.payload.msgType.toUpperCase()){
                    case 'TEXT':
                        lastMessage = service.tool.delHtmlTag(pack.payload.content);
                        break;

                    case 'IMAGE':
                        lastMessage = "[IMAGE]";
                        break;

                    case 'VOICE':
                        lastMessage = "[VOICE]";
                        break;

                    case 'EVENT':
                        lastMessage = "EVENT: " + pack.payload.event.toUpperCase();
                        break;

                    case 'OPERATION':
                        lastMessage = "[转入人工]";
                        break;

                    default:
                        lastMessage = "UNSUPPORTED MESSAGE";
                        break;
                }
                // publish更新对话的
                let newPayload = {
                    _id: wc._id.toString(),
                    lastMessage,
                    lastUserId: pack.payload.fromUserId,
                    lastUserName: pack.payload.fromUserName,
                    updatedAt: pack.payload.createdAt
                };
                // if (pack.payload.replyType)
                //     newPayload.replyType = pack.payload.replyType;
                if (pack.payload.hasOwnProperty('replierId'))
                    newPayload.replierId = pack.payload.replierId;
                if (pack.payload.hasOwnProperty('replying'))
                    newPayload.replying = pack.payload.replying;
                if (pack.payload.msgType === 'text' && pack.payload.fromUserId === pack.payload.clientId)
                    newPayload.interactive = true; //记录有文字输入的用户对话(排除只订阅、wifi connect的对话)

                let newOperation = {
                    method:'PUT_ONE',
                    table:'CONVERSATION'
                };

                let newPack = {
                    operation: newOperation,
                    payload: newPayload
                };

                // 更新 wechat_conversation
                service.pubsubService.publish('chat',newPack);

            } catch (err) {
                throw err;
            }

        }

        async GET_ONE_CONVERSATION(condition){
            if(!condition.clientId)
                return null;

            let cond = {
                clientId: condition.clientId
            };
            try {
                let wc = await app.model.WechatConversation.findOne(cond);
                return wc;
            } catch (err) {
                throw err;
            }
        }

        async GET_MULTI_CONVERSATION(condition, paging){
           if(paging && paging.from && paging.page && paging.pageSize) {
               let sort  = {};
               condition.clientName && (condition.clientName = new RegExp(condition.clientName, 'ig'));
               if(condition.replierId){
                   /*
                       在线问答页面，提供客服user._id 作为replierId, 同时alterCondition查询排队的在线对话，condition带有当前页面客服已接听对话的最小updatedAt, alterCondition带有当前页排队对话的最小updatedAt,如果当前页面无已接听对话或排队对话，updatedAt设为Date.now
                    */
                   let alterCondition = Object.assign({},condition);
                   alterCondition.replierId = '';
                   alterCondition.replying = false;

                   condition.updatedAt = {$lt:(condition.repliedUpdatedAt || Date.now())};
                   alterCondition.updatedAt = {$lt:(alterCondition.nonRepliedUpdatedAt || Date.now())};
                   delete condition.repliedUpdatedAt;
                   delete condition.nonRepliedUpdatedAt;
                   delete alterCondition.repliedUpdatedAt;
                   delete alterCondition.nonRepliedUpdatedAt;

                   condition = {$or:[condition,alterCondition]}
                   if(paging.from === 'first'){
                       sort = {replierId:-1, updatedAt: 1};
                   }
                   else if(paging.from === 'last'){
                       sort = {replierId:-1, updatedAt: -1};
                   }
               }
               else if (condition.replyType === 'all'){
                   /*
                       问答管理页面-全部对话
                    */
                   delete condition.replyType;
                   condition.updatedAt = {$lt:(condition.updatedAt || Date.now())};
                   sort = {updatedAt: -1};
               }
               else if (condition.interactive){
                   /*
                       问答管理页面-有效对话，condition带有当前页面updatedAt,
                    */
                   condition.updatedAt = {$lt:(condition.updatedAt || Date.now())};
                   sort = {updatedAt: -1};
               }

               let cond = condition || {};
               let page = paging.page;
               let limit = paging.pageSize;

               try {
                   let count = await app.model.WechatConversation.count(cond);
                   if (count < limit * (page - 1)) page = 1;
                   let conversations = await app.model.WechatConversation.find(cond).skip(limit * (page - 1)).limit(limit).sort(sort).exec();
                   return {
                       count: count,
                       conversations: conversations
                   };
               } catch(err){
                   throw err;
               }
           }
           else{
               return null;
           }
        };

        async GET_MULTI_MESSAGE(condition, paging) {
            let cond = {
                clientId: condition.clientId
            };

            if(paging && paging.from && paging.page && paging.pageSize) {
                try {
                    let page = paging.page;
                    let limit = paging.pageSize;

                    let count = await app.model.WechatMessage.count(cond);
                    let sort = {};
                    if (paging.from === 'first') {
                        sort = {createdAt: 1};
                    }
                    else if (paging.from === 'last') {
                        sort = {createdAt: -1};
                    }

                    if (count < limit * (page - 1)) page = 1;
                    let messages = await app.model.WechatMessage.find(cond).skip(limit * (page - 1)).limit(limit).sort(sort).exec();
                    return {
                        count: count,
                        messages: (paging.from === 'last' ? messages.reverse() : messages)
                    };
                } catch (err){
                    throw err;
                }
            }
            else{
                return null;
            }
        };
    }

    return ChatService;
};
