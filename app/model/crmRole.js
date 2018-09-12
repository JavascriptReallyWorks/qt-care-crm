module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const CrmRoleSchema = new mongoose.Schema({
        name: String,
        display: String,
        replyType: Number,
        menu: [{
            name: String,
            url: String
        }],
    });
    return conn27017.model('CrmRole', CrmRoleSchema, 'crm_role');
}