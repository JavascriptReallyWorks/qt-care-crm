const constant = {
    // 基本信息
    patientName: {
        value: '',
        title: '患者姓名',
        titleEn: "Patient's name",
        type: 'text',
        question: '请问患者的姓名？（请告诉我患者真实的姓名，以帮助患者合适病情及匹配就医）',
        placeholder:'患者姓名',
    },

    patientMobile: {
        value: '',
        title: '患者手机',
        titleEn: "Patient's phone number",
        type: 'text',
        question: '请您提供您的联系方式（我们一般通过微信与您联系，手机仅供禁忌情况时联系）',
        placeholder:'患者手机',
    },
    patientAddress: {
        value: '',
        title: '患者地址',
        titleEn: "Patient's address",
        type: 'text',
        question: '请您提供患者的所在城市（省、市、县区）',
        placeholder:'患者地址(省,市,区/县)',
    },
    patientTags: {
        value: [],
        title: '患者标签',
        titleEn: "Patient's Tags",
        type: 'tagsInput',
        placeholder:'患者标签',
        placeholderEn: "Patient's Tags",
    },
    patientWeight: {
        value: [],
        // title: '患者体重',
        // titleEn: "Patient's weight",
        properties: ['value', 'date', 'source'],
        headers: ['患者体重', '日期','来源'],
        headersEn: ["Patient's weight", 'Date','Source'],
        filter: {
            value: 'input',
            date: 'date',
            source:'dropdownFile'

        },
        subOptions: {

        },
        placeholders:{
            source:'选择来源',
            value:'患者体重(kg)'
        },
        type: 'mnform',
        question: '请问患者的体重'
    },
    patientHeight: {
        value: {
            value:'',
            date:null,
            source:'患者报告',
        },
        // title: '患者身高',
        // titleEn: "Patient's height",
        properties: ['value', 'date', 'source'],
        headers: ['患者身高', '日期', '来源'],
        headersEn: ["Patient's height", 'Date','Source'],
        filter: {
            value: 'text',
            date: 'date',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            value:'患者身高(cm)',
            source:'选择来源',
        },
        type: 'm1form',
        question: '请问患者的身高'
    },
    patientInsurance: {
        value: '',
        title: '患者保险单号',
        titleEn: "Patient's insurance number",
        type: 'text',
        question: '请您提供患者的保险单号（如您为保险客户，保险单号会用于与保险公司核实信息；如非保险客户，则不用提供。）',
        placeholder:'患者保险单号'
    },
    patientBirthday: {
        value: null,
        title: '患者出生日期',
        titleEn: "Patient's birthday",
        type: 'date',
        question: '请问患者出生日期是？（直接输入年月日，如20170608即可）'
    },

    patientRelativeName: {
        value: '',
        title: '患者家属姓名',
        titleEn: "Patient's family member's name",
        type: 'text',
        question: '请问患者家属的姓名',
        placeholder:'患者家属姓名',
    },

    patientRelativeMobile: {
        value: '',
        title: '患者家属联系方式',
        titleEn: "Patient's family member's mobile",
        type: 'text',
        question: '请问患者家属的联系方式',
        placeholder:'患者家属联系方式',
    },

    treatmentLocation: {
        value: '',
        title: '患者治疗所在地',
        titleEn: "Patient's treatment location",
        type: 'text',
        question: '请问患者治疗所在地',
        placeholder:'患者治疗所在地',
    },

    treatmentHospitalName: {
        value: '',
        title: '医院名称',
        titleEn: "Patient's treatment hospital name",
        type: 'text',
        question: '请问患者治疗医院名称',
        placeholder:'患者治疗医院名称',
    },

    treatmentDoctorName: {
        value: '',
        title: '主治医生姓名',
        titleEn: "Patient's doctor name",
        type: 'text',
        question: '请问主治医生姓名',
        placeholder:'患者主治医生姓名',
    },

    treatmentDepartmentName: {
        value: '',
        title: '医院科室名称',
        titleEn: "Patient's treatment department name",
        type: 'text',
        question: '请问患者医院科室名称',
        placeholder:'患者医院科室名称',
    },

    treatmentHospitalMobile: {
        value: '',
        title: '医院联系方式',
        titleEn: "Patient's hospital telephone number",
        type: 'text',
        question: '请问患者医院联系方式',
        placeholder:'患者医院联系方式',
    },

    patientGender: {
        value: '',
        title: '患者性别',
        titleEn: "Patient's gender",
        type: 'select',
        options: ['男', '女', '保密'],
        optionsEn: ['Male', 'Female', 'Unknown'],
        horizon: true,
        question: '请问患者的性别？',
        placeholder:'选择性别'
    },

    // 诊疗经过
    treatmentHistory:{
        value: [],
        title: '诊疗经过',
        titleEn: 'Treatment History',
        properties: ['description','event', 'date','source'],
        filter: {
            description: 'inputarea',
            event:'dropdown',
            date:'date',
            source:'dropdownFile',
        },
        subOptions:{
            event:['检查','住院','手术','放疗','发病','症状','疗效评估','化疗,靶向及免疫治疗等']
        },
        subOptionsEn:{
            event:['Examination', 'Hospitalization', 'Surgery', 'Radiation', 'Illness', 'Symptoms', 'Evaluation of efficacy', 'Chemotherapy, Targeting and immunotherapy etc.']
        },
        headers: ['简述','事件','日期'],
        headersEn: ['Description','Event','Date'],
        newLineSource:true,
        type: 'mnform',
    },


    // 当前诊断
    currentCondition:{
        value: {
            description:'',
            date:null,
            source:'患者报告'
        },
        properties: ['description','date', 'source'],
        headers: ['患者目前情况', '时间','来源'],
        headersEn: ['Current Condition', 'Date','Source'],
        filter: {
            description: 'dropdown',
            date:'date',
            source:'dropdownFile'
        },
        subOptions: {
            description:[
                '正常活动',
                '症状轻，生活自理',
                '能耐受，生活自理',
                '肿瘤症状严重',
                '病重卧床不起'
            ],
        },
        subOptionsEn: {
            description:[
                'Live normally',
                'Light symptoms',
                'Tolerable symptoms',
                'Serious symptoms',
                'Bedridden'
            ],
        },
        placeholders:{
            description: '患者目前情况',
            source:'选择来源'
        },
        type: 'm1form',
        question: "我们还需要了解患者目前的身体状况如何，有如下选项：1.正常活动, 2.症状轻，生活自理, 3.能耐受，生活自理, 4.肿瘤症状严重, 5.病重卧床不起"
    },

    ecog: {
        value: {
            score:null,
            date:null,
            recorder:'',
            source:'患者报告'
        },
        // title: 'ECOG评分',
        // titleEn: 'ECOG Score',
        properties: ['score', 'date','recorder', 'source'],
        headers: ['ECOG 评分', '日期','填写人', '来源'],
        headersEn: ['ECOG Score', 'Date','Recorder', 'Source'],
        filter: {
            score: 'dropdownHash',
            recorder:'text',
            date: 'date',
            source:'dropdownFile'
        },
        subOptions: {
            score:[
                {
                    value:100,
                    display:'100:正常，无症状和体征',
                },
                {
                    value:90,
                    display:'90:能进行正常活动，有轻微症状和体征',
                },
                {
                    value:80,
                    display:'80:勉强进行正常活动，有一些症状或体征',
                },
                {
                    value:70,
                    display:'70:生活能自理，但不能维持正常生活和工作',
                },
                {
                    value:60,
                    display:'60:生活能大部分自理，但偶尔需要别人帮助',
                },
                {
                    value:50,
                    display:'50:常需要人照料',
                },
                {
                    value:40,
                    display:'40:生活不能自理，需要特别照顾和帮助',
                },
                {
                    value:30,
                    display:'30:生活严重不能自理',
                },
                {
                    value:20,
                    display:'20:病重，需要住院和积极的支持治疗',
                },
                {
                    value:10,
                    display:'10:重危，临近死亡',
                },
                {
                    value:0,
                    display:'0:死亡',
                },
            ]
        },
        subOptionsEn: {
            score:[
                {
                    value:100,
                    display:'100:正常，无症状和体征',
                },
                {
                    value:90,
                    display:'90:能进行正常活动，有轻微症状和体征',
                },
                {
                    value:80,
                    display:'80:勉强进行正常活动，有一些症状或体征',
                },
                {
                    value:70,
                    display:'70:生活能自理，但不能维持正常生活和工作',
                },
                {
                    value:60,
                    display:'60:生活能大部分自理，但偶尔需要别人帮助',
                },
                {
                    value:50,
                    display:'50:常需要人照料',
                },
                {
                    value:40,
                    display:'40:生活不能自理，需要特别照顾和帮助',
                },
                {
                    value:30,
                    display:'30:生活严重不能自理',
                },
                {
                    value:20,
                    display:'20:病重，需要住院和积极的支持治疗',
                },
                {
                    value:10,
                    display:'10:重危，临近死亡',
                },
                {
                    value:0,
                    display:'0:死亡',
                },
            ]
        },
        type: 'm1form',
        question: '请问患者的ECOG评分?'
    },

    kps: {
        value: {
            score:null,
            recorder:'',
            date:null,
            source:'患者报告'
        },
        // title: 'KPS评分',
        // titleEn: 'KPS Score',
        properties: ['score', 'date', 'recorder','source'],
        headers: ['KPS 评分', '日期', '填写人', '来源'],
        headersEn: ['KPS Score', 'Date','Recorder', 'Source'],
        filter: {
            score: 'dropdownHash',
            recorder:'text',
            date: 'date',
            source:'dropdownFile'
        },
        subOptions: {
            score:[
                {
                    value:0,
                    display:'0:活动能力完全正常，与起病前活动能力无任何差异'
                },
                {
                    value:1,
                    display:'1:能自由走动及从事轻体力活动'
                },
                {
                    value:2,
                    display:'2:能自由走动及生活自理，丧失工作能力'
                },
                {
                    value:3,
                    display:'3:生活仅能部分自理，日间一半以上时间卧床或坐轮椅'
                },
                {
                    value:4,
                    display:'4:卧床不起，生活不能自理。'
                },
                {
                    value:5,
                    display:'5:死亡'
                },
            ]
        },
        subOptionsEn: {
            score:[
                {
                    value:0,
                    display:'0:活动能力完全正常，与起病前活动能力无任何差异'
                },
                {
                    value:1,
                    display:'1:能自由走动及从事轻体力活动'
                },
                {
                    value:2,
                    display:'2:能自由走动及生活自理，丧失工作能力'
                },
                {
                    value:3,
                    display:'3:生活仅能部分自理，日间一半以上时间卧床或坐轮椅'
                },
                {
                    value:4,
                    display:'4:卧床不起，生活不能自理。'
                },
                {
                    value:5,
                    display:'5:死亡'
                },
            ]
        },
        type: 'm1form',
        question: '请问患者的KPS评分'
    },

    presentDiagnosis:{
        value: {
            cancerType: '',
            stage: '',
            diagnosisDate: null,
            source:'患者报告'
        },
        // title: '癌症类型',
        // titleEn: 'Cancer Type',
        properties: ['cancerType','stage', 'diagnosisMethod', 'diagnosisDate', 'source'],
        headers: ['癌症类型','分期','确诊方式','确诊日期', '来源'],
        headersEn: ['Cancer Type','Stage',  'Diagnosis Method', 'Diagnosis Date', 'Source'],
        filter: {
            cancerType: 'text',
            stage:'dropdown',
            diagnosisMethod:'dropdown',
            diagnosisDate: 'date',
            source:'dropdownFile'
        },
        subOptions: {
            stage:['0期', '1期', '2期', '3期', '4期', '其他'],
            diagnosisMethod:['影像学','病理报告(含基因检测)','其他'],
        },
        subOptionsEn: {
            stage:['Stage 0', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Other'],
            diagnosisMethod:['Imaging','Pathology report (including genetic testing)','Other']
        },
        placeholders:{
            cancerType: '如：右侧乳房乳腺癌',
            stage: '分期',
            source:'选择来源'
        },
        type: 'm1form',
        question: '请问您患者的诊断的肿瘤是什么类型（如尚未确诊，医生目前怀疑的肿瘤是什么）？'
    },

    geneMutations: {
        value: [],
        title: '基因突变',
        titleEn: 'Gene Mutations',
        properties: ['gene', 'result','source' ],
        headers: ['基因', '结果','来源'],
        headersEn: ['Gene', 'Result', 'Source'],
        filter: {
            gene: 'input',
            result: 'dropdown',
            source:'dropdownFile'
        },
        subOptions: {
            result:['突变','野生型']
        },
        subOptionsEn:{
            result:['Mutant','Wild-type']
        },
        // newLineSource:true,
        placeholders:{
            source:'选择来源'
        },
        type: 'mnform',
        question: '请问患者有哪些基因突变？'
    },

    proteinExpression:{
        value: [],
        title: '蛋白表达',
        titleEn: 'Protein Expression',
        properties: ['proteinName','result','positiveRate', 'source'],
        headers: ['蛋白','结果','阳性率', '来源'],
        headersEn: ['Protein','Result','Positive Rate', 'Source'],
        filter: {
            proteinName: 'input',
            result:'dropdown',
            positiveRate:'input',
            source:'dropdownFile'
        },
        subOptions: {
            result:['阴性-','弱阳性+','中等阳性++','强阳性+++'],
        },
        placeholders:{
            proteinName: '蛋白名称',
            source:'选择来源',
            positiveRate:'百分比'
        },
        type: 'mnform',
        question: "请问您患者的蛋白表现是什么？"
    },

    tumorMutationBurden:{
        value: {
            result: '',
            source:'患者报告'
        },
        // title: '癌症类型',
        // titleEn: 'Cancer Type',
        properties: ['result','source'],
        headers: ['肿瘤突变负荷','来源'],
        headersEn: ['Tumor Mutation Burden', 'Source'],
        filter: {
            result: 'dropdown',
            source:'dropdownFile'
        },
        subOptions: {
            result:['高', '中', '低'],
        },
        subOptionsEn: {
            result:['High', 'Medium', 'Low'],
        },
        placeholders:{
            source:'选择来源'
        },
        type: 'm1form',
        question: '请问您患者的肿瘤突变负荷程度?'
    },

    MMRstatus:{
        value: {
            result: '',
            diagnosisMethod: '',
            source:'患者报告'
        },
        // title: '癌症类型',
        // titleEn: 'Cancer Type',
        properties: ['result','diagnosisMethod','source'],
        headers: ['MMR状态','确诊方式','来源'],
        headersEn: ['MMR Status', 'Diagnosis Method','Source'],
        filter: {
            result: 'dropdown',
            diagnosisMethod: 'dropdown',
            source:'dropdownFile'
        },
        subOptions: {
            result:['pMMR', 'dMMR'],
            diagnosisMethod:['IHC','基因检测']
        },
        subOptionsEn: {
            result:['pMMR', 'dMMR'],
            diagnosisMethod:['IHC','Genetic Test']
        },
        placeholders:{
            source:'选择来源'
        },
        type: 'm1form',
        question: '请问您患者的MMR状态是什么?'
    },

    diseaseLocation:{
        value: {
            description:'',
            source:'患者报告'
        },
        // title: '肿瘤位置',
        // titleEn: 'Disease Location',
        properties: ['description', 'source'],
        headers: ['原发部位', '来源'],
        headersEn: ['Disease Location', 'Source'],
        filter: {
            description: 'text',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            description: '原发部位',
            source:'选择来源'
        },
        type: 'm1form',
        question: "请问您患者的肿瘤位置是哪里？"
    },

    metastases: {
        value: {
            description:'',
            source:'患者报告'
        },
        // title: '肿瘤转移部位',
        // titleEn: 'Metastases',
        properties: ['description', 'source'],
        headers: ['转移部位', '来源'],
        headersEn: ['Metastases', 'Source'],
        filter: {
            description: 'dropdownMulti',
            source:'dropdownFile'
        },
        subOptions: {
            description:['淋巴结','肺','肝','肠道','脑','骨骼','皮肤','其他'],
        },
        subOptionsEn: {
            description:[ 'Lymph node', 'Lung', 'Liver', 'Intestinal', 'Brain', 'Bone', 'Skin', 'Other'],
        },
        placeholders:{
            description: '转移部位',
            source:'选择来源'
        },
        type: 'm1form',
        question: '请问肿瘤的转移部位有哪些？'
    },



    // 医疗史
    majorDisease: {
        value: [],
        title: '重大疾病(包括：高血压、糖尿病等慢性病史，自身免疫性疾病史，肝炎、HIV、梅毒等传染病史)',
        titleEn: 'Major Disease',
        properties: ['disease', 'description','startDate', 'endDate',  'treatment','source' ],
        headers: ['疾病名称', '疾病描述', '开始时间', '结束时间', '接受过的治疗'],
        headersEn: ['Disease', 'Description', 'Start Date', 'End Date', 'Treatment'],
        filter: {
            disease: 'text',
            description: 'textarea',
            startDate: 'date',
            endDate: 'date',
            treatment: 'textarea',
            source:'dropdownFile'
        },
        subOptions: {

        },
        newLineSource:true,
        placeholders:{
            source:'选择来源'
        },
        type: 'mnform',
        question: '请问患者有哪些重大疾病史？'
    },

    majorTrauma:{
        value: [],
        title: '重大外伤',
        titleEn: 'Major Trauma',
        properties: ['description','date','source'],
        headers: ['外伤描述', '时间', '来源'],
        headersEn: ['Description','Date','Source'],
        filter: {
            description: 'inputarea',
            date: 'date',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            description:'重大外伤描述',
            source:'选择来源'
        },
        type: 'mnform',
        question: '请问患者有哪些重大外伤史？'
    },

    surgicalHistory: {
        value: [],
        title: '手术信息',
        titleEn: 'Surgical History',
        properties: ['name', 'date', 'evaluation','source'],
        headers: ['手术名称', '手术日期', '疗效评估'],
        headersEn: ['Surgery Name', 'Date', 'Evaluation'],
        filter: {
            name: 'text',
            date: 'date',
            evaluation: 'dropdown',
            source:'dropdownFile'
        },
        subOptions: {
            evaluation: ['痊愈', '好转', '无变化', '恶化'],
        },
        subOptionsEn: {
            evaluation:['Healed', 'Improved', 'No Change', 'Deteriorated'],
        },
        newLineSource:true,
        placeholders:{
            // name:'手术名称',
            source:'选择来源',
            evaluation:'选择疗效'
        },
        type: 'mnform',
        question: '请您您提供一下具体之前接受的手术信息，包括手术日期，手术名称，以及术后的恢复情况。（如不清楚具体内容，您可以直接把患者最近手术的出院小结拍照发给我们。）'
    },

    otherCancer: {
        value: [],
        title: '其他肿瘤诊断',
        titleEn: 'Other Cancer',
        properties: ['cancer', 'date', 'treatment', 'evaluation', 'staging','source'],
        headers: ['肿瘤类型', '肿瘤诊断日期', '治疗方法', '疗效评估', '分期'],
        headersEn: ['Cancer', 'Diagnosis Date', 'Treatment', 'Evaluation', 'Stage'],
        filter: {
            cancer: 'text',
            date: 'date',
            treatment: 'textarea',
            evaluation: 'dropdown',
            staging: 'dropdown',
            source:'dropdownFile'
        },
        subOptions: {
            staging:['0期', '1期', '2期', '3期', '4期', '其他'],
            evaluation: ['痊愈', '好转', '无变化', '恶化'],
        },
        subOptionsEn: {
            staging:['Stage 0', 'Stage 1', 'Stage 2', 'Stage 3', 'Stage 4', 'Other'],
            evaluation:['Healed', 'Improved', 'No Change', 'Deteriorated'],
        },
        newLineSource:true,
        placeholders:{
            source:'选择来源',
            evaluation:'选择疗效'
        },
        type: 'mnform',
        question: '请问患者之前有诊断过其他肿瘤吗？如果有的话，请您提供肿瘤类型、肿瘤诊断日期、采取的治疗方法以及疗效'
    },

    familyHistoryCancer: {
        value: [],
        title: '家族患癌史',
        titleEn: 'Family History of Cancer',
        properties: ['relationship', 'cancerType', 'details', 'source'],
        headers: ['亲属关系', '癌症类型', '详细描述'],
        headersEn: ['Relationship', 'Cancer', 'Details'],
        filter: {
            relationship: 'text',
            cancerType: 'text',
            details: 'textarea',
            source:'dropdownFile'
        },
        newLineSource:true,
        subOptions: {

        },
        placeholders:{
            source:'选择来源',
        },
        type: 'mnform',
        question: '请问患者家族是否有过患癌历史？如果有，请提供患者与患癌亲属的关系、癌症类型以及亲属当前情况。',
    },

    familyHistoryGenetic: {
        value: [],
        title: '家族基因突变史',
        titleEn: 'Family History of Gene Mutations',
        properties: ['gene','source'],
        headers: ['家族基因突变史','来源'],
        headersEn: ['Gene','Source'],
        filter: {
            gene: 'inputarea',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            gene:'家族基因突变史',
            source:'选择来源',
        },
        type: 'mnform',
        question: '请问患者家族是否有过基因疾病历史？',
    },

    allergies: {
        value: [],
        title: '过敏史',
        titleEn: 'Allergies',
        properties: ['allergicTo', 'reactionAndSeverity','source'],
        headers: ['过敏原', '反应及严重程度','来源'],
        headersEn: ['Allergic To', 'Reaction And Severity','Source'],
        filter: {
            allergicTo: 'input',
            reactionAndSeverity: 'input',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            allergicTo:'过敏原',
            reactionAndSeverity:'反应及严重程度',
            source:'选择来源',
        },
        type: 'mnform',
        question: '请问患者有过敏史吗？',
    },

    briefTreatment: {
        value: {
            description:'',
            source:'患者报告',
        },
        properties: ['description', 'source'],
        headers: ['治疗简述(微信病历提交用)', '来源'],
        headersEn: ['Brief Treatment', 'Source'],
        filter: {
            description: 'textarea',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            description:'治疗简述',
            source:'选择来源',
        },
        type: 'm1form',
        question: '',
    },

    martialStatus: {
        value: {
            description:'',
            source:'患者报告',
        },
        // title: '婚姻状态',
        // titleEn: 'Martial Status',
        properties: ['description', 'source'],
        headers: ['婚姻状态', '来源'],
        headersEn: ['Martial Status', 'Source'],
        filter: {
            description: 'dropdown',
            source:'dropdownFile'
        },
        subOptions: {
            description:['有','无'],
        },
        subOptionsEn: {
            description:['Yes', 'No'],
        },
        placeholders:{
            description:'选择婚姻状态',
            source:'选择来源',
        },
        type: 'm1form',
        question: '请问患者当前的婚姻状态是什么?'
    },

    smoking: {
        value: {
            description:'',
            source:'患者报告',
        },
        // title: '吸烟史',
        // titleEn: 'Smoking History',
        properties: ['description', 'source'],
        headers: ['吸烟史', '来源'],
        headersEn: ['Smoking History', 'Source'],
        filter: {
            description: 'textarea',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            description:'吸烟史',
            source:'选择来源',
        },
        type: 'm1form',
        question: '请问患者是否有吸烟历史？如果有，请提供龄、已戒烟年数以及每日吸烟数。',
    },

    drinking: {
        value: {
            description:'',
            source:'患者报告',
        },
        // title: '饮酒史',
        // titleEn: 'Drinking History',
        properties: ['description', 'source'],
        headers: ['饮酒史', '来源'],
        headersEn: ['Drinking History', 'Source'],
        filter: {
            description: 'textarea',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            description:'饮酒史',
            source:'选择来源',
        },
        type: 'm1form',
        question: '请问患者是否有饮酒史？',
    },

    drugUse: {
        value: {
            description:'',
            source:'患者报告',
        },
        // title: '药物史',
        // titleEn: 'Drug History',
        properties: ['description', 'source'],
        headers: ['精神类或阿片类(吗啡类)止痛药使用史', '来源'],
        headersEn: ['Drug History', 'Source'],
        filter: {
            description: 'textarea',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            description:'药物史',
            source:'选择来源',
        },
        type: 'm1form',
        question: '请问患者是否用过精神类或阿片类(吗啡类)止痛药？',
    },

    menstrualPeriod: {
        value: {
            menopausalStatus:'',
            lastMenstrualPeriod:null,
        },
        // title: '更年期',
        // titleEn: 'Menstrual Period',
        properties: ['menopausalStatus', 'lastMenstrualPeriod','source'],
        headers: ['更年期', '最后一次月经','来源'],
        headersEn: ['Menopausal Status', 'Last Menstrual Period','Source'],
        filter: {
            menopausalStatus: 'dropdown',
            lastMenstrualPeriod: 'date',
            source:'dropdownFile'
        },
        subOptions: {
            menopausalStatus:['是','否'],
        },
        subOptionsEn: {
            menopausalStatus:['Yes', 'No'],
        },
        placeholders:{
            menopausalStatus:'选择状态',
            source:'选择来源',
        },
        type: 'm1form',
        question: '请问患者是否还有月经？',
    },

    // 既往治疗
    treatmentSummary: {
        value: {
            description:'',
        },
        properties: ['description', ],
        headers: ['既往治疗（可多选）'],
        headersEn: ['Treatment Summary'],
        filter: {
            description: 'dropdownMulti',
        },
        subOptions: {
            description:['手术','放疗','化疗','内分泌治疗','靶向治疗','免疫治疗','中药治疗','其他'],
        },
        subOptionsEn: {
            description:[ 'Surgery', 'Radiotherapy', 'Chemotherapy', 'Hormone Therapy', 'Targeted Therapy', 'Immunotherapy', 'Chinese Therapy', 'Other'],
        },
        placeholders:{

        },
        type: 'm1form',
    },

    currentMedications: {
        value: [],
        title: '当前用药情况',
        titleEn: 'Current Medications',
        properties: ['drug', 'dose', 'period','startDate', 'indication','source'],
        filter: {
            drug: 'text',
            dose: 'text',
            period:'text',
            startDate:'date',
            indication: 'text',
            source:'dropdownFile'
        },
        headers: ['药物名', '用法用量', '用药周期','开始日期', '适应症'],
        headersEn: ['Drug', 'Dose', 'Period','Start Date', 'Indication'],
        subOptions: {

        },
        newLineSource:true,
        placeholders:{
            source:'选择来源',
        },
        type: 'mnform',
        question: '请问目前患者正在使用的药物有哪些，以及用法用量？（包括化疗计划药物及放疗等）'
    },
    chemotherapy: {
        value: [],
        title: '化疗信息',
        titleEn: 'Chemotherapy',
        properties: ['drug', 'dose', 'frequency','period', 'startDate', 'endDate', 'evaluation','toxicity','source'],
        filter: {
            drug: 'text',
            dose: 'textarea',
            frequency: 'text',
            period: 'text',
            startDate: 'date',
            endDate: 'date',
            evaluation: 'dropdown',
            toxicity:'textarea',
            source:'dropdownFile'
        },
        subOptions: {
            evaluation: ['术前新辅助治疗', '术后辅助治疗', '完全缓解', '部分缓解', '疾病稳定', '疾病进展', '正在进行中尚未评估']
        },
        subOptionsEn: {
            evaluation:['Preoperative Neoadjuvant Therapy', 'Postoperative Adjuvant Therapy', 'Complete Alleviation', 'Partial Alleviation', 'Stable Disease', 'Disease Progress', 'Evaluation Ongoing']
        },
        placeholders:{
            source:'选择来源',
        },
        newLineSource:true,
        headers: ['药物', '药物及用法用量','频率', '化疗周期', '开始日期', '结束日期', '疗效评估','毒性'],
        headersEn: ['Drug', 'Dose', 'Frequency','Period', 'Start Date', 'End Date', 'Evaluation','Toxicity'],
        type: 'mnform',
        question: '请您提供一下具体之前接受的化疗的信息，包括具体化疗的用药，剂量，化疗的周期，化疗的开始时间等。（如不清楚具体内容，您可以直接把患者最近1次化疗的出院小结拍照发给我们。）'
    },
    radiotherapy: {
        value: [],
        title: '放疗信息',
        titleEn: 'Radiotherapy',
        properties: ['position', 'doseAmount', 'frequency','totalRadiationDose','startDate', 'endDate', 'setting','evaluation','toxicity','source'],
        filter: {
            position: 'textarea',
            doseAmount: 'textarea',
            frequency: 'textarea',
            totalRadiationDose:'textarea',
            startDate: 'date',
            endDate: 'date',
            setting:'textarea',
            evaluation: 'dropdown',
            toxicity:'textarea',
            source:'dropdownFile'
        },
        subOptions: {
            evaluation: ['术前新辅助治疗', '术后辅助治疗', '完全缓解', '部分缓解', '疾病稳定', '疾病进展', '正在进行中尚未评估']
        },
        subOptionsEn: {
            evaluation:['Preoperative Neoadjuvant Therapy', 'Postoperative Adjuvant Therapy', 'Complete Alleviation', 'Partial Alleviation', 'Stable Disease', 'Disease Progress', 'Evaluation Ongoing']
        },
        placeholders:{
            source:'选择来源',
        },
        newLineSource:true,
        headers: ['放疗部位', '放疗剂量', '频率','总剂量','开始日期', '结束日期', '放疗设置', '疗效评估', '毒性'],
        headersEn: ['Position', 'Dose', 'Frequency','Total Dose','Start Date', 'End Date', 'Setting','Evaluation','Toxicity'],
        type: 'mnform',
        question: '请您提供一下具体之前接受的放疗的信息，包括接受的放射部位，具体剂量及次数，开始及结束日期，疗效如何？（如不清楚具体内容，您可以直接把患者放疗的出院小结拍照发给我们。）'
    },
    targetedTherapy: {
        value: [],
        title: '靶向治疗信息',
        titleEn: 'Targeted Therapy',
        properties: ['drug', 'dose', 'startDate', 'endDate', 'evaluation','source'],
        filter: {
            drug: 'text',
            dose: 'text',
            startDate: 'date',
            endDate: 'date',
            evaluation: 'dropdown',
            source:'dropdownFile'
        },
        headers: ['药物名', '用法用量', '开始日期', '结束日期', '疗效评估'],
        headersEn: ['Drug', 'Dose', 'Start Date', 'End Date', 'Evaluation'],
        subOptions: {
            evaluation: ['术前新辅助治疗', '术后辅助治疗', '完全缓解', '部分缓解', '疾病稳定', '疾病进展', '正在进行中尚未评估']
        },
        subOptionsEn: {
            evaluation:['Preoperative Neoadjuvant Therapy', 'Postoperative Adjuvant Therapy', 'Complete Alleviation', 'Partial Alleviation', 'Stable Disease', 'Disease Progress', 'Evaluation Ongoing']
        },
        newLineSource:true,
        placeholders:{
            source:'选择来源',
        },
        type: 'mnform',
        question: '请您提供一下具体之前接受的靶向治疗的信息，包括接受药物名，具体用法用量，开始使用的日期以及结束日期？（如不清楚具体内容，您可以直接把患者出院或病历小结拍照发给我们。）'
    },

    hormoneTherapy: {
        value: [],
        title: '内分泌治疗信息',
        titleEn: 'Hormone Therapy',
        properties: ['drug', 'dose', 'frequency','startDate', 'endDate', 'evaluation','source'],
        filter: {
            drug: 'text',
            dose: 'text',
            frequency: 'text',
            startDate: 'date',
            endDate: 'date',
            evaluation: 'dropdown',
            source:'dropdownFile'
        },
        subOptions: {
            evaluation: ['术前新辅助治疗', '术后辅助治疗', '完全缓解', '部分缓解', '疾病稳定', '疾病进展', '正在进行中尚未评估']
        },
        subOptionsEn: {
            evaluation:['Preoperative Neoadjuvant Therapy', 'Postoperative Adjuvant Therapy', 'Complete Alleviation', 'Partial Alleviation', 'Stable Disease', 'Disease Progress', 'Evaluation Ongoing']
        },
        placeholders:{
            source:'选择来源',
        },
        headers: ['药物名', '用法用量','频率', '开始日期', '结束日期', '疗效评估'],
        headersEn: ['Drug', 'Dose', 'Frequency','Start Date', 'End Date', 'Evaluation'],
        newLineSource:true,
        type: 'mnform',
        question: '请您提供一下具体之前接受的内分泌治疗的信息，包括接受药物名，具体用法用量，开始使用的日期以及结束日期？（如不清楚具体内容，您可以直接把患者的出院小结拍照发给我们。）'
    },
    immunotherapy: {
        value: [],
        title: '免疫治疗信息',
        titleEn: 'Immunotherapy',
        properties: ['drug', 'dose', 'frequency', 'startDate', 'endDate', 'evaluation','source'],
        filter: {
            drug: 'text',
            dose: 'text',
            frequency:'text',
            startDate: 'date',
            endDate: 'date',
            evaluation: 'dropdown',
            source:'dropdownFile'
        },
        subOptions: {
            evaluation: ['术前新辅助治疗', '术后辅助治疗', '完全缓解', '部分缓解', '疾病稳定', '疾病进展', '正在进行中尚未评估']
        },
        subOptionsEn: {
            evaluation:['Preoperative Neoadjuvant Therapy', 'Postoperative Adjuvant Therapy', 'Complete Alleviation', 'Partial Alleviation', 'Stable Disease', 'Disease Progress', 'Evaluation Ongoing']
        },
        placeholders:{
            source:'选择来源',
        },
        headers: ['药物名', '用法用量', '频率','开始日期', '结束日期', '疗效评估'],
        headersEn: ['Drug', 'Dose', 'Frequency', 'Start Date', 'End Date', 'Evaluation'],
        newLineSource:true,
        type: 'mnform',
        question: '请您提供一下具体之前接受的免疫治疗的信息，包括接受药物名，具体用法用量，开始使用的日期以及结束日期？（如不清楚具体内容，您可以直接把患者的出院小结拍照发给我们。）'
    },
    chineseTherapy: {
        value: [],
        title: '中药治疗信息',
        titleEn: 'Chinese Therapy',
        properties: ['drug', 'dose', 'startDate', 'endDate', 'comment', 'indication','source'],
        filter: {
            drug: 'text',
            dose: 'text',
            startDate: 'date',
            endDate: 'date',
            comment: 'textarea',
            indication: 'textarea',
            source:'dropdownFile'
        },
        subOptions: {

        },
        placeholders:{
            source:'选择来源',
        },
        headers: ['药物名', '用法用量', '开始日期', '结束日期', '简述', '适应症'],
        headersEn: ['Drug', 'Dose', 'Start Date', 'End Date', 'Comment', 'Indication'],
        newLineSource:true,
        type: 'mnform',
        question: '请您提供一下具体之前接受的中药治疗的信息，包括接受药物，具体用法用量，开始使用的日期以及结束日期？（如不清楚具体内容，您可以直接把患者出院或病历小结拍照发给我们。）'
    },
    otherTherapy: {
        value: [],
        title: '其他治疗信息',
        titleEn: 'Other Therapy',
        properties: ['drug', 'dose', 'frequency', 'startDate', 'endDate', 'comment','indication','source'],
        filter: {
            drug: 'text',
            dose: 'text',
            frequency: 'text',
            startDate: 'date',
            endDate: 'date',
            comment: 'textarea',
            indication: 'textarea',
            source:'dropdownFile'
        },
        headers: ['药物名', '用法用量', '频率',  '开始日期', '结束日期', '简述', '适应症'],
        headersEn: ['Drug', 'Dose', 'Frequency', 'Start Date', 'End Date', 'Comment','Indication'],
        newLineSource:true,
        subOptions: {

        },
        placeholders:{
            source:'选择来源',
        },
        type: 'mnform',
        question: '请您提供一下具体之前接受的其他药物的信息，包括接受药物名，具体用法用量，开始使用的日期以及结束日期？（如不清楚具体内容，您可以直接把患者出院或病历小结拍照发给我们。）如患者有使用预防骨转移的药物名。'
    },

    imagingAndRadiology:{
        value: [],
        title: '放射成像检查',
        titleEn: 'Imaging And Radiology',
        properties: ['imageType', 'reportDate', 'observations','results','source'],
        filter: {
            imageType: 'text',
            reportDate: 'date',
            observations:'textarea',
            results:'textarea',
            source:'dropdownFile'
        },
        headers: ['影片类型', '日期', '观测值','结果'],
        headersEn: ['Image Type', 'Date', 'Observations','Results'],
        newLineSource:true,
        subOptions: {

        },
        placeholders:{
            source:'选择来源',
        },
        type: 'mnform',
        question: '请问患者做过哪些放射成像检查？'
    },

    pathologyAndCytology:{
        value: [],
        title: '病理学和细胞学检查',
        titleEn: 'Pathology And Cytology',
        properties: ['date', 'sampleId', 'sampleSite','procedure','grossDescription','diagnosis','proteinExpression','source'],
        filter: {
            date:'date',
            sampleId: 'text',
            sampleSite: 'text',
            procedure:'textarea',
            grossDescription:'textarea',
            diagnosis:'textarea',
            proteinExpression:'textarea',
            source:'dropdownFile'
        },
        headers: ['日期', '样本Id','样本部位','采样步骤','简述','诊断','蛋白质表达'],
        headersEn: ['Date', 'Sample Id', 'Sample Site','Procedure','Description','Diagnosis','Protein Expression'],
        newLineSource:true,
        subOptions: {

        },
        placeholders:{
            source:'选择来源',
        },
        type: 'mnform',
        question: '请问患者做过哪些病理学和细胞学检查？'
    },

    molecularTests:{
        value: [],
        title: '基因检测',
        titleEn: 'Molecular Tests',
        properties: ['gene', 'result','source'],
        filter: {
            gene: 'text',
            result:'textarea',
            source:'dropdownFile'
        },
        headers: ['基因', '结果'],
        headersEn: ['Gene', 'Result'],
        newLineSource:true,
        subOptions: {

        },
        placeholders:{
            source:'选择来源',
        },
        type: 'mnform',
        question: '请问患者做过哪些基因检测？'
    },

    recentLabs:{
        value: [],
        title: '近期化验',
        titleEn: 'Recent Labs',
        properties: ['lab', 'result', 'referenceRange','date','source'],
        filter: {
            lab: 'text',
            result: 'text',
            referenceRange:'text',
            date:'date',
            source:'dropdownFile'
        },
        headers: ['化验名称', '结果', '参考值范围','日期'],
        headersEn: ['Lab Name', 'Result', 'Reference Range','Date'],
        newLineSource:true,
        subOptions: {

        },
        placeholders:{
            source:'选择来源',
        },
        type: 'mnform',
        question: '请问患者近期做过哪些化验？'
    },

    // 问题总结
    patientQuestions:{
        value: [],
        title: '患者提问',
        titleEn: 'Patient Questions',
        properties: ['question'],
        filter: {
            question: 'inputarea',
        },
        headers: ['问题'],
        headersEn: ['Question'],
        type: 'mnform',
        question: '请问患者有哪些问题需要咨询？'
    },


    documents: {
        value: [],
        title: '病例文件',
        properties: ['documentName','ossFileKey', 'documentType','institution','providerName', 'visitDate', 'comments', 'documentId'],
        filter: {
            date: 'date',
        },
        documentTypeOptions: [
            '病历记录',
            '血液检查报告',
            '尿液及大便常规',
            '细菌培养报告',
            '病理检查报告',
            '内镜操作检查报告',
            '影像学检查报告',
            '合同',
            '证件'
        ],
        documentTypeOptionsEn: [
            'Medical Record',
            'Blood Test',
            'Urine and Stool Report',
            'Bacterial Culture Report',
            'Pathology Report',
            'Endoscopic Inspection Report',
            'Imaging Report',
            'Contract',
            'ID',
        ],
        type: 'documents',
        question: '请上传所有的检查记录'
    },

    // 随访记录
    followUps:{
        value: [],
        title: '随访记录',
        titleEn: 'Follow-up',
        properties: ['note','date', 'operator'],
        filter: {
            note: 'inputarea',
            date:'date',
            operator:'input',
        },
        headers: ['详细记录','日期','随访人'],
        headersEn: ['Note','Date','Operator'],
        type: 'mnform',
    },

    // dicom
    dicomFiles:{
        value: [],
        title: 'Dicom 文件',
        titleEn: 'Dicom Files',
        properties: ['accessionNumber'],
        filter: {
            accessionNumber:'input',
        },
        headers: ['Accession Number'],
        headersEn: ['Accession Number'],
        type: 'mnform',
        documentTypeOptions: [
            'CT',
            'PETCT',
        ],
        documentTypeOptionsEn: [
            'CT',
            'PETCT',
        ],
    },
};

export default constant;