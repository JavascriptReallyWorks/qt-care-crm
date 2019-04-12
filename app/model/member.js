
module.exports = app => {
  const mongoose = app.mongoose;
  const conn27017 = app.mongooseDB.get('db27017');
  const MemberSchema = new mongoose.Schema({
    member_id:{ type: Number, index:true, required:true, unique:true},
    member_type:{   // 会员类型 10-qtc, 20-保险
      type:Number,
      enum:[10,20],
    },

    orders:{
      type:[{
        _id:false,
        order_id:{ type: String}, // 保单号
        order_status:{   // 状态，是否有效， 1-有效, 4-失效, 其他
          type:Number,
          enum:[1,4],
        },
        insurance_name:String, //险种名称
        insurance_start_date:String, //保单生效日期
        insurance_end_date:String, //保单终止日期
      }],
      default:[],
    },

    code:Number, //编码
    name:String,
    gender:{  //性别, 0-男, 1-女
      type:Number,
      enum:[0,1],
    },
    id_type:String,
    id_number:{type:String,index:true},
    birth:String,
    age:Number,
    phone:{type:String,index:true},
    email:String,
    order_address:String,
    address:{
      city:String,
      detail:String,
      district:String,
      province:String,
    },

    name_contact_1:String,
    relation_contact_1:String,
    phone_contact_1:String,
    email_contact_1:String,

    name_contact_2:String,
    relation_contact_2:String,
    phone_contact_2:String,
    email_contact_2:String,
  },{
    timestamps: true,
  });

  const MemberModel = conn27017.model('Member', MemberSchema, 'members');
  MemberModel.on("index", function(error) {
    if (error) {
      app.error(
        "model.Member indexing error",
        JSON.stringify(error, null, 4)
      );
    }
  });
  return MemberModel;
}