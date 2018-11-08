
module.exports = app => {
  const mongoose = app.mongoose;
  const conn27017 = app.mongooseDB.get('db27017');
  const OrderSchema = new mongoose.Schema({
    orderId:{ type: String, required:true, unique:true}, // 保单号
    type:{ type: String, required:true},  // "FUXING"
    orderStatus:Number, // 状态，是否有效， 1-有效, 4-失效, 其他
    importDate:String,  // 导入日期 e.g. '2018-11-08'

    insuranceName:String, //险种名称
    insuranceApplyDate:Date, //投保日期
    insuranceStartDate:Date, //保单生效日期
    insuranceEndDate:Date, //保单终止日期
    insuranceAmount:Number, // 保额  
    insurancePeriod:String, //保险期间

    paymentPeriod:String, //缴费期限
    paymentFrequency:String,  // 缴费频次
    paymentEachTime:Number, //期缴保费
    paymentMethod:String, // 缴费方式

    
    applicantName:{ type: String, required:true}, // 投保人姓名
    applicantPhone:{ type: String, required:true},    // 投保人手机号码
    applicantEmail:String, //投保人EMAIL
    applicantIdType:String, //投保人证件类型
    applicantIdNumber:String, // 投保人证件号码
    applicantSex:Number,  //投保人性别, 0-男, 1-女
    applicantBirth:Date,  //投保人出生日期
    applicantHeight:String, //投保人身高
    applicantWeight:String, //投保人体重
    applicantAddress:String, //投保人家庭地址
    applicantZipCode:String, // 投保人邮编
    applicantJobCode:String, // 投保人职业代码

    insuredName:{ type: String, required:true}, // 受保人姓名
    insuredPhone:{ type: String},    // 受保人手机号码
    insuredEmail:String, //受保人EMAIL
    insuredIdType:String, //受保人证件类型
    insuredIdNumber:String, // 受保人证件号码
    insuredSex:Number,  //受保人性别, 0-男, 1-女
    insuredBirth:Date,  //受保人出生日期
    insuredHeight:String, //受保人身高
    insuredWeight:String, //受保人体重
    insuredAddress:String, //受保人家庭地址
    insuredZipCode:String, // 受保人邮编
    insuredJobCode:String, // 受保人职业代码
    
    insuredApplicantRelation:String, // 被保险人与投保人的关系
    insuredHealthInfo:String, // 被保险人健康告知
    
    // qtc fields
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


  },{
    timestamps: true,
  });

  return conn27017.model('Order', OrderSchema, 'orders');
}