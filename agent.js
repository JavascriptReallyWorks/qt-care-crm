'use strict';
const env = process.env.EGG_SERVER_ENV;
const kafka = require('kafka-node'),
    ConsumerGroup = kafka.ConsumerGroup;
const options = {
    kafkaHost: 'localhost:9092', // connect directly to kafka broker (instantiates a KafkaClient)
    batch: undefined, // put client batch settings if you need them (see Client)
    ssl: true, // optional (defaults to false) or tls options hash
    groupId: 'wechatGroup',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'latest', // default
    commitOffsetsOnFirstJoin: true, // on the very first time this consumer group subscribes to a topic, record the offset returned in fromOffset (latest/earliest)
    outOfRangeOffset: 'earliest', // default
    migrateHLC: false,    // for details please see Migration section below
    migrateRolling: true,
};

let consumerGroup = new ConsumerGroup(options, ['chat']);

module.exports = agent => {
    // 在这里写你的初始化逻辑
    // 也可以通过 messenger 对象发送消息给 App Worker
    // 但需要等待 App Worker 启动成功后才能发送，不然很可能丢失
    agent.messenger.on('egg-ready', () => {

        //初始化启动服务
        agent.messenger.sendToApp('initService',{});

        // Kafka 监听
        consumerGroup.on('message', function (message) {
            agent.messenger.sendToApp('csListener', message.value);
        });
    });

    agent.messenger.on('newWechatToken', token => {
        agent.messenger.sendToApp('refreshWechatService',token);
    });

    class ClusterStrategy extends agent.ScheduleStrategy {
        start() {
            // 订阅其他的分布式调度服务发送的消息，收到消息后让一个进程执行定时任务
            // 用户在定时任务的 schedule 配置中来配置分布式调度的场景（scene）
            agent.mq.subscribe(schedule.scene, () => this.sendOne());
        }
    }
    agent.schedule.use('cluster', ClusterStrategy);
};
