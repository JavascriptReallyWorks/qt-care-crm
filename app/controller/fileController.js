
module.exports = app => {
    class FileController extends app.Controller {

        * getOssFileWithKey(){
            const {ctx, service} = this;
            const {fileKey} = ctx.query;
            if(!fileKey){
                ctx.body = null;
                return;
            }
            try{
                let file = yield app.oss.getStream(fileKey);
                const nameSplits = fileKey.split('/');
                ctx.set({
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': `attachment; filename=${nameSplits[nameSplits.length-1]}`,
                    // 'Content-Length': stats.size
                });
                ctx.body = file.stream;

            } catch (err){
                throw err;
            }
        }

        * generateMedicalRecordSummary(){
            const {ctx, service} = this;
            const {medicalRecordId, lang} = this.body;
            if(!medicalRecordId || ["cn","en"].indexOf(lang) < 0){
                this.failAndRespond({fileKey:null});
                return;
            }
            try{
                let md = yield ctx.model.MedicalRecord.findById(medicalRecordId);
                if(!md){
                    this.fail({fileKey:null});
                    return;
                }
                let fileKey = yield service.fileService.createMedicalSummary(medicalRecordId, lang);
                if(lang === 'cn'){
                    md.summaryCnOssKey = fileKey;
                }
                else{
                    md.summaryEnOssKey = fileKey;
                }
                yield md.save();
                this.checkAndRespond({fileKey});

            } catch (err){
                this.failAndRespond({fileKey:null});
                ctx.logger.error(`
                    =============== controller/fileController generateMedicalRecordSummary err  ===============
                    medicalRecordId: ${medicalRecordId}
                    language: ${lang}
                    err: ${err}
                `);
            }
        }


        async previewMedicalSummary(){
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
                        data.en.treatmentHistory.sort((a,b) => (new Date(b.date) - new Date(a.date)));
                        // data.en.documents.sort((a,b) => {return (a.documentType > b.documentType ) || (new Date(a.visitDate) - new Date(b.visitDate))} );    //  || (new Date(a.visitDate) - new Date(b.visitDate))

                        // data.en.documents.sort((a,b) => {
                        //     return a.documentType > b.documentType;
                        // });

                        data.en.documents.sort((a,b) => {
                            if (a.documentType.toUpperCase().trim() !== b.documentType.toUpperCase().trim()) {
                                return a.documentType > b.documentType ? 1: -1;
                            }
                            return new Date(b.visitDate) - new Date(a.visitDate);
                        });
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