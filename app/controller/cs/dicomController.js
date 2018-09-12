'use strict';

module.exports = app => {
    class DicomController extends app.Controller {
        async getDicomLink(){
            const { ctx } = this;
            let accessionNumber = this.req.body.accessionNumber;
            let algorithm = "aes-128-cbc";
            let key = app.config.CONSTANT.DICOM.PRIVATE_KEY;
            let iv = app.config.CONSTANT.DICOM.IV;
            let content = {"filter.accession_number.equals":accessionNumber};
            let output = ctx.helper.encryptText(algorithm, key, iv, JSON.stringify(content), "base64");
            this.checkAndRespond(output);
        };

        async refreshDicom(){
            const {ctx, service } = this;
            const rule = {
                dicomCaseNumber: 'string',
            };
            ctx.validate(rule);

            let {dicomCaseNumber} = this.body;
            try{
                let sid = await service.dicomService.getAmbraSessionId();
                if(sid) {
                    const res = await ctx.curl('https://qtclinics.ambrahealth.com/api/v3/study/list', {
                        method: 'POST',
                        data: {
                            sid,
                            "filter.customfield-55fc65c5-185e-4496-9aba-e55e2b4f2cd0.equals": dicomCaseNumber,
                            fields: JSON.stringify(["accession_number"])
                        },
                        dataType: 'json',
                    });
                    let studies = res.data.studies;
                    let accsNumberArray = studies.map(study => study.accession_number);
                    this.checkAndRespond(accsNumberArray);

                    /*  refresh自动更新数据库，暂时关闭
                    let arrToInsert = studies.map(study => {
                        return {accessionNumber: study.accession_number}
                    });
                    // 更新medical record
                    await this.ctx.model.MedicalRecord.updateMany({
                        openid: openid
                    },{
                        $addToSet:{
                            dicomFiles:{
                                $each:arrToInsert
                            }
                        }
                    });
                    */
                }

            } catch(err){
                throw err;
            }
        };

    }
    return DicomController;
};

