'use strict';

module.exports = app => {
    class CommonExpressionController extends app.Controller {
        async getCommonExpressions(){
            let data = await app.redis.hget(app.config.CONSTANT.REDIS.CS, app.config.CONSTANT.REDIS.CS_COMMON_EXPRESSION);
            if(data)
                this.checkAndRespond(JSON.parse(data));
            else
                this.checkAndRespond(null);
        }

        async setCommonExpressions(){
            const rule = {
                cm:'object',
            };
            this.ctx.validate(rule);
            const {cm} = this.req.body;

            try {
                await app.redis.hset(app.config.CONSTANT.REDIS.CS, app.config.CONSTANT.REDIS.CS_COMMON_EXPRESSION, JSON.stringify(cm));
                this.checkStatusAndRespond({status: 'ok'});
            } catch (err) {
                this.checkStatusAndRespond({status: 'no'});
                throw err;
            }

        }
    }
    return CommonExpressionController;
};
