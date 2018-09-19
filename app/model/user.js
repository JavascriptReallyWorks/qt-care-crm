/**
 * Created by Yang1 on 4/28/17.
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const UserSchema = new mongoose.Schema({
        // basic
        name: { type: String},
        nickname: String,
        pass: { type: String},
        user_type:{ type: String, index:true},

        // crm login
        crm_role: { type: String, index:true},
        crm_admin: { type: Boolean, default: false },
        roles: [{ type: String }],

        // wechat
        openid:  { type: String, index:true},
        headimgurl: String,
        sex: Number,
        wx_unionid:String,
    },{
       timestamps: true,
    });

    return conn27017.model('User', UserSchema, 'users');
}