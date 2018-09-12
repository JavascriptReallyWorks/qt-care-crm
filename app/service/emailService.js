const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.partner.outlook.cn',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "info@qtclinics.com", // generated ethereal user
        pass: "Quantum2018!" // generated ethereal password
    }
});

module.exports = app => {
    class EmailService extends app.Service {
        async caseStatusNotification(sid,status, user){
            const {ctx} = this;
            const STATUS_NAME = app.config.CONSTANT.CASE.STATUS_MAP[status];
            let html = `<p>系统消息:</p>
                <p><b>CASE ${sid}</b> 状态变更为 <b>${STATUS_NAME}</b></p>
                <p>操作人: <b>${user.nickname || user.name}</b></p>`;

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"Quantum Clinics" <info@qtclinics.com>', // sender address
                to: 'cs@qtclinics.com', // list of receivers
                // to: 'leiyanggz@gmail.com', // list of receivers
                subject: `CASE${sid}更新状态：${STATUS_NAME}`, // Subject line
                // text: 'Hello world?', // plain text body
                html,// html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    ctx.logger.error(`
                        =============== EmailService caseStatusNotification err  ===============
                        CASE: ${sid}
                        err: ${error}
                    `);
                }
            });
        }

        async newCaseTicketNotification(caseTicket){
            const {ctx} = this;
            if(!caseTicket || !caseTicket.allAssignees || !caseTicket.allAssignees.length){
                return;
            }
            let html = `
                <h2>CASE${caseTicket.caseSid}新的指派</h2>
                <p>来自:<b>${caseTicket.authorName}</b></p>
                <p>标题:<b>${caseTicket.title}</b></p>
                <p>内容:${caseTicket.content}</p>
            `;

            let mailOptions = {
                from: '"Quantum Clinics" <info@qtclinics.com>',
                to:  caseTicket.allAssignees.map(assignee => assignee.email), // list of receivers
                subject: `CASE${caseTicket.caseSid}新的指派`,
                html,
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    ctx.logger.error(`
                        =============== EmailService newCaseTicketNotification err  ===============
                        CASE: ${caseTicket.caseSid}
                        err: ${error}
                    `);
                }
            });
        }


        async newCaseTicketCommentNotification(caseTicket){
            const {ctx} = this;
            if(!caseTicket || !caseTicket.allAssignees || !caseTicket.allAssignees.length || !caseTicket.comments || !caseTicket.comments.length){
                return;
            }
            let newComment  = caseTicket.comments[caseTicket.comments.length - 1];
            let html = `
                <h2>CASE${caseTicket.caseSid}指派的新评论</h2>
                <p>来自:<b>${newComment.authorName}</b></p>
                <p>评论:${newComment.comment}</p>
            `;

            let mailOptions = {
                from: '"Quantum Clinics" <info@qtclinics.com>',
                to:  caseTicket.allAssignees.map(assignee => assignee.email), // list of receivers
                subject: `CASE${caseTicket.caseSid}指派的新评论`,
                html,
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    ctx.logger.error(`
                        =============== EmailService newCaseTicketCommentNotification err  ===============
                        CASE: ${caseTicket.caseSid}
                        err: ${error}
                    `);
                }
            });
        }
    }
    return EmailService;
};