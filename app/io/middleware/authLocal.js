module.exports = app => {

    return async (ctx, next) => {

        await next();

        // execute when disconnect.
        let userId = (ctx.session.passport && ctx.session.passport.user) ? ctx.session.passport.user._id : (ctx.session.user ? ctx.session.user._id : '');
        await ctx.service.socketService.userDisconnect(userId, ctx.socket.id);
    };
};

