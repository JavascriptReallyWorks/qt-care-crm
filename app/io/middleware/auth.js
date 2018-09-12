module.exports = app => {

    return async (ctx, next) => {

        if(ctx.session.passport && ctx.session.passport.user.user_type ==='crm') {
            await next();
        }
        else{
            ctx.socket.disconnect();
        }

        // execute when disconnect.
        await ctx.service.socketService.userDisconnect(ctx.session.passport.user._id, ctx.socket.id);
    };
};

