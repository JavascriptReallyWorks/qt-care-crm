const Service = require('egg').Service;
const CODE_DEDUP_IN = 1 * 60; // 1分钟不重复发送，单位是秒
const CODE_EXPIRE_IN = 15 * 60; // 15分钟内有效，单位是秒

class Sms extends Service {
    async send(phone, tplCode = 'SMS_27750026', signName = 'QTC健康', param = { product: 'QTC健康' }) {
        try {
            const dedupKey = `AZ-${phone}`;
            // 避免重复发送, 阿里云要求：同一个签名，同一个手机号码频率限制：1条/分钟，5条/小时，10条/天
            if (await this.app.redis.get(dedupKey)) {
                // return { status: 'sent_already', msg: `已在${CODE_DEDUP_IN}秒内发送过，不能再次发送` };
                return { success: false, msg: 'sent_already' };
            }

            const code = this.ctx.helper.randomNumber(4);
            const result = await this.ctx.sms.sendSMS({
                PhoneNumbers: phone,
                SignName: signName,
                TemplateCode: tplCode,
                // TemplateParam: `{"code": "${code}", "product": "${product}"}`,
                TemplateParam: JSON.stringify({
                    ...param,
                    code,
                }),
            });
            if (result.Code !== 'OK') {
                this.ctx.logger.error(`send sms failed => phone=${phone}, code=${code}, result=${JSON.stringify(result)}`);
                return { success: false, msg: 'send_error' };
            }
            await Promise.all([
                // 标识已发过，1分钟后才你能再次发送
                this.app.redis.setex(dedupKey, CODE_DEDUP_IN, code),
                // 标识已发过，15分钟后过期，15分钟内可以用这个值验证用户输入的正确性
                this.app.redis.setex(phone, CODE_EXPIRE_IN, code),
            ]);
            return { success: true };
        } catch (err) {
            this.ctx.logger.error(`send sms failed => phone=${phone}, error=${err.message} stack=${err.stack}`);
            return { success: false, msg: 'send_error' };
        }
    }

    async verify(phone, code) {
        const cachedCode = await this.app.redis.get(phone);
        if (!cachedCode) { // 过期
            return { success: false, msg: 'expired' };
        } else if (cachedCode && cachedCode !== code) { // 不匹配
            return { success: false, msg: 'not match' };
        } else if (cachedCode === code) {
            // 验证成功后删除，避免被别人再次使用
            await this.app.redis.del(phone);
            return { success: true };
        }
        return { success: false, msg: 'fail' };
        // return { success: true };
    }

    // 报名成功发送个短信
    async sendSignUp(phone, customer = '测试用户', tplCode = 'SMS_27750027', signName = 'QTC健康') {
        try {
            const result = await this.ctx.sms.sendSMS({
                PhoneNumbers: phone,
                SignName: signName,
                TemplateCode: tplCode,
                TemplateParam: `{"customer": "${customer}"}`,
            });
            if (result.Code !== 'OK') {
                this.ctx.logger.error(`send sms failed => phone=${phone}, customer=${customer}, result=${JSON.stringify(result)}`);
                return { success: false, msg: 'send_error' };
            }
            return { success: true };
        } catch (err) {
            this.ctx.logger.error(`send sms failed => phone=${phone}, error=${err.message} stack=${err.stack}`);
            return { success: false, msg: 'send_error' };
        }
    }
}

module.exports = Sms;
