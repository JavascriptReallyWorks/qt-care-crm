
exports.index =  async function () {
    const {app} = this;
    let {per_page, page} = this.params;
    let cond = {status:app.config.CONSTANT.CASE.STATUS.CONSULT_TIME_CONFIRMED}; // CONSULT_TIME_CONFIRMED:1900, //已确定会诊时间
    let total = await app.model.Case.count(cond);
    if (total < per_page * (page - 1)) page = 1;
    const include = {
        medical_record_id:1,
        sid:1,
        videoLink:1,
    };
    let cases = await app.model.Case.find(cond, include).skip(per_page * (page - 1)).limit(per_page).lean();
    let promises = [];
    const mdInclude = {
        _id: 0,
        "en.patientName": 1,
        "en.patientGender": 1,
        "en.patientBirthday": 1,
        "en.patientMobile": 1,
        "en.patientAddress": 1,
        "en.presentDiagnosis": 1,
        "en.patientHeight": 1,
        "en.patientWeight": 1,
    };
    let that = this;
    cases.forEach(  theCase => {
        if(theCase.medical_record_id) {
            promises.push(new Promise((resolve, reject) => {
                app.model.MedicalRecord.findById(theCase.medical_record_id, mdInclude).lean().then(medicalRecord => {
                    theCase = Object.assign(theCase,medicalRecord.en);
                    // theCase.pdfLink = "http://zlzhidao-resource.oss-cn-shenzhen.aliyuncs.com/pdf_report/pdf-1528829580232-en.pdf";
                    //theCase.pdfLink = `/external/medicalSummaryEn&medical_record_id=${theCase.medical_record_id}`;
                    const params = {
                        medicalRecordId:theCase.medical_record_id,
                        doctorToken:that.accessToken.token
                    };
                    //TODO: 改成由前端加密，而不是后端
                    theCase.pdfLink = that.helper.addQueryParams(app.config.CONSTANT.BASE_URL + "/external/doctor/medicalSummaryEn",params);
                    resolve();
                })
            }));
        }
    });
    await Promise.all(promises);
    this.data = {total, cases};
};


exports.show =  async function () {
    const {app} = this;
    let {id} = this.params;
    const include = {
        medical_record_id:1,
        sid:1,
        videoLink:1,
    };
    let theCase = await app.model.Case.findById(id,include).lean();
    const mdInclude = {
        _id: 0,
        "en.patientName": 1,
        "en.patientGender": 1,
        "en.patientBirthday": 1,
        "en.patientMobile": 1,
        "en.patientAddress": 1,
        "en.presentDiagnosis": 1,
        "en.patientHeight": 1,
        "en.patientWeight": 1,
    };

    let medicalRecord = await app.model.MedicalRecord.findById(theCase.medical_record_id, mdInclude).lean();
    theCase = Object.assign(theCase,medicalRecord.en);

    const params = {
        medicalRecordId:theCase.medical_record_id,
        doctorToken:this.accessToken.token
    };
    //TODO: 改成由前端加密，而不是后端
    theCase.pdfLink = this.helper.addQueryParams(app.config.CONSTANT.BASE_URL + "/external/doctor/medicalSummaryEn",params);

    this.data = {case:theCase};
};