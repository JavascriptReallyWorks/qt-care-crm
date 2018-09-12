/**
 * Created by Yang1 on 4/28/17.
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const UserSchema = new mongoose.Schema({
        name: { type: String, required: true, index:true, unique:true, sparse: true},
        nickname: String,
        pass: { type: String, required: true},
        openid:  { type: String, index:true},
        roles: [{ type: String }],

        // doctor_portal
        firstName:{ type: String},
        lastName:{ type: String},
        email:{ type: String, unique:true, sparse: true},
        hospital:String,
        specialty:String,


        user_type:{ type: String, index:true},
        crm_role: { type: String, index:true},
        crm_admin: { type: Boolean, default: false },
        headimgurl: String,
        sex: Number,
    },{
       timestamps: true,
    });

    return conn27017.model('User', UserSchema, 'users');
}