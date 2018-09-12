module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const DoctorLoginSchema = new mongoose.Schema({
        username: { type: String, required: true, index:true, unique:true},
        nickname: String,
        password: { type: String, required: true},
        email:{ type: String, required: true, unique:true},
        firstName:{ type: String},
        lastName:{ type: String},
        hospital:String,
        specialty:String,
    },{
        timestamps: true,
    });

    return conn27017.model('DoctorLogin', DoctorLoginSchema, 'doctor_login');
}