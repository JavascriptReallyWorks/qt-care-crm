const fs = require('fs');

const PATH = {
    resource:"/public/resource/",
    voicePath: "/public/resource/voice/",
    mp3Path: "/public/resource/mp3/",
    userFilePath: "/public/resource/user_file/",
    download: "/public/resource/download/"
};

module.exports = async app => {

    try {
        if (!fs.existsSync(__dirname + PATH.resource)) {
            fs.mkdirSync(__dirname + PATH.resource);
        }
        if (!fs.existsSync(__dirname + PATH.mp3Path)) {
            fs.mkdirSync(__dirname + PATH.mp3Path);
        }
        if (!fs.existsSync(__dirname + PATH.voicePath)) {
            fs.mkdirSync(__dirname + PATH.voicePath);
        }
        if (!fs.existsSync(__dirname + PATH.userFilePath)) {
            fs.mkdirSync(__dirname + PATH.userFilePath);
        }
        if (!fs.existsSync(__dirname + PATH.download)) {
            fs.mkdirSync(__dirname + PATH.download);
        }


        const ctx = app.createAnonymousContext();
        // 创建初始管理员
        await ctx.model.User.findOneAndUpdate(
            {name: 'admin'},
            {
                nickname: "admin",
                crm_role: "qt_cs",
                pass: "e8d26595e4f7fd19a79776a594bb2ba2963a6f9a",
                user_type: "crm",
                crm_admin: true,
                email: "admin@qtclinics.com"
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );

        await ctx.model.CrmRole.findOneAndUpdate(
            {name: 'qt_cs'},
            {
                "display": "量子健康客服",
                "replyType": 230,
                "menu": [
                    {
                        "name": "病历管理",
                        "url": ".medical_record"
                    },
                    {
                        "name": "在线回答",
                        "url": ".answer_chat"
                    },
                    {
                        "name": "订单管理",
                        "url": ".case_manager"
                    },
                ]
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
            }
        );
    }
    catch (e) {
        throw e;
    }
};
