/**
 * Created by Yang1 on 4/29/17.
 */

module.exports = app => {

    // from doctor portal
    app.get('/external/doctor/medicalSummaryEn', app.controller.external.fileController.medicalSummaryEn);
    app.get('/external/doctor/previewReport', app.controller.external.fileController.previewReport);


};
