const Config = require('../../../config/config.json');

module.exports = app => {
    class QtcOfficialWeb extends app.Controller {

        async login() {
          const {ctx} = this;
          try{
            const bodyRule = {
                phone: 'string',
                code: 'string',
            };
            ctx.validate(bodyRule);
            const { phone, code } = this.body;
            const result = await this.ctx.service.sms.verify(phone, code);
            if (result.success) {
              const cond= {
                applicantPhone:phone,
              } 
              const order = await ctx.model.Order.findOne(cond).lean();
              if(order){
                this.httpSuccess({
                  token: app.jwt.sign({ applicantPhone: order.applicantPhone }, app.config.jwt.secret),
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
          catch(err){
            this.httpFail({
              errCode: 10,
              err: 'Code does not match or expired.',
            });
            ctx.error('QtcOfficialWeb login error', err);
          }
        }

        // 发送短信验证码
        async sendCode() {
          const {ctx} = this;
          try{
            const createRule = {
                phone: 'string',
            };
            this.ctx.validate(createRule, this.ctx.params);
            const { phone } = this.ctx.params;
            const result = await this.ctx.service.sms.send(phone, 'SMS_27750026', 'QTC健康', { product: 'QTC健康' });
            if (result.success) {
                this.httpSuccess();
            } else {
                this.httpFail(result.msg);
            }
          }
          catch(e){
            ctx.error('QtcOfficialWeb sendCode error', e)
          }
        }

    }
    return QtcOfficialWeb;
};
