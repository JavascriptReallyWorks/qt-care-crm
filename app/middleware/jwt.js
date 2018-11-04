module.exports = () => {
    return async function jwt(ctx, next) {
        const authorization = ctx.get('Authorization').split(' ')[1];
        ctx.state.token = ctx.app.jwt.verify(authorization, ctx.app.config.secret);
        await next();
    };
};
