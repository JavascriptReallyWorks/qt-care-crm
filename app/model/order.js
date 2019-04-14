
module.exports = app => {
  const mongoose = app.mongoose;
  const conn27017 = app.mongooseDB.get('db27017');
  const OrderSchema = new mongoose.Schema({
    order_id:{ type: String, index:true, required:true, unique:true}, // 保单号
    order_status:{
      type:Number,
      enum:[1,4],
    }, // 状态，是否有效， 1-有效, 4-失效, 其他
    spent_total:{type:Number, default:0},  //总花费
    remain_total:{type:Number, default:6000000},   //余额

    insurance_name:String, //险种名称
    insurance_apply_date:String, //投保日期
    insurance_start_date:String, //保单生效日期
    insurance_end_date:String, //保单终止日期
    insurance_amount:Number, //保险金额（人民币：元）  
    insurance_period:String, //保险期间

    payment_period:String, //缴费期限
    payment_frequency:String,  // 缴费频次
    payment_single:Number, //期缴保费
    payment_method:String, // 缴费方式

    
    applicant_name:String, // 投保人姓名
    applicant_phone:String,    // 投保人手机号码
    applicant_email:String, //投保人EMAIL
    applicant_id_type:String, //投保人证件类型
    applicant_id_number:String, // 投保人证件号码
    applicant_gender:{  //投保人性别, 0-男, 1-女
      type:String,
      enum:['男','女'],
    },
    applicant_birth:String,  //投保人出生日期
    applicant_height:Number, //投保人身高
    applicant_weight:Number, //投保人体重
    applicant_address:String, //投保人家庭地址
    applicant_zip_code:String, // 投保人邮编
    applicant_employer:String, // 投保人工作单位
    applicant_job_content:String, // 投保人工作内容
    applicant_job_code:String, // 投保人工作代码
    applicant_marital_status:String, // 投保人婚姻状况

    insured_name:{ type: String, required:true}, // 受保人姓名
    insured_phone:{ type: String},    // 受保人手机号码
    insured_email:String, //受保人EMAIL
    insured_id_type:String, //受保人证件类型
    insured_id_number:String, // 受保人证件号码
    insured_gender:{  //受保人性别, 0-男, 1-女
      type:String,
      enum:['男','女'],
    },
    insured_birth:String,  //受保人出生日期
    insured_height:Number, //受保人身高
    insured_weight:Number, //受保人体重
    insured_address:String, //受保人家庭地址
    insured_zip_code:String, // 受保人邮编
    insured_employer:String, // 受保人工作单位
    insured_job_content:String, // 受保人工作内容
    insured_job_code:String, // 受保人工作代码
    insured_marital_status:String, // 受保人婚姻状况

    insured_relation:String, // 被保险人与投保人的关系
    insured_health_info:String, // 被保险人健康告知
    
    payments:{
      type:[{
        _id:false,
        payment_date:String, // 日期时间
        payment_type:String, // 项目类型
        payment_name:String, // 项目名称
        payment_amount:{  // 花费数额
          type:Number,
          default:0,
        },
        cancer_nth:Number,  //.第几次癌症及癌前病变
        receipt_uploads:{   //费用凭证上传
          type:[{
            _id:false,
            mime:String,  // e.g. "image/png",
            name:String,  // e.g. "abc.png"
            size:Number,  // file size, e.g. 57306
            url:String,   // file url
          }],
          default:[],
        },
      }],
      default:[],
    },

    services:{
      type:[{
        _id:false,
        service_number:String, // 订单号
        service_name:String, // 服务名称
        start_date:String, // 服务开始时间
        end_date:String, // 服务结束时间
      }],
      default:[],
    },


    /* qtc fields
    orderType:String, // 类型
    orderResale:Boolean, // 保单是否回销
    orderResaleDate:Date, // 回销日期
    quitInCoolingOff:Boolean, // 是否犹豫期退保

    paymentCurrency:String, // 保费币种
    paymentPerYear:String, // 年化保费

    insuranceCode:String, //险种代码
    insuranceRecordDate:Date, //投保单录入日期
    insuranceReviewDate:Date, //核保完成日期
    insuranceSignDate:Date, //签单日期


    institution2:String, // 2级机构
    institution3:String, // 3级机构
    institution4:String, // 4级机构
    departmentInCharge:String, //归属部门

    businessLine:String, //业务线
    channelType:String, //渠道分类
    channelSubType:String, //渠道细类
    channelName:String, //具体渠道名称
    sellerCode:String, //商户代码
    salesman:String, // 归属业务员,
    recorder:String, //录入人员
    reviewer:String, //核保师

    agentName:String, //中介人员姓名
    agentIdNumber:String, //中介人员证件号码
    agentPhone:String, //中介人员手机号
    agentEmployeeId:String, //中介人员工号
    */

  },{
    timestamps: true,
  });

  const OrderModel = conn27017.model('Order', OrderSchema, 'orders');
  OrderModel.on("index", function(error) {
    if (error) {
      app.error(
        "model.Order indexing error",
        JSON.stringify(error, null, 4)
      );
    }
  });
  return OrderModel;
}