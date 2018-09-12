

exports.index =  async function () {
    const {app} = this;
    let {parent_id, per_page, page} = this.params;
    let cond = {caseId:parent_id};
    let total = await app.model.CaseTicket.count(cond);
    if (total < per_page * (page - 1)) page = 1;
    let caseTickets = await app.model.CaseTicket.find(cond).skip(per_page * (page - 1)).limit(per_page).lean();
    this.data = {total, caseTickets};
};

exports.update =  async function () {
    const {app} = this;
    let {parent_id, id, data} = this.params;
    let doctor = this.accessToken;
    try{
        let operation = {};
        let newComment = {};
        if(data.comment){
            newComment = {
                authorId:doctor._id,
                authorName:`${doctor.firstName}, ${doctor.lastName}`,
                comment:data.comment,
                createdAt:new Date()
            };
            operation = {
                $push:{
                    comments:newComment
                }
            };
        }
        else if(data.read){
            operation = {
                $set:{
                    read:data.read
                }
            }
        }

        let res =await app.model.CaseTicket.findByIdAndUpdate(id, operation);
        if(data.comment){
            this.data = {
                status: (res ? 'ok' : 'fail'),
                comment:newComment,
            };
        }
        else if(data.read) {
            this.data = {
                status: (res ? 'ok' : 'fail')
            };
        }
    }
    catch (err){
        this.data = {status:'fail'};
    }
};

exports.create =  async function () {
    const {app} = this;
    let {parent_id, data} = this.params;
    try{
        await app.model.CaseTicket.create({
            caseId:parent_id,
            ...data
        });
        this.data = {status:'ok'};
    }
    catch (err){
        this.data = {status:'fail'};
    }
};