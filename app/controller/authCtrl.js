const Canvas = require('canvas');
const randtoken = require('rand-token');
const TOKEN_EXPIRE_IN = 24 * 60 * 60; // 24小时有效，单位是秒

module.exports = app => {
    class AuthController extends app.Controller {
        async login() {
            await this.ctx.render('login.jade');
        }

        async changePassword() {
            await this.ctx.render('change_password.jade');
        }

        async newPassword(){
            const {ctx} = this;
            const bodyRule = {
                username: 'string',
                password: 'string',
                code:'string'
            };
            this.ctx.validate(bodyRule);

            try {
                const {username, password, code} = this.body;
                const _username = await app.redis.hget(app.config.CONSTANT.REDIS.CHANGE_PASSWORD_URL_CODE_KEY, code);
                if (username !== _username) {
                    this.failAndRespond({
                        message: 'Username does not match.'
                    })
                }
                else {
                    await ctx.model.User.updateOne({
                        name:username
                    },{
                        $set:{
                            pass:password
                        }
                    })
                    this.checkAndRespond({
                        message: 'Password has been changed'
                    })
                }
            }
            catch(err){
                this.failAndRespond({
                    message: 'Username does not match.'
                })
            }
        }


        async logout() {
            this.ctx.logout();
            this.ctx.redirect('/login');
        }

        async forgetPassword(){
            let {username} = this.req.body;
            let doctor = await this.ctx.model.DoctorLogin.findOne({
                $or: [ {username,}, { email: username } ],
            },{
                username:1,
            }).lean();

            if(doctor) {
                this.checkAndRespond({
                    message: 'Reset password link has been sent to the email'
                })
            }
            else{
                this.failAndRespond({
                    errorCode:10,
                    message: 'User does not exist'
                })
            }
        }

        async doctorLogin(){
            const {ctx} = this;
            const bodyRule = {
                username: 'string',
                password: 'string',
            };
            ctx.validate(bodyRule);

            const username = this.body.username.trim();
            const password = this.body.password.trim();

            try{
                let doctor = await this.ctx.model.DoctorLogin.findOne({
                    $or: [ {username,}, { email: username } ],
                },{
                    username:1,
                    lastName:1,
                    firstName:1,
                    password:1,
                    email:1,
                }).lean();

                if(doctor){
                    if(doctor.password !== password){
                        this.failAndRespond({
                            errorCode:20,
                            message:'Password is not valid'
                        })
                    }
                    else {
                        let token = randtoken.generate(32);
                        await app.redis.setex(token, TOKEN_EXPIRE_IN, JSON.stringify(doctor));
                        delete doctor.password;
                        this.checkAndRespond({
                            doctor,
                            token,
                            message: 'Successfully login'
                        })
                    }
                }
                else{
                    this.failAndRespond({
                        errorCode:10,
                        message:'Username or email does not exist'
                    })
                }
            }
            catch(err){
                throw err;
            }
        }

        async doctorRegister(){
            const {ctx} = this;
            let bodyRule = {
                username:'string',
                password:'string',
                email:'string',
                firstName:'string',
                lastName:'string',
                invitationCode:'string',
            };
            ctx.validate(bodyRule, this.req.body);

            let {
                username,
                password,
                email,
                firstName,
                lastName,
                hospital,
                specialty,
                invitationCode,

            } = this.req.body;

            try{
                let doctor = await this.ctx.model.DoctorLogin.findOne({
                    $or: [ {username}, {email} ],
                },{
                    username:1,
                    email:1,
                }).lean();

                if(doctor){
                    this.failAndRespond({
                        errorCode:10,
                        message:'Username or email already exists'
                    })
                }
                else{
                    let codeMatch = await app.redis.sismember('invitationCode',invitationCode);
                    if(codeMatch){
                        let payload = {
                            username,
                            password,
                            email,
                            firstName,
                            lastName,
                            hospital,
                            specialty,
                        };
                        await ctx.model.DoctorLogin.create(payload);
                        this.checkAndRespond({
                            message:'Successfully register'
                        })
                    }
                    else{
                        this.failAndRespond({
                            errorCode:20,
                            message:'Invatation code does not match'
                        })
                    }
                }
            }
            catch(err){
                throw err;
            }
        }

        async getCaptcha() {
            const canvas = new Canvas(140, 40),
                ctx = canvas.getContext('2d');
            ctx.font = '24px "Microsoft YaHei"';

            // 绘制文本
            let drawText = (text, x) => {
                ctx.save();
                // 旋转角度
                const angle = Math.random() / 10;
                // y 坐标
                const y = 22;
                ctx.rotate(angle);
                ctx.fillText(text, x, y);
                ctx.restore();
            }

            // 随机画线
            let drawLine = () => {
                const num = Math.floor(Math.random() * 3 + 3);
                // 随机画几条彩色线条
                for (let i = 0; i < num; i++) {
                    const color = '#' + (Math.random() * 0xffffff << 0).toString(16);
                    const y1 = Math.random() * 20;
                    const y2 = Math.random() * 40;
                    // 画线
                    ctx.strokeStyle = color;
                    ctx.beginPath();
                    ctx.lineTo(0, y1);
                    ctx.lineTo(140, y2);
                    ctx.stroke();
                }
            };

            // 数字的文本随机从小写汉字、大写汉字、数字里选择
            const numArr = [
                '〇一二三四五六七八九',
                '0123456789',
                '零壹贰叁肆伍陆柒捌玖'
            ];
            // 第一个数字
            const fir = Math.floor(Math.random() * 10);
            // 第二个数字
            const sec = Math.floor(Math.random() * 10);
            // 随机选取运算
            const operArr = ['加', '减', '乘'];
            const oper = Math.floor(Math.random() * operArr.length);

            drawLine();
            drawText(numArr[Math.floor(Math.random() * numArr.length)][fir], 10);
            drawText(operArr[oper], 40);
            drawText(numArr[Math.floor(Math.random() * numArr.length)][sec], 70);
            drawText('=', 100);
            drawText('?', 130);

            // 验证码值的计算
            let captcha;
            switch (oper) {
                case 0:
                    captcha = fir + sec;
                    break;
                case 1:
                    captcha = fir - sec;
                    break;
                case 2:
                    captcha = fir * sec;
                    break;
            }

            this.ctx.session.captcha = captcha.toString();
            this.ctx.body = canvas.toDataURL();
        };

    }
    return AuthController;
};