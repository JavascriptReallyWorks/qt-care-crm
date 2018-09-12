const encrypt = require('mongoose-encryption');

module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    let medicalRecord = {
        //
        openid: {type:String, index:true},
        userid: String,
        medical_record_id: String,
        encrypt_code: String,
        translated: {type:Boolean, default:false},

        // medical summary
        summaryCnOssKey:String,
        summaryEnOssKey:String,
        dicomCaseNumber:String,

        // patient info
        patientName: {type:String, index:true},
        patientGender: String,
        patientMobile: String,
        patientAddress: String,
        patientTags: [String],
        patientWeight: [{
            _id: false,
            value: String,
            date: Date,
            source: String
        }],
        patientHeight: {
            value: String,
            date: Date,
            source: String
        },
        patientInsurance: String,
        patientBirthday: Date,

        patientRelativeName: String,
        patientRelativeMobile: String,
        treatmentLocation:String,
        treatmentHospitalName:String,
        treatmentDoctorName:String,
        treatmentDepartmentName:String,
        treatmentHospitalMobile:String,

        // 治疗经过
        treatmentHistory:[{
            _id: false,
            description:String,
            event:String,
            date:String,
            source:String,
        }],


        presentDiagnosis: {
            cancerType: String,
            stage: String,
            diagnosisMethod: String,    // 确诊方式
            diagnosisDate: Date,
            source: String,
        },

        // 基因突变
        geneMutations:[{
            gene:String,
            result:String,
            source:String,
        }],

        // 分子标记蛋白（Protein)
        proteinExpression: [{
            proteinName: String,
            result:String,
            positiveRate:String,
            source: String,
        }],

        // 肿瘤突变负荷
        tumorMutationBurden:{
            result:String,
            source:String
        },

        // MMR状态
        MMRstatus:{
            result:String,
            diagnosisMethod: String,    // 确诊方式
            source:String
        },

        diseaseLocation: {
            description: String,
            source: String,
        },
        metastases: {
            description: [String],
            source: String,
        },

        currentCondition: {
            description: String,
            date: Date,
            source: String,
        },

        ecog: {
            score: Number,
            date: Date,
            recorder:String, //填写人
            source: String
        },

        kps: {
            score: Number,
            date: Date,
            recorder:String,
            source: String
        },

        // 医疗史 
        // medicalHistory:['majorDisease', 'majorTrauma', 'otherCancer', 'surgicalHistory','familyHistory','allergies', 'martialStatus','smoking', 'drinking', 'drugUse', 'menstrualPeriod'],
        majorDisease: [{
            _id: false,
            disease: String,
            description: String,
            startDate: Date,
            endDate: Date,
            treatment: String,
            source: String
        }],

        majorTrauma: [{
            _id: false,
            description: String,
            date: Date,
            source: String
        }],

        otherCancer: [{
            _id: false,
            cancer: String,
            date: Date,
            treatment: String,
            evaluation: String,
            staging: String,
            source: String
        }],

        surgicalHistory: [{
            _id: false,
            name: String,
            date: Date,
            evaluation: String,
            source: String
        }],

        familyHistoryCancer: [{
            _id: false,
            relationship: String,
            cancerType: String,
            details: String,
            source: String
        }],

        familyHistoryGenetic: [{
            _id: false,
            gene: String,
            source: String
        }],

        allergies: [{
            _id: false,
            allergicTo: String,
            reactionAndSeverity: String,
            source: String
        }],

        briefTreatment: {
            description: String,
            source: String
        },

        martialStatus: {
            description: String,
            source: String
        },
        smoking: {
            description: String,
            source: String
        },
        drinking: {
            description: String,
            source: String
        },
        drugUse: {
            description: String,
            source: String
        },

        menstrualPeriod: {
            menopausalStatus: String,
            lastMenstrualPeriod: Date,
            source: String
        },



        // 诊疗经过
        //treatment: ['currentMedications', 'chemotherapy', 'radiotherapy', 'targetedTherapy', 'hormoneTherapy', 'immunotherapy', 'chineseTherapy', 'otherTherapy','imagingAndRadiology','pathologyAndCytology','molecularTests','recentLabs'],        

        treatmentSummary: {
            description: [String],
        },

        currentMedications: [{
            _id: false,
            drug: String,
            dose: String,
            period: String,
            startDate: Date,
            indication: String,
            source: String
        }],
        chemotherapy: [{
            _id: false,
            drug: String,
            dose: String,
            frequency: String,
            period: String,
            startDate: Date,
            endDate: Date,
            evaluation: String,
            toxicity: String,
            source: String
        }],
        radiotherapy: [{
            _id: false,
            position: String,
            doseAmount: String,
            frequency: String,
            totalRadiationDose: String,
            startDate: Date,
            endDate: Date,
            setting: String,
            evaluation: String,
            toxicity: String,
            source: String
        }],
        targetedTherapy: [{
            _id: false,
            drug: String,
            dose: String,
            startDate: Date,
            endDate: Date,
            evaluation: String,
            source: String
        }],
        hormoneTherapy: [{
            _id: false,
            drug: String,
            dose: String,
            frequency: String,
            startDate: Date,
            endDate: Date,
            evaluation: String,
            source: String
        }],
        immunotherapy: [{
            _id: false,
            drug: String,
            dose: String,
            frequency: String,
            startDate: Date,
            endDate: Date,
            evaluation: String,
            source: String
        }],
        chineseTherapy: [{
            _id: false,
            drug: String,
            dose: String,
            startDate: Date,
            endDate: Date,
            comment: String,
            indication: String,
            source: String
        }],
        otherTherapy: [{
            _id: false,
            drug: String,
            dose: String,
            frequency: String,
            startDate: Date,
            endDate: Date,
            comment: String,
            indication: String,
            source: String
        }],

        imagingAndRadiology: [{
            _id: false,
            imageType: String,
            reportDate: Date,
            observations: String,
            results: String,
            source: String
        }],

        pathologyAndCytology: [{
            _id: false,
            date: Date,
            sampleId: String,
            sampleSite: String,
            procedure: String,
            grossDescription: String,
            diagnosis: String,
            proteinExpression: String,
            source: String
        }],

        molecularTests: [{
            _id: false,
            gene: String,
            result: String,
            source: String
        }],

        recentLabs: [{
            _id: false,
            lab: String,
            result: String,
            referenceRange: String,
            date: Date,
            source: String
        }],



        // 问题总结
        patientQuestions: [{
            _id: false,
            id:String,
            question: String,
            answer: String,
        }],

        //随访
        followUps: [{
            _id: false,
            note: String,
            date: Date,
            operator: String,
        }],

        // 病历文件
        documents: [{
            _id: false,
            documentName: String,
            url: String,    // 老的数据结构，e.g. http://zlzhidao-resource.oss-cn-shenzhen.aliyuncs.com/user_file/1532202243220RKWQE7A72WT3NEKF.xlsx
            ossFileKey:String,  // 新的数据结构，e.g. user_file/1532202243220RKWQE7A72WT3NEKF.xlsx
            documentType: String,
            institution: String,
            providerName: String,
            visitDate: Date,
            comments: String,
            documentId: String,
            translationFiles:[{
                _id:false,
                documentName: String,
                url: String,
            }] //url
        }],

        // 病历文件
        dicomFiles: [{
            _id: false,
            accessionNumber: String,
            documentName: String,
            documentType: String,
            institution: String,
            providerName: String,
            visitDate: Date,
            comments: String,
            documentId: String,
        }],

    };

    medicalRecord.en = {};

    const options = {
        usePushEach: true,
        timestamps: true,
    };

    const MedicalRecordSchema = new mongoose.Schema(medicalRecord, options);

    /*  暂时关闭加密功能
    const encKey = app.config.encryptionKey;
    const sigKey = app.config.signingKey;
    MedicalRecordSchema.plugin(encrypt, {
        encryptionKey: encKey,
        signingKey: sigKey,
        excludeFromEncryption: [
            'openid',
            'userid',
            'driver_id',
            'pre_activation_collection_status',
            'driver_status',
            'wx_unionid',
            'wx_openid',
            'wx_name',
            'gov_id',
            'order_id',
            'patientName',
            'createTime',
            'updateTime',
            'presentDiagnosis.cancerType',
            'patientBirthday',
            'dicomFiles',
        ]
    });
    */

    return conn27017.model('MedicalRecord', MedicalRecordSchema, 'medical_record');
};