const Config = require('../../config/config.json');

module.exports = {
    get CONSTANT() {
        const constant = {
            KAFKA: {
                TOPIC: {
                    CHAT: 'chat_topic',
                },
                CONSUMER_GROUP_BASIC_OPTION: {
                    kafkaHost: Config.kafka.kafkaHost,
                    batch: undefined,
                    ssl: true,
                    // groupId: 'ExampleTestGroup',    // override when implement
                    sessionTimeout: 15000,
                    protocol: [ 'roundrobin' ],
                    fromOffset: 'latest',
                    commitOffsetsOnFirstJoin: true,
                    outOfRangeOffset: 'earliest',
                    migrateHLC: false,
                    migrateRolling: true,
                },
                CONSUMER_GROUP_IDS: {
                    CHAT_GROUP: 'chat_group',
                },
            },

        };
        return constant;
    },
};
