'use strict';

module.exports = app => {
    class CaseController extends app.Controller {
        async findById(){
            const {ctx} = this;
            let theCase = await ctx.model.Case.findById(ctx.params._id);
            this.checkAndRespond(theCase);
        }

        // update(with _id) & create(no _id)
        async updateCase(){
            const {ctx} = this;
            let bodyRule = {
                caseData:'object',
            };
            ctx.validate(bodyRule, this.req.body);
            let {_id,caseData} = this.req.body;
            try{
                if(!_id) {
                    _id = app.mongoose.Types.ObjectId();     //create
                    caseData.sid = await ctx.helper.getNextSid('case');
                    caseData.createUser = {
                        _id:ctx.user._id.toString(),
                        name:ctx.user.name,
                        nickname:ctx.user.nickname,
                        email:ctx.user.email,
                    };
                }
                let theCase = await app.model.Case.findOneAndUpdate({_id}, {
                    $set: caseData
                }, {
                    upsert: true,
                    new: true
                });
                theCase && this.checkStatusAndRespond({status: 'ok'});
            }
            catch (err){
                throw err;
            }
        }

        async deleteCase(){
            const {ctx} = this;
            let bodyRule = {
                _id:'string'
            };
            ctx.validate(bodyRule, this.req.body);
            const {_id} = this.req.body;

            try{
                let theCase = await app.model.Case.findByIdAndRemove(_id);
                theCase && this.checkStatusAndRespond({status:'ok'});
            }
            catch (err){
                throw err;
            }
        }

        async createCaseFromMD(){
            const {ctx, service} = this;
            let bodyRule = {
                mdId:'string',
                productId:'string',
            };
            ctx.validate(bodyRule, this.req.body);
            try{
                const {mdId, productId} = this.req.body;
                let md = await ctx.model.MedicalRecord.findById(mdId);
                let product = await ctx.model.Product.findById(productId);
                let wechatConversation = await ctx.model.WechatConversation.findOne({clientId: md.openid});

                let caseData = {
                    sid:await ctx.helper.getNextSid('case'),
                    from: 'CRM',
                    status: app.config.CONSTANT.CASE.STATUS.TO_PAY,
                    medical_record_id: md._id,
                    patientName: md.patientName,
                    patientMobile: md.patientMobile,
                    patientGender: md.patientGender,
                    patientBirthday:md.patientBirthday,
                    cancerType: md.presentDiagnosis.cancerType,
                    stage:md.presentDiagnosis.stage,
                };
                if(wechatConversation){
                    caseData.openid = wechatConversation.clientId;
                    caseData.userid = wechatConversation.clientId;
                    caseData.userName = wechatConversation.clientName;
                }

                caseData.createUser = {
                    _id:ctx.user._id.toString(),
                    name:ctx.user.name,
                    nickname:ctx.user.nickname,
                    email:ctx.user.email,
                };

                caseData.product = {
                    _id:product._id.toString(),
                    sid:product.sid,
                    product_name:product.product_name,
                    unit_price:product.unit_price,
                };
                let insertCase = new this.ctx.model.Case(caseData);
                let caseResult = await insertCase.save();
                if(caseResult)
                    this.checkStatusAndRespond({status:'ok'});
                else
                    this.checkStatusAndRespond({status:'no'});
            }
            catch(err){
                throw err;
            }
        }


        async queryCases(){
            let cond = this.req.body.cond;
            const condRule = {
                page:'int',
                pageSize:'int'
            };
            // 校验参数
            this.ctx.validate(condRule, cond);

            let page = cond.page;
            let limit = cond.pageSize;
            delete cond.page;
            delete cond.pageSize;

            cond.sid && (cond.$where = `/${cond.sid}/.test(this.sid)`);    // $where: "/^123.*/.test(this.example)"
            delete cond.sid;
            cond.patientName && (cond.$or = [       // from:"CRM" => patientName, from:"WECHAT" => medical_record_patient_name
                {
                    patientName:new RegExp(cond.patientName, "ig")
                },
                {
                    medical_record_patient_name:new RegExp(cond.patientName, "ig")
                },
            ]);
            delete cond.patientName;

            // 如果没有status，说明query所有case，过滤掉已取消的
            if(!cond.status){
                cond.status = {$ne:app.config.CONSTANT.CASE.STATUS.CANCELLED};
            }

            let data = await  this.csService.queryCases(cond,page,limit);
            this.checkAndRespond(data);
        }

        async changeCaseStatus(){
            const rule = {
                case_id:'string',
                status:'int'
            };
            this.ctx.validate(rule);

            const {case_id, status}  = this.req.body;
            let data = await  this.ctx.model.Case.findByIdAndUpdate(case_id,{$set:{status:status}},{new:true});
            if(data.status === status){
                this.checkStatusAndRespond({status:'ok'});
                if(status >= app.config.CONSTANT.CASE.STATUS.CASE_TO_US_CS) {
                    await this.ctx.service.emailService.caseStatusNotification(data.sid, status, this.user);
                }
            }
            else
                this.checkStatusAndRespond({status:'no'});
        }

        async changeCaseMRStatus(){
            const rule = {
                case_id:'string',
                status:'int'
            };
            this.ctx.validate(rule);
            const {case_id, status}  = this.req.body;
            let data = await  this.ctx.model.Case.findByIdAndUpdate(case_id, {
                $set: {mr_status: status}
            }, {
                new: true
            });
            if(data.mr_status === status)
                this.checkStatusAndRespond({status:'ok'});
            else
                this.checkStatusAndRespond({status:'no'});

            //TODO: 给用户发送信息 zlzhidao: conversation.sendTemplateMessage

        }

        async pushLogWithCase(){
            let case_id = this.req.body.case_id;
            let log = this.req.body.log;
            this.ctx.validate({
                case_id:'string'
            });
            const logRule = {
                title:'string',
            };
            this.ctx.validate(logRule, log);

            log.create_time = Date.now();
            log.create_user_id = this.user._id.toString();
            log.create_user = this.user.nickname || this.user.name;
            let data = await  this.ctx.model.Case.findByIdAndUpdate(case_id,{$push:{logs:log}},{new:true});
            if(data)
                this.checkStatusAndRespond({status:'ok'});
        }

        async queryLogByCase(){
            this.ctx.validate({
                id:'string'
            });
            let id = this.req.body.id;
            let data = await  this.ctx.model.Case.findById(id,{logs:1});
            this.checkAndRespond(data);

        }


        async saveAndUpdateTicket(){
            let ticket = this.req.body.ticket;
            let case_id = this.req.body.case_id;

            if (ticket.new) {
                ticket.create_time = new Date().getTime();
                let data = await  this.ctx.model.Case.findByIdAndUpdate(case_id, {$push: {tickets: ticket}}, {
                    upsert: true,
                    new: false
                });
                this.checkAndRespond(data);
            } else {
                let data = await  this.ctx.model.Case.update({
                    'tickets._id': ticket._id
                }, {$set: {
                    "tickets.$": ticket
                }});
                this.checkAndRespond(data);
            }

        }

        async changeDriverStatus(){
            const rule = {
                case_id:'string',
                status:'int'
            };
            this.ctx.validate(rule);

            const {case_id, status}  = this.req.body;
            let data = await  this.ctx.model.Case.findByIdAndUpdate(case_id,{$set:{pre_activation_collection_status:status}},{new:true});
            if(data.status === status){
                //TODO 通知Driver
                this.checkStatusAndRespond({status:'ok'});
            }
            else
                this.checkStatusAndRespond({status:'no'});
        }

        async createCaseFromWechat(){
            const {ctx} = this;
            let caseData = this.req.body.case;
            caseData.sid = await ctx.helper.getNextSid('case');
            caseData.from = 'WECHAT';   //微信表格提交, 区分CRM上创建的case
            let newCase = new ctx.model.Case(caseData);
            let res = await newCase.save();
            if (res)
                this.checkStatusAndRespond({ status: 'ok' });
            else
                this.checkStatusAndRespond({ status: 'no' });
        }

    }
    return CaseController;
};

