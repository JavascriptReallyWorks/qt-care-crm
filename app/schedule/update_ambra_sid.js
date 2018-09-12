module.exports = app => {
    return {
        schedule: {
            type: 'worker',
            immediate: true,
            interval: '290m', // session id 3小时失效
            disable: process.env.EGG_SERVER_ENV === 'local', // 本地开发环境不执行
        },
        // task 是真正定时任务执行时被运行的函数，第一个参数是一个匿名的 Context 实例
        async task(ctx) {
            try {
                const res = await ctx.service.dicomService.updateAmbraSessionId();
                if(res.data && res.data.sid) {
                    await ctx.service.dicomService.setAmbraSessionId(res.data.sid);
                }
                else{
                    await ctx.service.dicomService.setAmbraSessionId('');
                }
            } catch(err){
                await ctx.service.dicomService.setAmbraSessionId('');
                throw err;
            }


        }
    };
};
