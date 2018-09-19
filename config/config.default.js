'use strict';

var path = require('path');

module.exports = appInfo => {
    const config = {};

    config.cluster = {
            listen: {
                port: 7001,
                hostname: '127.0.0.1',
            }
    };

    config.keys = appInfo.name + '_1493425231373_3278';

    config.signingKey = "ZE8265NUE8XBLER304L4HV5B16K3AZOG7VCIH6JW9OJ3NLDMP3MRG15J46XAS3XVFZCAMBFK80DB9MUPQ17ELU"; //Ceiling(4 * 64 /3)
    config.encryptionKey = "RU05G79PWM89ZBHWCFLG0KH6035UOV74SG02EOD115F"; // Ceiling(4 * 32 /3)

    config.internal_http_token = "kyqlKWLR7hQDonbQe3QEqRZU0wjkmSkRZiIRYj5qfJWTZxcabEYeOwuOlCho6lHt";

    config.view = {
        defaultViewEngine: 'jade',
        mapping: {
            '.jade': 'jade',
        }
    };

    config.static = {
        prefix: '',
        dir: path.join(appInfo.baseDir, 'app/public/build')
        // dir: path.join(appInfo.baseDir, 'app/public')
    };

    config.mongoose = {
        clients: {
            db27017: {
                url:'mongodb://127.0.0.1:27017/zlzhidao',
                options:{},
            }
        },
    };

    config.security = {
        csrf: {
            enable: false,
            ignore: '/doc/api/',
        },
        ctoken: {
            ignore: '/doc/api/',
        },
        domainWhiteList: ['http://localhost:7001'],
        ignore: '/doc/api/'
    };

    config.middleware = ['isCRM','doctorAuth'];

    config.isCRM = {
        match: '/cs'
    };

    config.doctorAuth = {
        match:'/external/doctor'
    };

    config.CONSTANT = constant;
    config.ZLZD_WECHAT_CONFIG = zlzdWechatConfig;
    config.customerServers = customerServers;

    config.passportLocal = {};

    config.redis = {
        client: {
            host: '127.0.0.1',
            port: 6379,
            password: '',
            db: '0',
        },
        agent: true
    };

    config.io = {
        init: {}, // passed to engine.io
        namespace: {
            '/': {
                connectionMiddleware: ['auth'],
                packetMiddleware: [],
            },
            '/chat': {
                connectionMiddleware: ['auth'],
                packetMiddleware: [],
            },
            '/wechat': {
                connectionMiddleware: ['auth'],
                packetMiddleware: [],
            },
        },
        redis: {
            host: '127.0.0.1',
            port: 6379
        }
    };

    config.resourcePath = {
        voicePath: "app/public/resource/voice/",
        mp3Path: "app/public/resource/mp3/",
        userFilePath: "app/public/resource/user_file/",
        download: "app/public/resource/download/"
    };

    config.logger = {
        level: 'DEBUG',
        appLogName: `${appInfo.name}-web.log`,
        coreLogName: 'egg-web.log',
        agentLogName: 'egg-agent.log',
        errorLogName: 'common-error.log',
    };

    config.multipart = {
        whitelist: [
            '.pdf',
            '.doc',
            '.docx',
            '.txt',
            '.xls',
            '.xlsx',
            '.csv',
            // images
            '.jpg', '.jpeg', // image/jpeg
            '.png', // image/png, image/x-png
            '.gif', // image/gif
            '.bmp', // image/bmp
            '.wbmp', // image/vnd.wap.wbmp
            '.webp',
            '.tif',
            '.psd',
            // text
            '.svg',
            '.js', '.jsx',
            '.json',
            '.css', '.less',
            '.html', '.htm',
            '.xml',
            // tar
            '.zip',
            '.gz', '.tgz', '.gzip',
            // video
            '.mp3',
            '.mp4',
            '.avi',
        ],
    };

    config.oss = {
        client:zlzdOssConfig.params
    };

    config.OSS = zlzdOssConfig;

    config.rest = {
        enable: true,
        urlprefix: '/doc/api/',
        authIgnores: {
            // allow users.show() and users.index() to ignore authentication
            medicalSummaries: {
                show: true,
            }
        },

        authRequest: async function (ctx) {
            if(!ctx.headers.authorization)
                return null;
            const token = ctx.headers.authorization;
            let doctor = await ctx.app.redis.get(token);
            if (doctor) {
                // If authentication succeeds, the info returned below can be accessed with `this.accessToken` in controller.
                return {
                    ...JSON.parse(doctor),
                    token
                };
            }
            else{
                // authentication failure
                return null;
            }
        }
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    };

    return config;
};


