'use strict';

module.exports = app => {
    class MedicalRecordController extends app.Controller {

        async updateMedicalRecord() {
            const rule = {
                medicalRecord: 'object'
            };
            this.ctx.validate(rule);

            let id = this.req.body.id;
            let medicalRecord = this.req.body.medicalRecord;

            if (id) {
                // old
                let mdr = await this.ctx.model.MedicalRecord.findById(id);
                mdr.set(medicalRecord);
                let res = await mdr.save();
                if (res)
                    this.checkStatusAndRespond({ status: 'ok' });
                else
                    this.checkStatusAndRespond({ status: 'no' });
            } else { // new
                let newMedicalRecord = new this.ctx.model.MedicalRecord(medicalRecord);
                let res = await newMedicalRecord.save();
                if (res)
                    this.checkStatusAndRespond({ status: 'ok' });
                else
                    this.checkStatusAndRespond({ status: 'no' });
            }
        }

        async queryAllMedicalRecordByOpenId() {
            const rule = {
                openid: 'string',
            };
            this.ctx.validate(rule);
            let openid = this.req.body.openid;
            let data = await this.ctx.model.MedicalRecord.find({ openid: openid });
            this.checkAndRespond(data);
        }

        async queryMedicalRecords() {
            let cond = this.req.body.cond;
            const condRule = {
                page: 'int',
                pageSize: 'int'
            };
            // 校验参数
            this.ctx.validate(condRule, cond);

            let page = cond.page;
            let limit = cond.pageSize;
            delete cond.page;
            delete cond.pageSize;
            let queryCond = {};

            cond.patient_name && (queryCond.patientName = new RegExp(cond.patient_name, "ig"));
            cond.patient_disease && (queryCond['presentDiagnosis.cancerType'] = new RegExp(cond.patient_disease, "ig"))
            let data = await this.csService.queryMedicalRecords(queryCond, page, limit);
            this.checkAndRespond(data);
        }


        async findMedicalRecordOfId() {
            const rule = {
                id: 'string'
            };
            this.ctx.validate(rule);
            let id = this.req.body.id;
            let data = await this.ctx.model.MedicalRecord.findById(id);
            // 返回数组
            if (data)
                this.checkAndRespond([data]);
            else
                this.checkAndRespond(null);
        }

        async deleteOneMedicalRecord() {
            const rule = {
                id: 'string',
            };
            this.ctx.validate(rule);
            const { id } = this.req.body;
            try {
                await this.ctx.model.MedicalRecord.findByIdAndRemove(id);
                this.checkStatusAndRespond({ status: 'ok' });
            } catch (err) {
                this.checkStatusAndRespond({ status: 'no' });
                throw err;
            }


        }


        async previewMedicalRecord() {
            let medical_record_id = this.ctx.params.medical_record_id;
            let case_id = this.ctx.query.case_id;
            let product_id = this.ctx.query.product_id;
            let lang = this.ctx.params.lang;


            if (!lang) {
                lang = "cn";
            }
            if (medical_record_id) {
                let data = await this.ctx.model.MedicalRecord.findById(medical_record_id);

                let reportData = null;
                if (case_id && product_id) {
                    reportData = await this.ctx.model.CaseReport.findOne({ case_id: case_id, product_id: product_id });
                }

                if (data) {
                    const csService = this.ctx.service.csService;
                    if (lang === "cn") {
                        await this.ctx.render('cs_partials/print_medical_record.jade', { medicalRecord: csService.sortMedical(data), reportData: reportData });
                    }
                    if (lang === "en") {
                        await this.ctx.render('cs_partials/print_medical_record_en.jade', { medicalRecord: csService.sortMedical(data.en), reportData: reportData });
                    }

                } else {
                    await this.ctx.render('404.jade');
                }
            } else {
                await this.ctx.render('404.jade');
            }
        }


        async previewReportByDriverId() {
            let driver_id = this.ctx.params.driver_id;

            let lang = this.ctx.params.lang;
            let file = this.ctx.query.file;

            if (driver_id) {
                let data = await this.ctx.model.MedicalRecord.findOne({ driver_id: driver_id });
                let reportData = null;
                if (file === "report") {
                    reportData = await this.ctx.model.CaseReport.findOne({ driver_id: driver_id });
                }
                if (data) {
                    const csService = this.ctx.service.csService;
                    if (lang === "en") {
                        await  this.ctx.render('cs_partials/print_medical_record_en.jade', { medicalRecord: csService.sortMedical(data.en), reportData: reportData });
                    } else {
                        await  this.ctx.render('cs_partials/print_medical_record.jade', { medicalRecord: csService.sortMedical(data), reportData: reportData });
                    }

                } else {
                    await  this.ctx.render('404.jade');
                }
            } else {
                await  this.ctx.render('404.jade');
            }
        }

        
        async createPatientFollowedRecord() {
            let record = this.ctx.body.record;
            let id = this.ctx.body.id;
            if (!id) {
                this.checkStatusAndRespond({ status: 'no' });
            }
            const recordule = {
                created_time: 'int',
                note: 'string'
            };

            this.ctx.validate(recordule, record);

            let data = await  this.ctx.model.MedicalRecord.findByIdAndUpdate(id, {
                $push: {
                    patientFollowedRecords: record
                }
            });
            if (data)
                this.checkStatusAndRespond({ status: 'ok' });

        }

        async queryMdPatients(){
            let patientName = this.req.body.patientName;
            let limit = this.req.body.pageSize;
            let data = await this.ctx.model.MedicalRecord.find({patientName: new RegExp(patientName, "ig")}, {
                patientName: 1,
                patientGender:1,
                patientMobile:1,
                patientBirthday: 1,
                presentDiagnosis:1,
                openid: 1
            }).limit(limit);
            this.checkAndRespond(data);
        }

        async connectMd(){
            let mdId = this.req.body.mdId;
            let openid = this.req.body.openid;
            let data = await this.ctx.model.MedicalRecord.findByIdAndUpdate(mdId, {
                $set: {
                    openid
                }
            });
            if (data)
                this.checkStatusAndRespond({ status: 'ok' });
        }

        async createMdFromWechat(){
            const {ctx} = this;
            let md = this.req.body.md;
            let newMdData = ctx.service.csService.parseMdFromWechat(md);

            // 保证和老病历系统中的md一样的_id
            newMdData._id = app.mongoose.Types.ObjectId(md.medical_record_id);

            let newMedicalRecord = new ctx.model.MedicalRecord(newMdData);
            let res = await newMedicalRecord.save();
            if (res)
                this.checkStatusAndRespond({ status: 'ok' });
            else
                this.checkStatusAndRespond({ status: 'no' });
        }
    }
    return MedicalRecordController;
};