const ONE_DAY = 24*60*60*1000;

module.exports = app => {
    class InsuranceOrder extends app.Controller {
        /*
        async show() {
            const {ctx} = this;
            ctx.validate({
                IDType:'string',
                IDNumber:'string',
                mobile:'string',
                verifyCode:'string',
            }, ctx.query);

            try{
              const idTypeMap = {
                "1":"身份证"
              }              
              let {IDType, IDNumber, mobile, verifyCode} = ctx.query;
              IDType = idTypeMap[IDType] || '';
              const result = await this.ctx.service.sms.verify(mobile, verifyCode);
              if (result.success) {
                const cond= {
                  insuredIdType:IDType,
                  insuredIdNumber:IDNumber,
                  insuredPhone:mobile,
                } 
                const order = await ctx.model.Order.findOne(cond).lean();
                if(order){
                  this.httpSuccess({
                    token: app.jwt.sign({ insuredPhone: order.insuredPhone }, app.config.jwt.secret),
                    insuredName:order.insuredName,
                  });
                }
                else{
                  this.httpFail({
                    errCode: 20,
                    err: 'Order does not exist.',
                  });
                }
              }
              else{
                this.httpFail({
                  errCode: 10,
                  err: 'Code does not match or expired.',
                });
              }
            }
            catch(e){
              this.httpFail({
                errCode: 10,
                err: 'Code does not match or expired.',
              });
              ctx.error('InsuranceOrder show error', err);
            }
        }
        */

        async getUserOrders(){
          const {ctx} = this;
          try{
            const {member_id} = ctx.state.token;
            const member = await ctx.model.Member.findOne({member_id}).lean();
            const include = {
              order_id:1,
              insurance_amount:1,
              insurance_name:1,
              insurance_start_date:1,
            };
            const orders = await Promise.all(member.orders.map(order => ctx.model.Order.findOne({order_id:order.order_id}, include).lean()));

            this.httpSuccess(orders.map(order => ({
              ...order,
              id:order.order_id,   //member.html 跳转页面
              number:order.order_id, //member.html 显示 NO.
              insurance_convered_dates: Math.round(Math.abs(((new Date()).getTime() - (new Date(order.insurance_start_date || "2019-01-01")).getTime())/(ONE_DAY)))
            })));
          }
          catch(e){
            this.httpFail(e);
            ctx.error('InsuranceOrder getUserOrders error', e);
          }
        }

        async getOrderById(){
            const {ctx} = this;
            ctx.validate({
                id:'string',
            }, ctx.params);

            try{
              const {id} = ctx.params;
              const order = await ctx.model.Order.findOne({order_id:id}).lean();
              if(order){
                let data = {
                  ...order,
                  id:order.order_id,
                  // number:order.orderId,
                  type:'FUXING',
                  payload: [
                    {display:'投保人', value:order.applicant_name},
                    {display:'被保险人', value: order.insured_name},
                    {display:'被保险人证件类型', value:order.insured_id_type},
                    {display:'证件号码', value:order.insured_id_number},
                    {display:'被保险人性别', value: order.insured_gender},
                    {display:'被保险人出生日期', value:order.insured_birth},
                    {display:'被保险人手机号', value:order.insured_phone},
                    {display:'保险额度', value:`¥${order.insurance_amount}`},
                    {display:'保险期间', value:order.insurance_period},
                    {display:'缴费年限', value:order.payment_period},
                    {display:'投保日期', value:order.insurance_apply_date},
                    {display:'保单生效日期', value:order.insurance_start_date},
                    {display:'保单有效日期', value:order.insurance_end_date},
                    // {display:'服务热线', value:'4008629999'},
                  ],
                };
                const {INSURANCE_SERVICE} = app.CONSTANT.JDY;
                if(order.insurance_name && INSURANCE_SERVICE[order.insurance_name]){
                  let serviceInfo = [...INSURANCE_SERVICE[order.insurance_name]];
                  let serviceOrders = await ctx.model.ServiceOrder.find({order_id:order.order_id}).lean();
                  serviceOrders.forEach(serviceOrder => {
                    const {service_name} = serviceOrder
                    if(service_name){
                      const idx = serviceInfo.findIndex(service => service.SERVICE_NAME === service_name);
                      if(idx >= 0){
                        if(!serviceInfo[idx].serviceOrders){
                          serviceInfo[idx].serviceOrders = [];
                        } 
                        serviceInfo[idx].serviceOrders.push({
                          ...serviceOrder,
                          last_event_status:(serviceOrder.service_events && serviceOrder.service_events.length) ? serviceOrder.service_events[serviceOrder.service_events.length - 1].event_status : undefined, 
                        });
                      }
                    }
                  });
                  // serviceInfo = serviceInfo.map(service => ({
                  //   ...service,
                  //   SERVICE_NAME:`${service.SERVICE_NAME}${service.serviceOrders ? (' [' + service.serviceOrders.length + ']') :''}`
                  // }));
                  for(let i=0; i<serviceInfo.length; i++){
                    let service = serviceInfo[i];
                    if(service.serviceOrders){
                      service.firstHasOrders = true;
                      break;
                    }
                  }
                  data.serviceInfo = serviceInfo
                  // if(data.payments){
                  //   data.payment_total = data.payments.reduce((accumulator, currentValue) => (accumulator + (currentValue.payment_amount || 0)), 0);
                  // }
                  // else{
                  //   data.payment_total = 0;
                  // }
                }

                this.httpSuccess(data);
              }
              else{
                this.httpFail('Order not found.');
              }
            }
            catch(e){
              this.httpFail(e);
              ctx.error('InsuranceOrder getOrderById error', e);
            }
        }
    }
    return InsuranceOrder;
};

