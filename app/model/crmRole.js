module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const CrmRoleSchema = new mongoose.Schema({
        name: {type:String, unique:true, required:true},
        display: String,
        replyType: Number,
        menu: [{
            _id:false,
            name: String,
            url: String
        }],
    },{
        usePushEach: true,
        timestamps: true,
    });
    return conn27017.model('CrmRole', CrmRoleSchema, 'crm_role');
}