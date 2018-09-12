'use strict';
const crypto = require('crypto');

module.exports = app => {
    class UserController extends app.Controller {

        async curUser() {
            this.checkAndRespond(this.user);
        }

        async findAllUserByRoles() {
            const rule = {
                roles: 'array',
            };
            this.ctx.validate(rule);
            let roles = this.req.body.roles;
            let data = await  this.ctx.model.User.find({ roles: { $in: roles } }, { _id: 1, openid: 1, name: 1, nickname: 1, user_name: 1 });
            this.checkAndRespond(data);
        }

        async findCrmUserMap() {
            let data = await  this.ctx.model.User.aggregate([{ $match: { $and: [{ crm_role: { $exists: true } }, { crm_role: { $ne: 'admin' } }] } }, {
                $group: {
                    _id: "$crm_role",
                    users: { $push: { name: '$name', nickname: '$nickname', userid: '$_id' } }
                }
            }]);
            this.checkAndRespond(data);
        }

        async qtCsUsers(){
            let data = await this.ctx.model.User.find({
                user_type:'crm',
                crm_role:'qt_cs',
            }, {
                name:1,
                nickname:1,
                email:1,
            }).lean();
            this.checkAndRespond(data);
        }

        async updateUser() {
            let user = this.req.body.user;
            let id = this.req.body.id;

            if (user.pass) {
                let hash = crypto.createHash("sha1");
                hash.update(user.pass);
                user.pass = hash.digest('hex');
            }

            let data = await  this.ctx.model.User.update({ _id: id }, { $set: user });
            this.checkAndRespond(data);
        }

        async createUser() {
            let user = this.req.body.user;
            if (!user.pass) {
                user.pass = app.config.CONSTANT.INITPASS;
            }
            let hash = crypto.createHash("sha1");
            hash.update(user.pass);
            user.pass = hash.digest('hex');

            user.user_type = 'crm';
            user.createdAt = Date.now();
            let userData = new this.ctx.model.User(user);
            let data = await  userData.save();
            this.checkAndRespond(data);
        }

        async queryUsers() {

            let page = this.req.body.page || 1;
            let limit = this.req.body.pageSize || 10;
            let cond = this.req.body.cond;

            let count = await  this.ctx.model.User.count(cond);
            if (count < limit * (page - 1)) page = 1;
            let sorting = {crm_admin:-1, createdAt:-1};
            let docs = await  this.ctx.model.User.find({user_type: "crm"}, {
                name: 1,
                email: 1,
                nickname: 1,
                crm_role: 1,
                crm_admin: 1
            }).sort(sorting).skip(limit * (page - 1)).limit(limit);


            if (docs)
                this.checkAndRespond({ rows: docs, total: count });
            else
                this.checkAndRespond({ rows: [], total: 0 });
        }

        async queryAllRoles() {
            let data = await  this.ctx.model.CrmRole.find({}, { _id: 1, name: 1, display: 1 });
            this.checkAndRespond(data);
        }


        async resetUserPass() {
            let id = this.req.body.id;
            let hash = crypto.createHash("sha1");
            hash.update(app.config.CONSTANT.INITPASS);
            let pass = hash.digest('hex');
            let data = await  this.ctx.model.User.findByIdAndUpdate(id, {
                $set: {
                    pass: pass
                }
            });
            this.checkAndRespond(data);
        }

        //修改用户前验证密码

        async checkUserPass() {
            let user = this.req.body.user;
            const userRule = {
                name: "string",

                pass: "string"
            };

            this.ctx.validate(userRule, user);

            let hash = crypto.createHash("sha1");
            hash.update(user.pass);
            user.pass = hash.digest('hex');

            // 校验参数

            let data = await  this.ctx.model.User.find({ name: user.name, pass: user.pass });
            this.checkAndRespond(data);

        }


        async removeUser() {
            let id = this.req.body.id;
            if (id) {
                let data = await  this.ctx.model.User.remove({ _id: id });
                this.checkAndRespond(data);
            }
        }

        async queryWechatUsers(){
            let name = this.req.body.name;
            let limit = this.req.body.pageSize;
            let data = await this.ctx.model.User.find({openid:{$exists:true}, nickname:new RegExp(name, "ig")},{openid:1,nickname:1}).limit(limit);
            this.checkAndRespond(data);
        }

        checkData(result) {
            if (result.status !== 200) {
                const errorMsg = result.data && result.data.error_msg ? result.data.error_msg : 'unknown error';
                return {}
            }
            if (!result.data.success) {
                // 远程调用返回格式错误
                this.ctx.throw(500, 'remote response error', { data: result.data });
            }
        }




    }
    return UserController;
};