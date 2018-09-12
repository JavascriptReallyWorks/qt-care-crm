/**
 * Created by Yang1 on 6/14/17.
 */

var app = angular.module("ZLCsApp");

app.constant("ReportPattern", {
    integrity: {
        value: '',
        title: '病历材料完整度',
        type: 'select',
        lastInput:true,
        inputPlaceholder:'待补充内容',
        options: ['完整', '不完整'],
        horizon:false
    },
    first_opinion: {
        value: {
            opinion:{
                nccn:'',
                uptodate:''
            }
        },
        filter:{
            nccn:'textarea',
            uptodate:'textarea'
        },
        headers:['','NCCN最新指南','Uptodate临床顾问'],
        columns:['意见参考'],
        title: '疾病治疗参考',
        type: 'mntable',
    },
    further_opinion: {
        value: {
            diagnosis:{
                problem:'',
                opinion:''
            },
            treatment:{
                problem:'',
                opinion:''
            },
            other:{
                problem:'',
                opinion:''
            },
        },
        filter:{
            problem:'textarea',
            opinion:'textarea',
        },
        headers:['','存在的问题','问题意见参考'],
        columns:['诊断及检查','治疗','随访及其他问题'],
        title: '进一步建议',
        type: 'mntable',
    },
    scheme_number: {
        value: '',
        title: '方案编号',
        type: 'text'
    },
    scheme_type: {
        value: '手术',
        title: '方案类型',
        type: 'dropdown',
        options: ['手术', '放疗', '化疗', '靶向治疗', '免疫治疗', '其他'],
    },
    scheme_name: {
        value: '',
        title: '治疗方式名称',
        type: 'text'
    },
    clinical_trail_name: {
        value: '',
        title: '临床试验项目名称',
        type: 'text'
    },
    clinical_trail_number: {
        value: '',
        title: '临床试验编号',
        type: 'text'
    },
    clinical_trail_staging: {
        value: '',
        title: '试验分期',
        type: 'select',
        lastInput:true,
        inputPlaceholder:'其他分期',
        options: ['I期','II期','III期','IV期','其他'],
        horizon:false
    },
    patient_feature: {
        value: '',
        title: '患者特征',
        type: 'textArea'
    },
    group_amount: {
        value: '',
        title: '患者分组',
        type: 'dropdown',
        options: ['1', '2', '3'],
    },
    group1: {},
    group2: {},
    group3: {},

    explanation:{
        value: '',
        title: '注释/摘要',
        type: 'textArea'
    },
    source:{
        value: '',
        title: '试验数据来源',
        type: 'textArea'
    },
    price:{
        value: '',
        title: '方案价格参考',
        type: 'text'
    },
    effectiveness_rate: {
        value: '',
        title: '有效性',
        type: 'dropdown_obj',
        options:[
            {
                value:'1',
                display:'1分:姑息性疗效，仅有助于对症治疗'
            },
            {
                value:'2',
                display:'2分:微小疗效，对于生存的获益效果中等，无效或未知，有时能有助于疾病控制'
            },
            {
                value:'3',
                display:'3分:中度有效，对于生存的获益效果中等，无效或未知，但通常能有助于疾病控制'
            },
            {
                value:'4',
                display:'4分:很有效，有时能提供长期生存获益或有潜在治愈可能'
            },
            {
                value:'5',
                display:'5分:高度有效，通常能获得长期生存获益，或有潜在治愈可能'
            },
        ],
    },
    safety_rate: {
        value: '',
        title: '安全性',
        type: 'dropdown_obj',
        options:[
            {
                value:'1',
                display:'1分:高度毒性，通常很严重，常观察到明显毒性作用或危机生命的严重毒性副作用。严重影响日常活动。'
            },
            {
                value:'2',
                display:'2分:中等毒性，常出现明显毒性副作用，但危机生命的副作用少见，常影响日常活动。'
            },
            {
                value:'3',
                display:'3分:轻毒性，中等毒性副作用，影响日常活动'
            },
            {
                value:'4',
                display:'4分:偶有毒性：罕见明显毒副作用，或有低级毒性副作用。轻微影响日常活动'
            },
            {
                value:'5',
                display:'5分:通常没有有意义毒性，很少见或副作用很小。不影响日常活动。'
            },
        ],
    },
    data_validity_rate: {
        value: '',
        title: '证据质量',
        type: 'dropdown_obj',
        options:[
            {
                value:'1',
                display:'1分:质量差，很少或没有证据，疗效及安全性有待验证'
            },
            {
                value:'2',
                display:'2分:低质量，案例报道或仅临床经验，缺乏长期生存数据，疗效有待验证'
            },
            {
                value:'3',
                display:'3分:一般质量，低质量的随机临床试验或设计良好的非随机临床试验，部分疗效结果不完全一致'
            },
            {
                value:'4',
                display:'4分:质量好，一些设计较好的随机临床试验，疗效一致性较好'
            },
            {
                value:'5',
                display:'5分:高质量，数量较多的设计良好的随机临床试验和或荟萃分析，疗效一致性高'
            },
        ],
    },
    price_date: {
        value: '',
        title: '价格指数',
        type: 'dropdown_obj',
        options:[
            {
                value:'1',
                display:'1分:非常贵'
            },
            {
                value:'2',
                display:'2分:贵'
            },
            {
                value:'3',
                display:'3分:有点贵'
            },
            {
                value:'4',
                display:'4分:便宜'
            },
            {
                value:'5',
                display:'5分:非常便宜'
            },
        ],
    },
});

/*
app.constant("GroupPattern",{
    value: {
        group_name:'',
        patient_amount:'',
        treatment:'',
        result:'',
        orr:'',
        cr:'',
        pr:'',
        dcr:'',
        ttr:'',
        mpfs:'',
        mos:'',
        other:'',
        safety:'',
        common_effect:'',
        severe_effect:''
    },
    filter:{
        group_name:'text',
        patient_amount:'text',
        treatment:'textarea',
        result:'textarea',
        orr:'text',
        cr:'text',
        pr:'text',
        dcr:'text',
        ttr:'text',
        mpfs:'text',
        mos:'text',
        other:'text',
        safety:'textarea',
        common_effect:'textarea',
        severe_effect:'textarea'
    },
    columns: [
        '分组名',
        '患者数量',
        '治疗方案(药物用法用量)',
        '疗效数据',
        '总体缓解率 ORR',
        '完全缓解率 CR',
        '部分缓解率 PR',
        '疾病控制率 DCR',
        '中位反应时间 TTR(周/月)',
        '中位无进展生存时间(月)',
        '中位总体生存时间(月)',
        '其他',
        '安全性(所有治疗期间的不良反应统计，包括治疗相关不良反应以及非治疗相关不良反应)',
        '常见不良反应(发生率≥10%以上不良反应)',
        '严重不良反应(3-4级不良反应)'
    ],
    type: 'table_obj',
});
*/