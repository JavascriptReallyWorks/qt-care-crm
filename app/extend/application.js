const Config = require('../../config/config.json');

module.exports = {
    get CONSTANT() {
        const constant = {
            KAFKA: {
                TOPIC: {
                    CHAT: 'chat',
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
            QTC_WECHAT:{
                MENU:{
                    "button": [
                        {
                            "name": "关于QTC",
                            "sub_button": [
                                {
                                    "type": "view",
                                    "name": "医院网络",
                                    "url": "https://v1.zlzhidao.com/qab/redirect?auth_after_url=https%3a%2f%2fv1.zlzhidao.com%2foauth2%2fauthorize%3fclient_id%3dqtclinics_l5O6%26redirect_uri%3dhttps%253a%252f%252fweb-sub.qtclinics.com%26response_type%3dcode%26scope%3dscope",
                                },
                                {
                                    "type": "view",
                                    "name": "常见问题",
                                    "url": "https://v1.zlzhidao.com/qab/redirect?auth_after_url=https%3a%2f%2fv1.zlzhidao.com%2foauth2%2fauthorize%3fclient_id%3dqtclinics_l5O6%26redirect_uri%3dhttps%253a%252f%252fweb-sub.qtclinics.com%26response_type%3dcode%26scope%3dscope",
                                },
                                {
                                    "type": "view",
                                    "name": "服务优势",
                                    "url": "https://v1.zlzhidao.com/qab/redirect?auth_after_url=https%3a%2f%2fv1.zlzhidao.com%2foauth2%2fauthorize%3fclient_id%3dqtclinics_l5O6%26redirect_uri%3dhttps%253a%252f%252fweb-sub.qtclinics.com%26response_type%3dcode%26scope%3dscope",
                                },
                                {
                                    "type": "view",
                                    "name": "使命与价值观",
                                    "url": "https://v1.zlzhidao.com/qab/redirect?auth_after_url=https%3a%2f%2fv1.zlzhidao.com%2foauth2%2fauthorize%3fclient_id%3dqtclinics_l5O6%26redirect_uri%3dhttps%253a%252f%252fweb-sub.qtclinics.com%26response_type%3dcode%26scope%3dscope",
                                },
                                {
                                    "type": "view",
                                    "name": "QTC简介",
                                    "url": "https://v1.zlzhidao.com/qab/redirect?auth_after_url=https%3a%2f%2fv1.zlzhidao.com%2foauth2%2fauthorize%3fclient_id%3dqtclinics_l5O6%26redirect_uri%3dhttps%253a%252f%252fweb-sub.qtclinics.com%26response_type%3dcode%26scope%3dscope",
                                },
                            ]
                        },
                        {
                            "name": "保险客服",
                            "sub_button": [
                                {
                                    "type": "click",
                                    "name": "保单查询",
                                    "key": "insurance"
                                },
                            ]
                        },
                        {
                            "name": "铂金会员",
                            "sub_button": [
                                {
                                    "type": "view",
                                    "name": "用户查询",
                                    "url": "https://v1.zlzhidao.com/qab/redirect?auth_after_url=https%3a%2f%2fv1.zlzhidao.com%2foauth2%2fauthorize%3fclient_id%3dqtclinics_l5O6%26redirect_uri%3dhttps%253a%252f%252fweb-sub.qtclinics.com%26response_type%3dcode%26scope%3dscope",
                                },
                            ]
                        },
                    ]
                },
            }

        };
        return constant;
    },
};
