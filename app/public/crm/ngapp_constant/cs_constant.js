const constant = {
    CONVER: {
        ROLE_REPLY_MAP: {
            qt_cs: 230,
        }
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
        STATUS_OPTIONS:[
            {value:50, display:'已取消'},
            {value:100, display:'待客服确认'},
            {value:300, display:'已签约待付款'},
            {value:500, display:'已付款'},
            {value:700, display:'病历收集完成'},
            {value:900, display:'中文病情综述完成'},
            {value:1100, display:'翻译完成'},
            {value:1300, display:'提交美国客服'},
            {value:1500, display:'病历已提交美国医生'},
            {value:1700, display:'美国医生给出会诊时间'},
            {value:1900, display:'已确定会诊时间'},
            {value:2100, display:'视频会诊完成'},
            {value:2300, display:'会诊报告及视频上传完成'},
            {value:2500, display:'随访已提交'},
            {value:2700, display:'随访已完成'},
            {value:2900, display:'订单完成'},
        ],
    },
    CASE_REPORT: {
        STATUS: {
            SAVED: 100, //已保存
            REJECTED: 150, //被驳回
            SUBMITTED: 200, //待审核
            CHECKED: 300, //已审核
        }
    },
    OSS:{
        URL_HEAD: 'zlzhidao-resource.oss-cn-shenzhen.aliyuncs.com/',
    }
};


export default constant;