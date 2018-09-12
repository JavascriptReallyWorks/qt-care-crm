/**
 * Created by Yang1 on 5/1/17.
 */

module.exports = app => {
    class User extends app.Service {
        async findAuthUser(username,password) {
            var user = await  this.ctx.model.User.findOne({name:username, pass:password},{pass:0});
            return user;
        }

        async getAuthUserMenu(roles) {
            var menuMap = {};
            for(var i=0; i<roles.length; i++){
                var roleName = roles[i];
                var role = await  this.ctx.model.Role.findOne({name:roleName});

                for(var j=0; j<role.menu.length; j++){
                    var item = role.menu[j];
                    menuMap[item.url] = item.name;

                }
            }
            var menu =[];
            for(var i in menuMap){
                menu.push({
                    url:i,
                    name:menuMap[i]
                });
            }
            return menu;
        }

        queryOneUserByOpenId(openid, cb) {
            this.ctx.model.User.findOne({openid:openid},function (err, user) {
                cb(user);
            })
        }
    }
    return User;
};
