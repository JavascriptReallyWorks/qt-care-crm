'use strict';

module.exports = app => {
    class CaseTicketController extends app.Controller {
        async queryCaseTickets(){
            const { ctx } = this;
            const bodyRule = {
                _id: 'string'
            };
            ctx.validate(bodyRule);
            let {_id} = this.body;
            this.checkAndRespond(await ctx.model.CaseTicket.find({caseId:_id}));
        };

        async newTicketComment(){
            const { ctx, service } = this;
            const bodyRule = {
                _id: 'string',
                comment: 'string'
            };
            ctx.validate(bodyRule);
            try{
                let {_id,comment,assignees} = this.body;
                if(!assignees){
                    assignees = [];
                }
                const newCommentObj = {
                    comment,
                    assignees,
                    authorId: this.user._id.toString(),
                    authorName: this.user.nickname || this.user.name,
                    createdAt: new Date(),
                };

                let caseTicket = await ctx.model.CaseTicket.findById(_id);
                caseTicket.read = false;
                caseTicket.comments.push(newCommentObj);
                assignees.forEach( newAssignee =>{
                    let existingAssignee = caseTicket.allAssignees.find(assignee => {
                        return assignee._id === newAssignee._id
                    });
                    if(!existingAssignee){
                        caseTicket.allAssignees.push(newAssignee);
                    }
                });
                caseTicket.markModified('comments');
                caseTicket.markModified('allAssignees');
                let newCaseTicket = await caseTicket.save();
                this.checkAndRespond(newCaseTicket);

                await service.emailService.newCaseTicketCommentNotification(newCaseTicket);
            }
            catch (err){
                throw err;
            }
        }

        async newTicket(){
            const { ctx,service } = this;
            const bodyRule = {
                caseId:'string',
                caseSid:'int',
                title: 'string',
                content: 'string'
            };
            ctx.validate(bodyRule);
            try{
                let {caseId,caseSid,title,content, assignees} = this.body;
                const newTicket = {
                    caseId,
                    caseSid,
                    title,
                    content,
                    assignees:assignees || [],
                    allAssignees:assignees || [],
                    read:false,
                    authorId: this.user._id.toString(),
                    authorName: this.user.nickname || this.user.name,
                };
                let ticket = await ctx.model.CaseTicket.create(newTicket);
                this.checkAndRespond(ticket);

                await service.emailService.newCaseTicketNotification(ticket);
            }
            catch (err){
                throw err;
            }
        }
    }
    return CaseTicketController;
};

