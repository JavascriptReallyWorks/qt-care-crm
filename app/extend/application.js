const Config = require('../../config/config.json');

module.exports = {
    error(banner, err) {
      // app.logger.error()
      this.logger.error(`
        ================== ${banner} ===================
        Error: ${err}
      `);
    },

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
            JDY:{
              APP:{
                CUSROMER_SERVICE_MANAGE:{     // 客户服务管理
                  APP_ID:"5c455cacdbe315787481e978"
                },
              },
              ENTRY:{
                MEMBERSHIP:{  // 客户会员卡建档
                  ENTRY_ID:"5c414ce9df64be7e838090e5", 
                },
                ORDER:{  // 保险客户名单及花费情况
                  ENTRY_ID:"5c470cb6e916e2671947b1a4", 
                },
                SERVICE_ORDER:{  // 服务下单及流程工单
                  ENTRY_IDS:[
                    "5c418708768aaf72f8f3d7a1", // P4a：国内门诊绿色通道服务程序
                    "5caef3bbe6f482635d1921b4", // P4a1：国内住院绿色通道服务程序
                    "5c4e3fdd94df4b230dc130b5", // P4b：国内专家书面会诊工作
                    "5c4bdd3d6c67e52f28a32a69", // P4c：美国专家视频会诊工作
                    "5c4d07fd94df4b230dbec58b", // P4d：美国专家书面会诊工作
                    "5c6236212c86f30da682a01f", // P4e：赴美就医工作
                    "5c6e44cb50e5ad3f6b89e5a1", // P4f：归国随访及购药安排
                    "5c6fa28698de013f53357167", // P4g：日本专家书面会诊工作
                  ], 
                },
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
