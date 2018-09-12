module.exports = async app => {
    const ctx = app.createAnonymousContext();
    // 创建初始管理员
    await ctx.model.User.findOneAndUpdate(
        { name: 'admin' },
        {
            nickname : "admin",
            crm_role : "qt_cs",
            pass : "e8d26595e4f7fd19a79776a594bb2ba2963a6f9a",
            user_type : "crm",
            crm_admin : true,
            email : "admin@qtclinics.com"
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );

    await ctx.model.CrmRole.findOneAndUpdate(
        { name: 'qt_cs' },
        {
            "display" : "量子健康客服",
            "replyType" : 230,
            "menu" : [
                {
                    "name" : "病历管理",
                    "url" : ".medical_record"
                },
                {
                    "name" : "在线回答",
                    "url" : ".answer_chat"
                },
                {
                    "name" : "订单管理",
                    "url" : ".case_manager"
                },
            ]
        },
        {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
        }
    );
};
