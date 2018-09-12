const env = process.env.EGG_SERVER_ENV;
const LOCAL_IP = env === 'prod' ? "http://127.0.0.1:7072" : "https://127.0.0.1:7072";
const crypto = require('crypto');

module.exports = app => {
    class FileService extends app.Service {
        async createPdfReportAndLink(medicalRecordId, language, doctorToken){    // language: "en" or "cn"
            if(!medicalRecordId || !["en","cn"].includes(language)){
                return null;
            }
            const {ctx, service} = this;
            try {
                let url = ctx.helper.addQueryParams(`${LOCAL_IP}/external/doctor/previewReport`, {
                    medical_record_id: medicalRecordId,
                    lang:language,
                    doctorToken
                });
                const res = await ctx.curl(url, {
                    method: 'GET',
                    rejectUnauthorized: false
                });

                let html = res.data.toString();
                let pdfData = await service.csService.printPDf(html, 'en');

                if (pdfData) {
                    return pdfData.ossFileKey;
                } else {
                    return null
                }
            }
            catch (err){
                ctx.logger.error(`
                    =============== fileService createPdfReportAndLink err  ===============
                    medicalRecordId: ${medicalRecordId}
                    language: ${language}
                    err: ${err}
                `);
                return null;
            }
        }

        async createMedicalSummary(medicalRecordId, language){    // language: "en" or "cn"
            const {ctx, service} = this;
            try {
                let url = ctx.helper.addQueryParams(`${LOCAL_IP}/cs/previewMedicalSummary`, {
                    medical_record_id: medicalRecordId,
                    lang:language,
                });

                let hash = crypto.createHash("sha1");
                hash.update(app.config.internal_http_token);

                const res = await ctx.curl(url, {
                    method: 'GET',
                    headers:{
                        internal_http_token:hash.digest('hex')
                    },
                    rejectUnauthorized: false
                });

                let html = res.data.toString();
                let pdfData = await service.csService.printPDf(html, 'en');

                if (pdfData) {
                    return pdfData.ossFileKey;
                } else {
                    return null
                }
            }
            catch (err){
                ctx.logger.error(`
                    =============== fileService createMedicalSummary err  ===============
                    medicalRecordId: ${medicalRecordId}
                    language: ${language}
                    err: ${err}
                `);
                return null;
            }
        }


    }
    return FileService;
};