'use strict';

module.exports = app => {
    class DoctorController extends app.Controller {
        async queryDoctorAbstract(){
            const { ctx } = this;
            const bodyRule = {
                name: 'string'
            };
            ctx.validate(bodyRule);
            let {name,pageSize} = this.body;
            pageSize = pageSize || 20;
            const cond = {
                $or:[
                    {firstName:new RegExp(name,'ig')},
                    {lastName:new RegExp(name,'ig')},
                    {email:new RegExp(name,'ig')},
                ]
            };
            const FIELDS = {
                firstName:1,
                lastName:1,
                email:1,
            };
            let data = await this.ctx.model.DoctorLogin.find(cond, FIELDS).limit(pageSize);
            this.checkAndRespond(data);
        };



    }
    return DoctorController;
};

