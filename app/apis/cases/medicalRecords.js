
exports.show =  async function () {
    const {app} = this;
    let {parent_id, id} = this.params;
    const include = {
        en:1,
        dicomFiles:1
    };
    let medicalRecord = await app.model.MedicalRecord.findById(id,include).lean();
    if(medicalRecord && medicalRecord.en) {
        let dicomFiles = medicalRecord.en.dicomFiles.map(dicom => {
            return {
                ...dicom,
                type: 'dicom',
            }
        });
        let reportFiles = medicalRecord.en.documents.map(dicom => {
            return {
                ...dicom,
                type: 'report',
            }
        });
        this.data = {medicalRecord: dicomFiles.concat(reportFiles)};
    }
    else{
        this.data = {medicalRecord: []};
    }
};