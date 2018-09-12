'use strict';


module.exports = app => {
    class dicomService extends app.Service {
        async updateAmbraSessionId(){
            return await this.ctx.curl('https://qtclinics.ambrahealth.com/api/v3/session/login', {
                // 必须指定 method，支持 POST，PUT 和 DELETE
                method: 'POST',
                // 不需要设置 contentType，HttpClient 会默认以 application/x-www-form-urlencoded 格式发送请求
                data: {
                    login: "ylei@qtclinics.com",
                    password: "Quantum2017!"
                },
                // 明确告诉 HttpClient 以 JSON 格式处理响应 body
                dataType: 'json',
            });
        }

        async getAmbraSessionId(){
            const {ctx, service} = this;
            let sid = await app.redis.get(app.config.CONSTANT.AMBRA_SID_KEY);
            if(sid && sid.length){
                return sid;
            }
            else{
                const res = await this.updateAmbraSessionId();
                if(res.data && res.data.sid) {
                    await this.setAmbraSessionId(res.data.sid);
                    return res.data.sid;
                }
                else{
                    return '';
                }
            }
        }

        async setAmbraSessionId(sid){
            await app.redis.set(app.config.CONSTANT.AMBRA_SID_KEY, sid)
        }
    }

    return dicomService;
};