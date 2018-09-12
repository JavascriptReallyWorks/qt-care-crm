'use strict';

module.exports = app => {
    class PubsubExampleController extends app.Controller {
        *login() {
            let name = this.req.body.name;
            let user = yield this.ctx.model.User.findOne({$or:[{name:name}, {nickname:name}]},{name:1,nickname:1,openid:1, user_type:1, crm_role:1});
            this.ctx.session.user = user;
            this.ctx.body = user;
        }

        *logout() {
            delete this.ctx.session.user;
            this.ctx.redirect('/pubsub/singleChat');
        }

        *getUser() {
            this.ctx.body = this.ctx.session.user;
        }


        * singleChat() {
            yield this.ctx.render('pubsub_example/singleChat.jade');
        }

        * multiChat() {
            yield this.ctx.render('pubsub_example/multiChat.jade');
        }

        async convIdOfUser() {
            let clientId = this.req.body.clientId;
            let conversation = await app.model.WechatConversation.findOne({clientId});
            this.ctx.body = conversation._id;
        }
    }
    return PubsubExampleController;
};