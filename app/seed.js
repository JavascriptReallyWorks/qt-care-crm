module.exports = async app => {
    /*
    await app.redis.sadd('invitationCode','qtclinics');

    await setSerialId(app);

    await refactorCases(app);

    await updateEmptyDicomCaseNumber(app)
    */
};

let updateEmptyDicomCaseNumber = async function (app) {
    let mds = await app.model.MedicalRecord.find({},{
        openid:1,
        dicomCaseNumber:1,
    });
    mds.forEach(async md => {
        if(!md.dicomCaseNumber){
            if(md.openid){
                md.dicomCaseNumber = md.openid;
            }
            else{
                md.dicomCaseNumber = "QTCDCM" + (new Date()).getTime();
            }
            await md.save()
        }
    })
    console.log('updateEmptyDicomCaseNumber done!');
};

let refactorCases = async function (app) {
    let cases = await app.model.Case.find();
    cases.forEach(async theCase => {
        if(theCase.from === 'WECHAT'){
            if(!Array.isArray(theCase.products)) {
                theCase.products = [{...theCase.products}];
            }
        }
        else{   // 'CRM'
            if(!Array.isArray(theCase.products)) {
                theCase.product = {...theCase.products};
                delete theCase.products;
            }
        }
        await theCase.save();
    });

    /*
    let cases = await app.model.Case.find();
    cases.forEach(async theCase => {
        theCase.userName = theCase.user_name;
        theCase.patientName = theCase.medical_record_patient_name || theCase.patient_name;
        theCase.patientMobile = theCase.patient_mobile;
        if(theCase.products && Array.isArray(theCase.products) && theCase.products.length){
            let product = {...theCase.products[0]};
            product.unit_price = product.unit_price || product.fee;
            product._id = product._id.toString();
            theCase.products = product;
        }
        await theCase.save();
    });
    */
};

let setSerialId = async function (app) {
    const collections = [
        {
            collection: app.model.Product,
            collectionName:'product',
            initialCount:0,
        },
        {
            collection: app.model.Case,
            collectionName:'case',
            initialCount:3000,
        }
    ];

    collections.forEach(async item => {
        let counter = await app.model.Counter.count({collectionName:item.collectionName});
        if(!counter){
            let count = item.initialCount;
            let list = await item.collection.find();
            list.forEach(async model => {
                model.sid = ++count;
                await model.save();
            });
            await app.model.Counter.create({
                collectionName:item.collectionName,
                serialCount:count
            })
        }

    })
};