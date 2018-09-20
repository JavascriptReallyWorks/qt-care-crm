'use strict';

const kafka = require('kafka-node');
const ConsumerGroup = kafka.ConsumerGroup;

module.exports = app => {
    class Pubsub extends app.Service {
        initKafkaListener() {
            try {
                const consumerGroupOption = app.CONSTANT.KAFKA.CONSUMER_GROUP_BASIC_OPTION;
                const that = this;

                const chatGroupId = app.CONSTANT.KAFKA.CONSUMER_GROUP_IDS.CHAT_GROUP;
                const chatTopic = app.CONSTANT.KAFKA.TOPIC.CHAT;
                const chatGroup = new ConsumerGroup(
                    {
                        ...consumerGroupOption,
                        groupId: chatGroupId,
                    },
                    [chatTopic]
                );
                chatGroup.on('message', async message => {
                    await that.newPublication(message.value);
                });
            }
            catch (err){
                this.ctx.logger.error(`
                    ================== pubsubService initKafkaListener error ===================
                    Error: ${err}
                `);
            }
        };

        async newPublication(data) {
            const {ctx, service} = this;
            let pack = JSON.parse(data);
            try {
                const {operation, payload} = pack;
                const option = (operation.method + '_' + operation.table).toUpperCase();
                switch(option){
                    case 'POST_ONE_CONVERSATION':
                        await service.chatService.POST_ONE_CONVERSATION(pack);
                        break;

                    case 'PUT_ONE_CONVERSATION':
                        await service.chatService.PUT_ONE_CONVERSATION(pack);
                        break;

                    case 'POST_ONE_MESSAGE':
                        await service.chatService.POST_ONE_MESSAGE(pack);
                        if(process.env.EGG_SERVER_ENV === 'prod') {
                            await service.conversationService.newMessage(payload);
                        }
                        break;
                }

            } catch (err){
                ctx.logger.error(`
                    ================== pubsubService newPublication error ===================
                    Error: ${err}
                `);
            }
        }


        publish (topic, pack) {
            const {ctx} = this;
            try {
                app.producer.send([
                    {
                        topic,
                        messages: JSON.stringify(pack),
                        partition: 0
                    }
                ], function (err, data) {

                });
            }
            catch (err){
                ctx.logger.error(`
                    ================== pubsubService publish error ===================
                    Error: ${err}
                `);
            }

        };

        async get(pack) {
            const {ctx, service} = this;
            try {
                const {operation, payload} = pack;
                const option = (operation.method + '_' + operation.table).toUpperCase();
                let data;
                switch(option){
                    case 'GET_ONE_CONVERSATION':
                        data = await service.chatService.GET_ONE_CONVERSATION(payload);
                        return data;
                        break;


                    case 'GET_MULTI_MESSAGE':
                        data = await service.chatService.GET_MULTI_MESSAGE(payload.condition, payload.paging);
                        return data;
                        break;

                    case 'GET_MULTI_CONVERSATION':
                        data = await service.chatService.GET_MULTI_CONVERSATION(payload.condition, payload.paging);
                        return data;
                        break;

                    default:
                        return null;
                        break;

                }

            } catch (err){
                ctx.logger.error(`
                    ================== pubsubService get error ===================
                    Error: ${err}
                `);
            }

        };
    }
    return Pubsub;
};
