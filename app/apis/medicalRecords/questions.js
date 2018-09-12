
exports.index =  async function () {
    const {app} = this;
    let {parent_id} = this.params;
    let include = {en:1};
    let medicalRecord = await app.model.MedicalRecord.findById(parent_id,include).lean();
    if(medicalRecord && medicalRecord.en && medicalRecord.en.patientQuestions)
        this.data = {questions:medicalRecord.en.patientQuestions};
    else
        this.data = {questions:[]};
};

exports.update =  async function () {
    const {app} = this;
    let {parent_id, id, data} = this.params;
    try{
        let medicalRecord = await app.model.MedicalRecord.findById(parent_id);
        let idx = medicalRecord.en.patientQuestions.findIndex( item => item.id === id);
        medicalRecord.en.patientQuestions[idx].answer = data.answer;
        medicalRecord.markModified(`en.patientQuestions.${idx}`);
        let res = await medicalRecord.save();
        this.data = {status:(res ? 'ok':'fail')};
    }
    catch (err){
        this.data = {status:'fail'};
    }
};