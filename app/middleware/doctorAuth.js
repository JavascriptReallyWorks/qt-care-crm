
module.exports = () => {
    return async function (ctx, next) {
        const {doctorToken} = ctx.query;
        if(doctorToken && await ctx.app.redis.get(doctorToken)){
            await next();
        }
        else{
            await ctx.render('noAuth.jade');
        }
    };
};