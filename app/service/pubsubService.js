'use strict';

const admin = {
    id: '582562fba4b24ff2038e6978',
    name: '肿瘤知道小助手'
};

let subCallbackMap = {};

module.exports = app => {
    class Pubsub extends app.Service {
        // called from app.js, redis收到的所有publish导入这里
        async newPublication(data) {
            const {ctx, service} = this;
            let pack = JSON.parse(data);
            try {
                const {operation, payload} = pack;
                const option = (operation.method + '_' + operation.table).toUpperCase();
                switch(option){
                    case 'POST_ONE_CONVERSATION':
                        try {
                            await service.chatService.POST_ONE_CONVERSATION(pack);
                        } catch (err){
                            throw err;
                        }
                        break;


                    case 'PUT_ONE_CONVERSATION':
                        try {
                            await service.chatService.PUT_ONE_CONVERSATION(pack);
                        } catch (err){
                            throw err;
                        }
                        break;

                    case 'POST_ONE_MESSAGE':
                        try {
                            await service.chatService.POST_ONE_MESSAGE(pack);
                        } catch (err){
                            throw err;
                        }
                        break;
                }

            } catch (err){
                throw err;
            }
        }


        publish (topic, pack) {
            const {ctx} = this;
            if(typeof(pack) === 'object'){
                app.producer.send([
                    {
                        topic,
                        messages:JSON.stringify(pack)
                    }
                ], function (err, data) {
                    if(err) {
                        ctx.logger.error(`
                            =============== pubsubService publish err  ===============
                            err: ${err}
                            pack: ${pack}
                        `);
                    }
                });

            }else{
                throw 'Error: Option must be an object';
            }
        };

        async get(pack) {
            if(typeof(pack) === 'object'){
                const {ctx, service} = this;
                try {
                    const {operation, payload} = pack;
                    const option = (operation.method + '_' + operation.table).toUpperCase();
                    let data;
                    switch(option){
                        case 'GET_ONE_CONVERSATION':
                            try {
                                data = await service.chatService.GET_ONE_CONVERSATION(payload);
                                return data;
                            } catch (err){
                                throw err;
                            }
                            break;


                        case 'GET_MULTI_MESSAGE':
                            try {
                                data = await service.chatService.GET_MULTI_MESSAGE(payload.condition, payload.paging);
                                return data;
                            } catch (err){
                                throw err;
                            }
                            break;

                        case 'GET_MULTI_CONVERSATION':
                            try {
                                data = await service.chatService.GET_MULTI_CONVERSATION(payload.condition, payload.paging);
                                return data;
                            } catch (err){
                                throw err;
                            }
                            break;

                        default:
                            return null;
                            break;

                    }

                } catch (err){
                    throw err;
                }
            }
            else{
                throw 'Error: Option must be an object';
            }
        };
    }
    return Pubsub;
};
