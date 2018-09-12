module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const ProductSchema = new mongoose.Schema({
        sid:{type:Number, index:true, unique:true, required:true},
        product_name: {type:String, required:true, unique:true},
        product_type: String,
        product_tag: String,
        unit_price: {type:Number, required:true},
        original_price: Number,
        intro: String,
        content: String,
        case_note: String,
        product_status: Number,
        top:Number,

        product_images: [String],
        subscribe_img: String,
        title_img: String,

        comments:[{
            satisfaction: Number,
            content: String,
            create_userId: String,
            case_id: String,
            create_openid: String,
            create_userName: String,
            create_time: Date,
        }]
    },{
        usePushEach: true,
        timestamps: true,
    });

    return conn27017.model('Product', ProductSchema, 'product');
}