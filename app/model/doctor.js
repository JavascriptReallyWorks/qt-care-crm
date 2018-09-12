
module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const DoctorSchema = new mongoose.Schema({
        doctor_name: String,
        hospital_name: String,
        status: Number,
        hospi_level: String,
        department: String,
        doctor_title: String,
        doctor_field: String,
        doctor_location: String,
        doctor_web: String,
        doctor_intro: String,
    });
    return conn27017.model('Doctor', DoctorSchema, 'doctors');
};






/*
"doctor_head_image" : "https://v1.zlzhidao.com/img/doctor/59e06e8acc687a1dc6553411.png",
    "doctor_name" : "臧远胜",
    "hospital_name" : "上海长征医院",
    "status" : 200,
    "hospi_level" : "三级甲等",
    "department" : "肿瘤科",
    "doctor_title" : "主任医师",
    "doctor_field" : "肺癌",
    "doctor_location" : "上海",
    "doctor_intro" : "<p>早期肺癌、肠癌、胃癌、乳腺癌、胰腺癌的术前减瘤化疗、术后辅助化疗及康复治疗；进展期肺癌、肠癌、胃癌、乳腺癌、胰腺癌的个体化精准治疗。</p>"

*/