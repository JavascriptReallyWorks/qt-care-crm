exports.show =   function * () {
    const {app} = this;
    try{
        let medicalRecordId = this.params.id;
        let md = yield app.model.MedicalRecord.findById(medicalRecordId);
        let fileKey;
        if(md.summaryEnOssKey){
            fileKey = md.summaryEnOssKey;
        }
        else{
            fileKey = yield this.service.fileService.createPdfReportAndLink(medicalRecordId, "en");
            md.summaryEnOssKey = fileKey;
            yield md.save();
        }
        let file = yield app.oss.getStream(fileKey);
        this.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=MedicalSummary_${Date.now()}.pdf`,
            // 'Content-Length': stats.size
        });
        this.body = file.stream;

    } catch (err){
        throw err;
    }
};
