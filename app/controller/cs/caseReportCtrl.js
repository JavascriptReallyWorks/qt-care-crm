'use strict';

module.exports = app => {
    class CaseReportController extends app.Controller {

        async saveProductReport() {
            const rule = {
                report: 'object',
                status: 'int'
            };
            this.ctx.validate(rule);
            const { report, status } = this.req.body;
            const reportRule = {
                product_id: 'string',
                case_id: 'string'
            };
            this.ctx.validate(reportRule, report);

            let data = await  this.csService.saveProductReport(report, status);
            this.checkStatusAndRespond(data);
        }

        async changeReportStatus() {
            const rule = {
                case_id: 'string',
                product_id: 'string',
                status: 'int'
            };
            this.ctx.validate(rule);

            const { case_id, product_id, status } = this.req.body;
            let data = await  this.csService.changeReportStatus(case_id, product_id, status);
            this.checkStatusAndRespond(data);
        }


        async findProductReportWithCase() {
            const rule = {
                case_id: 'string',
                product_id: 'string'
            };
            this.ctx.validate(rule);

            const { case_id, product_id } = this.req.body;
            console.log(case_id, product_id)
            let data = await  this.ctx.model.CaseReport.findOne({ case_id: case_id, product_id: product_id });
            this.checkAndRespond(data);
        }


        async previewProductReport() {
            let medical_record_id = this.ctx.params.medical_record_id;
            let case_id = this.ctx.params.case_id;
            let product_id = this.ctx.params.product_id;

            if (medical_record_id && case_id && product_id) {
                let report = await  this.ctx.model.CaseReport.findOne({ case_id: case_id, product_id: product_id });
                if (report) {
                    if (report.treatments) {
                        for (let j = 0; j < report.treatments.length; j++) {
                            if (report.treatments[j].tplName === "drug") {
                                report.treatment_drug = true;
                            }
                            if (report.treatments[j].tplName === "doctor") {
                                report.treatment_doctor = true;
                            }
                            if (report.treatments[j].tplName === "go_to_doctor_help") {
                                report.treatment_go_to_doctor_help = true;
                            }
                        }
                    }

                    let medicalRecord = await  this.ctx.model.MedicalRecord.findById(medical_record_id);
                    let md = this.ctx.service.csService.sortMedical(medicalRecord);
                    if (md) {
                        await  this.ctx.render('cs_partials/print_report.jade', {
                            medicalRecord: md,
                            report: report
                        });
                    } else {
                        await  this.ctx.render('404.jade');
                    }


                } else {
                    await  this.ctx.render('404.jade');
                }



            } else {
                await  this.ctx.render('404.jade');
            }
        }
    }
    return CaseReportController;
};