const zlzdOssConfig = {
    params: {
        region: 'oss-cn-shenzhen',
        accessKeyId: 'LTAIpkRK1VSCbeGH',
        accessKeySecret: 'ze7hlCp9whY37CXOyvWF5csSkvoLIv',
        bucket: 'zlzhidao-resource'
    },
    urlHead: 'zlzhidao-resource.oss-cn-shenzhen.aliyuncs.com/',
};


const zlzdWechatConfig = {

    // 米茶健康
    token: 'michahealth',
    appid: 'wx79eaf33ec41ba6a8',
    encodingAESKey: '3iyqjJ3c2aX7fnENZG4VNBBe5fMRrUsXjcTuC6tTS4x',
    appSecret: 'cf0a83a9d0a5a17afc004217e9cdbace',

    // 小肿瘤知道
    // token: 'zlzhidaotest',
    // appid: 'wx064c32c2931490aa',
    // mch_id: '1377389402',
    // encodingAESKey: '3iyqjJ3c2aX7fnENZG4VNBBe5fMRrUsXjcTuC6tTS4x',
    // payApiKey: 'JCJSBQSXK44HF6B8XP2XQ7AHQ36H6T7G',
    // appSecret: '707231ec2de2ab7d4a1b56e31b12dc1e',

    // appid: 'wx68451915b0affd17',
    // mch_id: '1446561402',
    // encodingAESKey: 'EbJG23WzxpCfCq8lpTUIxXAXeS4GHRwYyZVA8oDsFih',
    // payApiKey: 'JCJSBQSXK44HF6B8XP2XQ7AHQ36H6T7G',
    // appSecret: 'ef502e162c19307b69a6f10b3a4ffdcb',
    grant_type: 'client_credential',
    accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token', //获取token
    oauth2AccessTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token', //获取token
    accessTagsUrl: 'https://api.weixin.qq.com/cgi-bin/tags/get', //获取tags列表
    ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket', //获取jsapi_ticket
    batchtaggingUrl: 'https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging', //给用户批量打标签
    createTagUrl: 'https://api.weixin.qq.com/cgi-bin/tags/create', //给用户打标签
    batchget_material: 'https://api.weixin.qq.com/cgi-bin/material/batchget_material', //获取永久素材
    add_news: 'https://api.weixin.qq.com/cgi-bin/material/add_news', //新增永久素材
    update_news: 'https://api.weixin.qq.com/cgi-bin/material/update_news', //修改永久素材
    getUserInfoUrl: 'https://api.weixin.qq.com/cgi-bin/user/info', //根据openid获取用户信息url
    downloadUrl: 'http://file.api.weixin.qq.com/cgi-bin/media/get', //下载
    unifiedorderUrl: 'https://api.mch.weixin.qq.com/pay/unifiedorder', //统一下单
    orderqueryUrl: 'https://api.mch.weixin.qq.com/pay/orderquery', //查询订单
    createQrcode: 'https://api.weixin.qq.com/cgi-bin/qrcode/create', //生成二维码ticket
    showQrcode: 'https://mp.weixin.qq.com/cgi-bin/showqrcode', //展示二维码
    getTokenUrl: "http://wxproxy.magicfish.cn/weixin/token",
    cache_duration: 1000 * 60 * 60 * 24,
    checkSignature: false
};


