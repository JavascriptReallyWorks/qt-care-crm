/**
 * Created by Yang1 on 4/29/17.
 */

module.exports = app => {
    app.get('/cs', app.controller.cs.csCtrl.cs);
    app.get('/cs/cs_partials/:name', app.controller.cs.csCtrl.csPartials);
    app.post('/cs/newMongoId', app.controller.cs.csCtrl.newMongoId);
    app.get('/cs/tags/getSubTags', app.controller.cs.csCtrl.getSubTags);
    app.post('/cs/qa/searchQa', app.controller.cs.csCtrl.searchQa);
    app.get('/cs/qa/getOneQa', app.controller.cs.csCtrl.getOneQa);
    app.get('/cs/qa/getTags', app.controller.cs.csCtrl.getTags);

    //用户
    app.post('/cs/queryCurUser', app.controller.userCtrl.curUser);
    app.post('/cs/findAllUserByRoles', app.controller.userCtrl.findAllUserByRoles);
    app.post('/cs/findCrmUserMap', app.controller.userCtrl.findCrmUserMap);
    app.get('/cs/qtCsUsers',app.controller.userCtrl.qtCsUsers);

    app.post('/cs/user/queryUsers', app.controller.userCtrl.queryUsers);
    app.post('/cs/user/createUser', app.controller.userCtrl.createUser);
    app.post('/cs/user/updateUser', app.controller.userCtrl.updateUser);

    app.post('/cs/user/queryAllRoles', app.controller.userCtrl.queryAllRoles);
    app.post('/cs/user/resetUserPass', app.controller.userCtrl.resetUserPass);
    app.post('/cs/user/removeUser', app.controller.userCtrl.removeUser);
    app.post('/cs/user/queryWechatUsers', app.controller.userCtrl.queryWechatUsers);

    // product
    app.post('/cs/product/saveAndUpdateProduct', app.controller.cs.productCtrl.saveAndUpdateProduct);
    app.get('/cs/product/findOneProduct', app.controller.cs.productCtrl.findOneProduct);
    app.post('/cs/product/queryProductByCond', app.controller.cs.productCtrl.queryProductByCond);
    app.post('/cs/product/queryProductList', app.controller.cs.productCtrl.queryProductList);
    app.post('/cs/product/deleteProductById', app.controller.cs.productCtrl.deleteProductById);

    //病历
    app.post('/cs/mdr/updateMedicalRecord', app.controller.cs.medicalRecordCtrl.updateMedicalRecord);
    app.post('/cs/mdr/findMedicalRecord', app.controller.cs.medicalRecordCtrl.queryAllMedicalRecordByOpenId);
    app.post('/cs/mdr/queryMedicalRecords', app.controller.cs.medicalRecordCtrl.queryMedicalRecords);
    app.post('/cs/mdr/findMedicalRecordOfId', app.controller.cs.medicalRecordCtrl.findMedicalRecordOfId);
    app.post('/cs/mdr/deleteOneMedicalRecord', app.controller.cs.medicalRecordCtrl.deleteOneMedicalRecord);
    app.post('/cs/mdr/createPatientFollowedRecord', app.controller.cs.medicalRecordCtrl.createPatientFollowedRecord);
    app.post('/cs/mdr/queryMdPatients', app.controller.cs.medicalRecordCtrl.queryMdPatients);
    app.post('/cs/mdr/connectMd', app.controller.cs.medicalRecordCtrl.connectMd);
    app.post('/ext/mdr/createMdFromWechat', app.controller.cs.medicalRecordCtrl.createMdFromWechat);

    // case
    app.get('/cs/case/:_id', app.controller.cs.caseCtrl.findById);
    app.post('/cs/case/updateCase', app.controller.cs.caseCtrl.updateCase);
    app.post('/cs/case/deleteCase', app.controller.cs.caseCtrl.deleteCase);
    app.post('/cs/case/queryCases', app.controller.cs.caseCtrl.queryCases);
    app.post('/cs/case/changeCaseStatus', app.controller.cs.caseCtrl.changeCaseStatus);
    app.post('/cs/case/changeDriverStatus', app.controller.cs.caseCtrl.changeDriverStatus);
    app.post('/cs/case/changeCaseMRStatus', app.controller.cs.caseCtrl.changeCaseMRStatus);
    app.post('/cs/case/pushLogWithCase', app.controller.cs.caseCtrl.pushLogWithCase);
    app.post('/cs/case/queryLogByCase', app.controller.cs.caseCtrl.queryLogByCase);
    app.post('/cs/case/createCaseFromMD', app.controller.cs.caseCtrl.createCaseFromMD);
    app.post('/ext/case/createCaseFromWechat', app.controller.cs.caseCtrl.createCaseFromWechat);


    app.post('/cs/case/saveAndUpdateTicket', app.controller.cs.caseCtrl.saveAndUpdateTicket);

    // caseTicket
    app.post('/cs/caseTicket/queryCaseTickets', app.controller.cs.caseTicketController.queryCaseTickets);
    app.post('/cs/caseTicket/newTicketComment', app.controller.cs.caseTicketController.newTicketComment);
    app.post('/cs/caseTicket/newTicket', app.controller.cs.caseTicketController.newTicket);


    //报告
    app.post('/cs/caseReport/saveProductReport', app.controller.cs.caseReportCtrl.saveProductReport);
    app.post('/cs/caseReport/changeReportStatus', app.controller.cs.caseReportCtrl.changeReportStatus);
    app.post('/cs/caseReport/findProductReportWithCase', app.controller.cs.caseReportCtrl.findProductReportWithCase);


    //常用语
    app.post('/cs/commonExp/getCommonExpressions', app.controller.cs.commonExpCtrl.getCommonExpressions);
    app.post('/cs/commonExp/setCommonExpressions', app.controller.cs.commonExpCtrl.setCommonExpressions);


    //打印预览
    app.get('/cs/previewReport/:medical_record_id/:lang', app.controller.cs.medicalRecordCtrl.previewMedicalRecord);
    app.get('/previewReportByDriverId/:driver_id/:lang', app.controller.cs.medicalRecordCtrl.previewReportByDriverId);
    app.get('/cs/previewReport/:case_id/:product_id/:medical_record_id', app.controller.cs.caseReportCtrl.previewProductReport);


    //下载pdf
    app.post('/cs/print_report', app.controller.cs.csCtrl.getPdfReport); // 好像Koa不兼容 能生成pdf,系统报错

    // 上传
    app.post('/cs/uploadFile', app.controller.cs.csCtrl.uploadFile);
    app.get('/cs/downloadFile', app.controller.cs.csCtrl.downloadFile);

    // dicom
    app.post('/cs/getDicomLink', app.controller.cs.dicomController.getDicomLink);
    app.post('/cs/refreshDicom', app.controller.cs.dicomController.refreshDicom);

    // media
    app.get('/cs/picture/picture_name', app.controller.cs.csCtrl.getPicture);
    app.get('/cs/audio/audio_name', app.controller.cs.csCtrl.getAudio);

    // doctor
    app.post('/cs/doctor/queryDoctorAbstract', app.controller.cs.doctorController.queryDoctorAbstract);

    //file
    app.get('/cs/getOssFileWithKey', app.controller.fileController.getOssFileWithKey);
    app.post('/cs/generateMedicalRecordSummary', app.controller.fileController.generateMedicalRecordSummary);
    app.get('/cs/previewMedicalSummary', app.controller.fileController.previewMedicalSummary);





    //转化统计
    // app.post('/cs/queryConvertCount', app.controller.csCtrl.queryConvertCount);

    //查询知识库
    //app.post('/cs/searchQaByTags', app.controller.csCtrl.searchQaByTags);

};
