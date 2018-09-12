
module.exports = app => {
    class FileController extends app.Controller {

        // from doctor portal
        * medicalSummaryEn(){
            const {ctx, service} = this;
            const {medicalRecordId, doctorToken} = ctx.query;
            if(!medicalRecordId){
                ctx.body = null;
                return;
            }
            try{
                let md = yield ctx.model.MedicalRecord.findById(medicalRecordId);
                if(!md){
                    ctx.body = null;
                    return;
                }
                let fileKey;
                if(md.summaryEnOssKey){
                    fileKey = md.summaryEnOssKey;
                }
                else{
                    fileKey = yield service.fileService.createPdfReportAndLink(medicalRecordId, "en", doctorToken);
                    md.summaryEnOssKey = fileKey;
                    yield md.save();
                }
                let file = yield app.oss.getStream(fileKey);
                ctx.set({
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename=MedicalSummary_${Date.now()}.pdf`,
                    // 'Content-Length': stats.size
                });
                this.ctx.body = file.stream;

            } catch (err){
                throw err;
            }
        }

        async previewReport(){
            let {medical_record_id,lang} = this.ctx.query;

            if (!lang) {
                lang = "cn";
            }
            if (medical_record_id) {
                let data = await this.ctx.model.MedicalRecord.findById(medical_record_id);

                if (data) {

                    if (lang === "cn") {
                        await this.ctx.render('cs_partials/print_medical_record.jade', { medicalRecord: data });
                    }
                    if (lang === "en") {
                        await this.ctx.render('cs_partials/print_medical_record_en.jade', { medicalRecord: data.en });
                    }

                } else {
                    await this.ctx.render('404.jade');
                }
            } else {
                await this.ctx.render('404.jade');
            }
        }

    }
    return FileController;
};