const constant = {
    BASE_URL:"https://crm.qtclinics.com",
    appsConf: {
        "crm": {
            "clientId": "crm",
            "clientSecret": "6pZsDRfreAuTWmmsbytLGrnsckMr2tzd009MdMqZbsf"
        },
        "zlzhidao": {
            "clientId": "zlzhidao",
            "clientSecret": "4bUofKYLJqqzeKrGjiL4s90mcDv0hunznDf8JxnA3MM"
        },
        "zlzhidao_cs": {
            "clientId": "zlzhidao_cs",
            "clientSecret": "4bUofKYLJqqzeKrGjiL4s90mcDv0hunznDf8JxnA3MM"
        },
        "qtclinics_l5O6": {
            "clientId": "qtclinics_l5O6",
            "clientSecret": "l5O6tM7pHyIUdTXNEVzZPzpXSUvhDbCgXYjfRVlVFL6"
        },
        "qtclinics_l5O7": {
            "clientId": "qtclinics_l5O7",
            "clientSecret": "A5w3R2DluABnFoBqAXksclt5vbhUTCdBslUTmzjCKBF"
        }
    },
    helpDomain:"http://localhost:9090",
    searchUrl: 'http://localhost:8082/search',
    URLS: {
        tagsJSON:"https://v1.zlzhidao.com/resource/tags.json",
        GETREPRTURL: 'https://localhost:7072/previewReportByDriverId/',
        getSubTag: '/public_api/tags/getSubTags?1=1',
        searchQaLimit: '/searchQaLimit',
        getOneQa: '/getOneById',
    },
    INITPASS: "qt2017",
    AMBRA_SID_KEY: "ambra_session_id",
    ACTIVATION_STATUS: {
        PENDING: 0,
        ACTIVATED: 1,
        BLOCKED: 2,
        DEACTIVATED: 3,

        WATING_FOR_GOV_ID: 10,
        WATING_FOR_CONSENT: 11,

        READY_FOR_COLLECTION: 100,
        COLLECTING: 110,
        COLLECTION_ISSUE: 120,
        ACTIVATION_ELIGIBILITY_VERIFIED: 140,
        CREATING_SUMMARY: 200,
        CREATED_SUMMARY: 210,
        TRANSLATING_SUMMARY: 220,
        COMPLETED_SUMMARY_TRANSLATION: 230,

        TRIAL_MATCHING: 300,
        READY_FOR_TRIAL_TRANSLATION: 310,
        TRANSLATING_TRIAL_RESULTS: 320,
        COMPLETED_TRIAL_TRANSLATION: 330,
        SEND_RESULTS_TO_PATIENT: 340
    },
    PRE_ACTIVATION_COLLECTION_STATUS: {
        WAITING_FOR_GOV_ID: 10,
        WAITING_FOR_CONSENT: 20,
        PRE_READY_FOR_COLLECTION: 30,
        PRE_COLLECTING: 40,
        PRE_COLLECTION_ISSUE: 50,
        RECORDS_CONTENT_SSUE: 60,
        ELIGIBILITY_VERIFIED: 70,
        ALREADY_LATE_STAGE: 80,

        BLOCKED: 0,
        POST_READY_FOR_COLLECTION: 100,
        POST_COLLECTING: 110,
        POST_COLLECTION_ISSUE: 120,
        RECORDS_CONTENT_ISSUE: 130,
        ACTIVATION_ELIGIBILITY_VERIFIED: 140,
        CREATING_SUMMARY: 200,
        COMPLETED_SUMMARY: 210,
        TRANSLATING_SUMMARY: 220,
        COMPLETED_SUMMARY_TRANSLATION: 230,
        TRIAL_MATCHING: 300,
        READY_FOR_TRIAL_TRANSLATION: 310,
        TRANSLATING_TRIAL_RESULTS: 320,
        COMPLETED_TRIAL_TRANSLATION: 330,
        SENT_RESULTS_TO_PATIENT: 340
    },
    CONVER: {
        SOURCE_TYPE: {
            WECHAT: 100, // 肿瘤知道小助手
            WEAPP: 200, // 微信小程序
            SEARCH: 300, // 搜索
        },
        REPLY_TYPE: {
            QT_CS: 230, //
            LZJ: 310, // 自动回复
        },
        REPLY_TYPE_MAP:{
            230:'qt_cs',
        },
    },
    CASE: {
        STATUS: {
            CANCELLED:50, //已取消
            TO_CONFIRM: 100, //待客服确认
            TO_PAY: 300, //已签约待付款
            PAID: 500, //已付款
            MD_COLLECTED: 700, //病历收集完成
            SUMMARY_CN_COMPLETED:900,//中文病情综述完成
            TRANSLATED:1100,//翻译完成
            CASE_TO_US_CS:1300, //提交美国客服
            MD_TO_US_DOCTOR:1500, //病历已提交美国医生
            CONSULT_TIME_GIVEN:1700, //美国医生给出会诊时间
            CONSULT_TIME_CONFIRMED:1900, //已确定会诊时间
            CONSULT_COMPLETED:2100, //视频会诊完成
            CONSULT_FILE_UPLOADED:2300, //会诊报告及视频上传完成
            FOLLOW_UP_SUBMITTED:2500, // 随访已提交
            FOLLOW_UP_COMPLETED:2700, // 随访已完成
            CASE_COMPLETED:2900, //订单完成
        },
        STATUS_MAP: {
            50:"已取消",
            100: '待客服确认',
            300: '已签约待付款',
            500: '已付款',
            700: '病历收集完成',
            900: '中文病情综述完成',
            1100: '翻译完成',
            1300: '提交美国客服',
            1500: '病历已提交美国医生',
            1700: '美国医生给出会诊时间',
            1900: '已确定会诊时间',
            2100: '视频会诊完成',
            2300: '会诊报告及视频上传完成',
            2500: '随访已提交',
            2700: '随访已完成',
            2900: '订单完成',
        },
        MR_STATUS: {
            REJECTED: 100,
            CONFIRMED: 200
        }
    },
    CASE_REPORT: {
        STATUS: {
            SAVED: 100, //已保存
            REJECTED: 150, //被驳回
            SUBMITTED: 200, //待审核
            CHECKED: 300, //已审核
        }
    },
    REDIS: {
        CHANGE_PASSWORD_URL_CODE_KEY:'change_password_url_code',
        CS: 'customService',
        CS_COMMON_EXPRESSION: 'csCommonExpression'
    },
    DICOM: {
        PRIVATE_KEY:'QUANTUM18QUANTUM',
        IV:'0000000000000000',
        USER_ACCOUNT_ID: "faacb9c4-48c8-42f1-a6a3-236d45f9441c",
    },
    FILE:{
        OSS:{
            PDF_REPORT_PREFIX:"pdf_report/"
        }
    }
};


