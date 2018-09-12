module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    const CaseTicketSchema = new mongoose.Schema({
        caseId:{type:String, index:true, required:true},
        caseSid:{type:Number},
        title: String,
        content: String,
        read:{type:Boolean, default:false},

        //所有指派人
        allAssignees:[{
            _id:String,
            name:String,
            nickname:String,
            email:String,
        }],

        //最初指派人
        assignees:[{
            _id:String,
            name:String,
            nickname:String,
            email:String,
        }],

        comments: [{
            _id: false,
            comment:String,
            assignees:{},
            authorId: String,
            authorName: String,
            createdAt: Date,
        }],
        authorId: String,
        authorName: String,
    },{
        usePushEach: true,
        timestamps: true,
    });

    return conn27017.model('CaseTicket', CaseTicketSchema, 'case_ticket');
}