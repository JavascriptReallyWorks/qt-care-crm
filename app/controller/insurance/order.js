
module.exports = app => {
    class InsuranceOrder extends app.Controller {
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


        async getUserOrders(){
          const {ctx} = this;
          try{
            const {insuredPhone} = ctx.state.token;
            let orders = await ctx.model.Order.find({insuredPhone},{
              _id:0,
              orderId:1, 
              type:1,
              insuredName:1,
              insuredSex:1,
              insuredPhone:1,
              insuredIdNumber:1,
              insuredBirth:1,
              insuredEmail:1
            }).lean();

            this.httpSuccess(orders.map(order => ({
              type:order.type,
              id:order.orderId,   //member.html 跳转页面
              number:order.orderId, //member.html 显示 NO.
              payload:[
                {display:'被保险人', value: order.insuredName},
                {display:'被保人性别', value: order.insuredSex === 0 ? "男":(order.insuredSex === 1 ? "女" : "")},
                {display:'被保人手机号', value:order.insuredPhone},

                {display:'证件号码', value:order.insuredIdNumber},
                {display:'被保人出生日期', value:order.insuredBirth ? order.insuredBirth.toISOString().split('T')[0]:''},
                {display:'被保人邮箱', value:order.insuredEmail},
              ],
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
              const {insuredPhone} = ctx.state.token;
              const order = await ctx.model.Order.findOne({insuredPhone, orderId:id}).lean();
              if(order){
                const data = {
                  id:order.orderId,
                  orderId:order.orderId,
                  number:order.orderId,
                  type:order.type,
                  orderStatus:order.orderStatus,
                  payload: [
                    {display:'投保人', value:order.applicantName},
                    {display:'被保险人', value: order.insuredName},
                    {display:'被保人证件类型', value:order.insuredIdType},
                    {display:'证件号码', value:order.insuredIdNumber},
                    {display:'被保人性别', value: order.insuredSex === 0 ? "男":(order.insuredSex === 1 ? "女" : "")},
                    {display:'被保人出生日期', value:order.insuredBirth ? order.insuredBirth.toISOString().split('T')[0]:''},
                    {display:'被保人手机号', value:order.insuredPhone},
                    {display:'保险额度', value:`¥${order.insuranceAmount}`},
                    {display:'保险期间', value:order.insurancePeriod},
                    {display:'缴费年限', value:order.paymentPeriod},
                    {display:'投保日期', value:order.insuranceApplyDate ? order.insuranceApplyDate.toISOString().split('T')[0]:''},
                    {display:'保单生效日期', value:order.insuranceStartDate ? order.insuranceStartDate.toISOString().split('T')[0]:''},
                    {display:'保单有效日期', value:order.insuranceEndDate ? order.insuranceEndDate.toISOString().split('T')[0]:''},
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

