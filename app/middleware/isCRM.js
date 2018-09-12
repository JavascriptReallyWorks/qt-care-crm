// module.exports = () => {
//     return function*(next) {
//         if (this.user && (this.user.user_type === 'crm')) {
//             yield next;
//         } else {
//             if (this.acceptJSON) {
//                 let msg = 'Forbidden';
//                 this.throw(404, msg);
//             } else {
//                 this.redirect('/login');
//             }
//         }
//     };
// };

const crypto = require('crypto');

module.exports = () => {
    return async function (ctx, next) {
        if (ctx.user && (ctx.user.user_type === 'crm')) {
            await next();
        }
        else if(ctx.headers.internal_http_token){
            let hash = crypto.createHash("sha1");
            hash.update(ctx.app.config.internal_http_token);
            if(ctx.headers.internal_http_token === hash.digest('hex')) {
                await next();
            }
            else{
                if (ctx.acceptJSON) {
                    let msg = 'Forbidden';
                    cxt.throw(404, msg);
                } else {

                    ctx.redirect('/login');
                }
            }
        }
        else {
            if (ctx.acceptJSON) {
                let msg = 'Forbidden';
                cxt.throw(404, msg);
            } else {

                ctx.redirect('/login');
            }
        }

        // const {doctorToken} = ctx.query;
        // if(doctorToken && await ctx.app.redis.get(doctorToken)){
        //     await next();
        // }
        // else{
        //     await ctx.render('noAuth.jade');
        // }
    };
};