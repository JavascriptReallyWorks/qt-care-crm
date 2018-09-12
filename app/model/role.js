/**
 * Created by Yang1 on 5/1/17.
 */
module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const RoleSchema = new mongoose.Schema({
        name: String,
        display: String,
        user_type: String,
        menu:[{
            name:String,
            url:String
        }],
    });
    return conn27017.model('Role', RoleSchema, 'roles');
}