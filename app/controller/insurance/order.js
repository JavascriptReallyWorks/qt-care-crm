
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
            };
            const orders = await Promise.all(member.orders.map(order => ctx.model.Order.findOne({order_id:order.order_id}, include).lean()));

            this.httpSuccess(orders.map(order => ({
              ...order,
              type:'FUXING',  //为了拼接成文件名找到卡片图片
              id:order.order_id,   //member.html 跳转页面
              number:order.order_id, //member.html 显示 NO.
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
                const data = {
                  ...order,
                  id:order.order_id,
                  // number:order.orderId,
                  type:'FUXING',
                  payload: [
                    {display:'投保人', value:order.applicant_name},
                    {display:'被保险人', value: order.insured_name},
                    {display:'被保人证件类型', value:order.insured_id_type},
                    {display:'证件号码', value:order.insured_id_number},
                    {display:'被保人性别', value: order.insured_gender},
                    {display:'被保人出生日期', value:order.insured_birth},
                    {display:'被保人手机号', value:order.insured_phone},
                    {display:'保险额度', value:`¥${order.insurance_amount}`},
                    {display:'保险期间', value:order.insurance_period},
                    {display:'缴费年限', value:order.payment_period},
                    {display:'投保日期', value:order.insurance_apply_date},
                    {display:'保单生效日期', value:order.insurance_start_date},
                    {display:'保单有效日期', value:order.insurance_end_date},
                    {display:'保险热线', value:'4008629999'},
                  ],
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

