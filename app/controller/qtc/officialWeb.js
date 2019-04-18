const Config = require('../../../config/config.json');

module.exports = app => {
    class QtcOfficialWeb extends app.Controller {
        
        /*
        * @idType: ["sfz", "hz", "csz", "hkb"] 中之一， 分别对应 身份证，护照，出生证，户口本
        * @phone: 保险会员的话，既可以是受保人电话(Member.phone), 也可以是投保人电话(Member.phone_contact_1)
        */
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
              let {idType, idNumber, phone, code} = this.body;
              idType = idTypeMap[idType] || "身份证";
              const result = await service.sms.verify(phone, code);
              if (result.success) {
                const cond= {
                  id_type:idType,
                  id_number:idNumber,
                  $or:[
                    {phone},
                    {phone_contact_1:phone}
                  ]
                }; 
                const member = await ctx.model.Member.findOne(cond).lean();
                if(member){
                  this.httpSuccess({
                    member,
                    token: app.jwt.sign({ member_id: member.member_id }, app.config.jwt.secret),
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
