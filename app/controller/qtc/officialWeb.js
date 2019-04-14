const Config = require('../../../config/config.json');

module.exports = app => {
    class QtcOfficialWeb extends app.Controller {

        async login() {
          const {ctx, service} = this;
            ctx.validate({
                idType:'string',
                idNumber:'string',
                phone:'string',
                code:'string',
            });
            try{
              const idTypeMap = {
                "sfz":"身份证",
                "hz":"护照",
                "csz":"出生证",
                "hkb":"户口本",
              }              
              const {idType, idNumber, phone, code} = this.body;
              IDType = idTypeMap[idType] || "身份证";
              const result = await service.sms.verify(phone, code);
              if (result.success) {
                const cond= {
                  idType,
                  idNumber,
                  phone
                }; 
                const member = await ctx.model.Member.findOne(cond).lean();
                if(member){
                  this.httpSuccess({
                    member,
                    token: app.jwt.sign({ memberId: member.memberId }, app.config.jwt.secret),
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
              ctx.error('InsuranceOrder show error', err);
              this.httpFail({
                errCode: 10,
                err: 'Code does not match or expired.',
              });
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

        async jdy(){
          const {ctx, service} = this;
          ctx.error('jdy data: ', JSON.stringify(this.body, null, 4));
          try{
            const {data, op} = this.body;
            const {APP, ENTRY} = app.CONSTANT.JDY;
            switch(data.appId){
              case APP.CUSROMER_SERVICE_MANAGE.APP_ID:  

                switch(data.entryId){
                  case ENTRY.MEMBERSHIP.ENTRY_ID: 
                    await service.member.jdyNotif(this.body);
                    break;

                  case ENTRY.ORDER.ENTRY_ID:
                    await service.order.jdyNotif(this.body);
                    break;

                }
                break;
            }
            ctx.body = 'success';
          }
          catch(err){
            ctx.error('jdy error: ', err);
          }
        }

        async jdyTest(){
          const {ctx} = this;
          ctx.error('jdyTest data: ', JSON.stringify(this.body, null, 4));
          ctx.body = 'success';
        }

    }
    return QtcOfficialWeb;
};