const customerServers = {
    "5825838c8fd179b30fa16eaf": {
        kf_account: 'kf2002@azbaike',
        kf_headimgurl: 'http://mmbiz.qpic.cn/mmbiz_jpg/7LxyGIeCu17kJooLhhQZAYY8DYA4jCF0U94qicARVMuFwIK7KicV5FrrsxTdcLicURWrThUr2PsZmW0ovNSjbT1nw/300?wx_fmt=jpeg',
        kf_id: 2002,
        kf_nick: '量子客服-困困君',
        kf_wx: 'kunta_abc'
    },
    "582a63860c90a503adc9020a": {
        kf_account: 'kf2008@azbaike',
        kf_headimgurl: 'http://mmbiz.qpic.cn/mmbiz_jpg/7LxyGIeCu14s3qobdSrLKibzZBm0lLcG1ZPMjAOrC2rWzLVuiadfwqxsicj7c2R0M2fR9RkiaZalzNNXOv99ICDorg/300?wx_fmt=jpeg',
        kf_id: 2008,
        kf_nick: '长颈鹿',
        kf_wx: 'zlzdxzs'
    },
    "5959ef81a2b1c2023a77c0c3": {
        kf_account: 'kf2009@azbaike',
        kf_headimgurl: 'http://mmbiz.qpic.cn/mmbiz_png/7LxyGIeCu17kJooLhhQZAYY8DYA4jCF0tgYtLNbT7xLbwpADbm43xibXiaeToiatBkBicQEPibj2yOMiboTEb9xEcDcg/300?wx_fmt=png',
        kf_id: 2009,
        kf_nick: '量子客服-帝王蟹',
        kf_wx: 'Hxcomos'
    },
    "594774c118e42a7ea00d8c5f": {
        kf_account: 'kf2010@azbaike',
        kf_headimgurl: 'http://mmbiz.qpic.cn/mmbiz_png/7LxyGIeCu17kJooLhhQZAYY8DYA4jCF0vRZXdIjk9JgHbcKWfebKKA2ozqVXJuZDZQaUAlF3k65buHsO7aicicLg/300?wx_fmt=png',
        kf_id: 2010,
        kf_nick: '量子客服-蚂蚁君',
        kf_wx: 'smvs41'
    },
    "5947752618e42a7ea00d8c61": {
        kf_account: 'kf2011@azbaike',
        kf_headimgurl: 'http://mmbiz.qpic.cn/mmbiz_jpg/7LxyGIeCu17kJooLhhQZAYY8DYA4jCF00FibNiaEeqQibQeORckz5LHCupViaezibPRSksOTNMiblRqS8eYlmoNp3JaQ/300?wx_fmt=jpeg',
        kf_id: 2011,
        kf_nick: '量子客服-小鹿',
        kf_wx: 'wxid_gd2307crkmcs22'
    },
    "58df0ee386e9ce4a32bba8d3": {
        kf_account: 'kf2012@azbaike',
        kf_headimgurl: 'http://mmbiz.qpic.cn/mmbiz_png/7LxyGIeCu17z2Vvg2c8vib0IoGiblfv4Ne23iaGACReUMTBiauzTZb4yFMbhzReOdZEtvQyZ3yQPyTXAbuTCQp5Lag/300?wx_fmt=png',
        kf_id: 2012,
        kf_nick: '量子客服-松鼠',
        kf_wx: 'MCYakar'
    },
    "5825ebe3c3707c519873789b": {
        kf_account: 'kf2013@azbaike',
        kf_headimgurl: 'http://mmbiz.qpic.cn/mmbiz_png/7LxyGIeCu17z2Vvg2c8vib0IoGiblfv4NemvJAmF1LzFAklQkHQxO7icrVS1d1ib9vQlNf3ibRIoTiclTLAnaskyjhug/300?wx_fmt=png',
        kf_id: 2013,
        kf_nick: '量子客服-浣熊',
        kf_wx: 'lehmannjoan'
    },
    "5825e45457c09370853a3b45": {
        kf_account: 'kf2014@azbaike',
        kf_headimgurl: 'http://mmbiz.qpic.cn/mmbiz_png/7LxyGIeCu17z2Vvg2c8vib0IoGiblfv4NeLEnJ89IHQKl7wib2hzIeGh98VEoaxNIPgNW2jSawIvf7O47vXI0A2JQ/300?wx_fmt=png',
        kf_id: 2014,
        kf_nick: '量子客服-海豚',
        kf_wx: 'zhaudrey'
    },
    "5825e02357c09370853a3b40": {
        kf_account: 'kf2015@azbaike',
        kf_headimgurl: 'http://mmbiz.qpic.cn/mmbiz_jpg/7LxyGIeCu144suDEKACjQz41RpsibMVJWtOwv9tOW4Ey2NBBlViaQ2aic1FP8B62ibhSkpdiaoiaCibJoBG9DZ3UYOd7Q/300?wx_fmt=jpeg',
        kf_id: 2015,
        kf_nick: '量子-独角兽',
        kf_wx: 'yifengpu'
    },
    "5a13b52f72d6131e505355da": {
        kf_account: "kf2017@azbaike",
        kf_headimgurl: "http://mmbiz.qpic.cn/mmbiz_jpg/7LxyGIeCu150IaZ4a0Lo86NzBZNWAypmiaicfVko2ia4Pvo6bCukboHh9iaSDtWEnz1ZY9178pHo2xaRWqyvsxl7bQ/300?wx_fmt=jpeg",
        kf_id: 2017,
        kf_nick: "量子客服-白鲸",
        kf_wx: "X787731830"
    }
};
