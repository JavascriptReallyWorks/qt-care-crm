module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    let ObjectId = mongoose.Schema.ObjectId;
    const CaseSchema = new mongoose.Schema({
        sid:{type:Number, index:true, unique:true, required:true},
        medical_record_id: {type:String, index:true},
        userid: String,
        openid: String,
        from:{type:String, index:true, required:true, enum: ['WECHAT', 'CRM']},  // "WECHAT"(微信表格提交) or "CRM"(CRM后台创建)
        status: {type:Number, required:true},

        createUser:{
            _id:String,
            name:String,
            nickname:String,
            email:String,
        },

        // csUsers:[{
        //     _id:String,
        //     name:String,
        //     nickname:String,
        //     email:String,
        // }],

        // 联系人
        user_name: String,  // WECHAT
        userName:String,    // CRM

        // 患者
        patient_name:String,    // WECHAT
        patientName:String,     // CRM
        patientGender:String,   // md.patientGender
        patientBirthday: Date,  // md.patientBirthday
        cancerType:String,      // md.presentDiagnosis.cancerType
        stage:String,           // md.presentDiagnosis.stage

        // 电话
        patient_mobile: String, // WECHAT
        patientMobile:String,   // CRM

        medical_record_patient_name: String,    // WECHAT

        patient_identity: String,           //WECHAT
        patient_identity_other: String,     //WECHAT

        product:{},    // model.Product,   CRM
        products: {},   // [model.Product in zlzhidao's 27017], WECHAT

        // 指派医生
        doctor:{},

        // 会诊链接
        videoLink:String,

        mr_status: Number,
        note:String,

        // TODO: delete after new caseTicket works
        tickets: [{
            _id: false,
            title: String,
            content: String,
            feedback: String,
            create_time: Number,
            status: String
        }],


    },{
        timestamps: true,
    });

    return conn27017.model('Case', CaseSchema, 'case');
}