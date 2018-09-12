module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const CounterSchema = new mongoose.Schema({
        collectionName:{type:String,required:true,unique:true,index:true},
        serialCount:{type:Number,required:true,unique:true,index:true}
    });
    return conn27017.model('Counter', CounterSchema, 'counter');
};
