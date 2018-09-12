module.exports = app => {
    const mongoose = app.mongoose;
    const conn27017 = app.mongooseDB.get('db27017');
    let caseReport = {
        userid: String,
        openid: String,
        user_name: String,
        driver_id: String,
        wx_unionid: String,
        driver_status: Number,

        trialGroupsCN:{},
        trialGroups:[{
            _id:false,
            additionalInformation:String,
            id:String,
            name:String,
            rationale:String,
            testOrderId:String,
            therapyType:String,
            trialsDescription:String,
            clinicalTrials:[{
                _id:false,
                drug:String,
                eligibilityCriteria:[{}],
                id:String,
                overview:String,
                simpleName:String,
                trialPhase:String,
                trial:{
                    id:String,
                    nctId:String,
                    trialSites:[{
                        hasSlotsAvailable:Boolean,
                        id:String,
                        institution:{
                            id:String,
                            name:String,
                            address:{
                                id:String,
                                city:String,
                                country:String,
                                region:String,
                                streetLine1:String,
                                postalCode:{
                                    code:String,
                                }
                            },
                        },
                        principalInvestigator:{
                            email:String,
                            name: String,
                            phoneNumber:{
                                countryCode:String,
                                number:String,
                            }
                        }
                    }],
                }
            }]
        }]
    };

    const CaseReportSchema = new mongoose.Schema(caseReport);
    return conn27017.model('CaseReport', CaseReportSchema, 'case_report');
};