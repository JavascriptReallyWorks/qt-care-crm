
module.exports = app => {
  const mongoose = app.mongoose;
  const conn27017 = app.mongooseDB.get('db27017');
  const ServiceOrderSchema = new mongoose.Schema({
    service_number:{ type: String, index:true, required:true},  //服务订单号码
    service_name: { type: String, index:true, required:true},   //服务名

    appId:String,
    entryId:String,

    member_id: Number, //客户会员号
    order_id: String, //保单号
    mr_id: String, //病历号

    service_events:{  //服务订单状态更新
      type:[{
        _id:false,
        event_status:String,  // 服务状态
        event_status_code:String,   // 服务状态码
        event_note:String,  // 备注说明
        event_date:String,  // 更新日期
      }],
      default:[],
    },
  },{
    timestamps: true,
  });

  const ServiceOrder = conn27017.model('ServiceOrder', ServiceOrderSchema, 'service_orders');
  ServiceOrder.on("index", function(error) {
    if (error) {
      app.error(
        "model.ServiceOrder indexing error",
        JSON.stringify(error, null, 4)
      );
    }
  });
  return ServiceOrder;
}