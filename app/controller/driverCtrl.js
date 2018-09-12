'use strict';
const schema = require('validate');

module.exports = app => {
    class driverController extends app.Controller {
        
        async userCreate() {
            let body = this.ctx.request.body;
            let bodyRule = schema({
                driver_id: {
                    type: 'string',
                    required: true
                },
                created_time: {
                    type: 'number',
                    required: true
                },
                name: {
                    type: 'string',
                    required: true
                },
                phone: {
                    type: 'string',
                    required: true
                },
                gov_id: {
                    type: 'string',
                    required: false
                },
                birthday: {
                    type: 'number',
                    required: false
                },
                gender: {
                    type: 'number',
                    required: false
                },
                trade: {
                    id: {
                        type: 'string',
                        required: true
                    },
                    createTime: {
                        type: 'number',
                        required: false
                    },
                    products: {
                        type: 'array',
                        required: false
                    },
                    fee: {
                        type: 'number',
                        required: false
                    },
                    buyer: {
                        wx_openid: {
                            type: 'string',
                            required: true
                        },
                        wx_unionid: {
                            type: 'string',
                            required: false
                        },
                        wx_name: {
                            type: 'string',
                            required: true
                        },
                    }
                }
            });
            let errors = bodyRule.validate(body);
            if (errors[0]) {
                // console.log(errors)
                return this.success({
                    code: 10,
                    msg: "invalid request parameters",
                    data: null
                })
            }

            try {
                let mdData = {
                    driver_id: body.driver_id,
                    createTime: body.created_time,
                    patientName: body.name,
                    patientMobile: body.phone,
                    order_id: body.trade.id,
                    wx_openid: body.trade.buyer.wx_openid,
                    wx_name: body.trade.buyer.wx_name,
                    openid: body.trade.buyer.wx_openid
                };
                if (body.birthday) {
                    mdData.patientBirthday = body.birthday;
                }
                if (body.gender) {
                    mdData.patientGender = body.gender;
                }
                if (body.gov_id) {
                    mdData.patientGovId = body.gov_id;
                }
                let userData = {
                    nickname: body.trade.buyer.wx_name,
                    openid: body.trade.buyer.wx_openid
                };
                if (body.trade.buyer.wx_gender) {
                    userData.sex = body.trade.buyer.wx_gender;
                }
                if (body.trade.buyer.wx_head) {
                    userData.headimgurl = body.trade.buyer.wx_head;
                }
                let caseData = {
                    driver_id: body.driver_id,
                    openid: body.trade.buyer.wx_openid,
                    create_time: body.trade.createTime,
                    user_name: body.trade.buyer.wx_name,
                    medical_record_patient_name: body.name,
                    order_id: body.trade.id,
                    patient_mobile: body.phone,
                    fee: body.trade.fee,
                    status: 800
                };
                let products = [];
                if (body.trade.products) {
                    for (let i = 0; i < body.trade.products.length; i++) {
                        let product = body.trade.products[i];
                        products.push({
                            _id: product.id,
                            product_name: product.subject,
                            fee: product.fee
                        })
                    }
                    caseData.products = products;
                }
                if (body.trade.buyer.wx_unionid) {
                    userData.wx_unionid = body.trade.buyer.wx_unionid;
                    mdData.wx_unionid = body.trade.buyer.wx_unionid;
                    caseData.wx_unionid = body.trade.buyer.wx_unionid;
                }



                let updateUser = await  this.ctx.model.User.update({ openid: body.trade.buyer.wx_openid }, {
                    $set: userData
                }, {
                    upsert: true,
                    new: true
                });

                let insertMd = new this.ctx.model.MedicalRecord(mdData);
                let mdResult = await  insertMd.save();


                caseData.medical_record_id = mdResult._id;
                let insertCase = new this.ctx.model.Case(caseData);
                let caseResult = await  insertCase.save();



                if (updateUser && caseResult && mdResult) {
                    return this.success({
                        code: 1,
                        msg: "user create success"
                    })
                } else {
                    return this.success({
                        code: 0,
                        msg: "user created fail"
                    })
                }

            } catch (err) {
                console.log(err)
                return this.success({
                    code: 0,
                    msg: "user create error"
                })
            }
        }

        async userUpdate() {
            let patient = this.ctx.request.body;
            const patientRule = schema({
                driver_id: {
                    type: 'string',
                    required: true
                },
                phone: {
                    type: 'string',
                    required: true
                },
                gov_id: {
                    type: 'string',
                    required: false
                },
                birthday: {
                    type: 'number',
                    required: false
                },
                gender: {
                    type: 'number',
                    required: false
                }
            });
            let errors = patientRule.validate(patient);
            if (errors[0]) {
                return this.success({
                    code: 10,
                    msg: "invalid request parameters",
                    data: null
                })
            }

            try {
                let updateData = {
                    driver_id: patient.driver_id
                };
                if (patient.birthday) {
                    updateData.patientBirthday = new Date(patient.birthday);
                }
                if (patient.gender) {
                    updateData.patientGender = patient.gender;
                }
                if (patient.gov_id) {
                    updateData.gov_id = patient.gov_id
                }
                if (patient.phone) {
                    updateData.patientMobile = patient.phone
                }

                let md = await  this.ctx.model.MedicalRecord.findOne({ driver_id: patient.driver_id });
                md.set(updateData);
                let result = await  md.save();
                if (result) {
                    return this.success({
                        code: 1,
                        msg: "user update success"
                    })
                } else {
                    return this.success({
                        code: 0,
                        msg: "user updated fail"
                    })
                }

            } catch (err) {
                return this.success({
                    code: 0,
                    msg: "user update error"
                })
            }
        }

        async userSigndoc() {
            let body = this.ctx.request.body;

            const bodyRule = schema({
                driver_id: {
                    type: 'string',
                    required: true
                }
            });
            let errors = bodyRule.validate(body);
            if (errors[0]) {
                return this.success({
                    code: 10,
                    msg: "invalid request parameters",
                    data: null
                })
            }

            try {
                let md = await  this.ctx.model.MedicalRecord.findOne({ driver_id: body.driver_id });
                md.set({
                    driver_status: app.config.CONSTANT.ACTIVATION_STATUS.READY_FOR_COLLECTION
                });
                let mdResult = await  md.save();

                let theCase = await  this.ctx.model.Case.findOne({ driver_id: body.driver_id });
                theCase.set({
                    driver_status: app.config.CONSTANT.ACTIVATION_STATUS.READY_FOR_COLLECTION
                });
                let caseResult = await  theCase.save();

                if (mdResult && caseResult) {
                    return this.success({
                        code: 1,
                        msg: "Sign Doc success"
                    });
                } else {
                    return this.success({
                        code: 0,
                        msg: "Sign Doc fail"
                    });
                }
            } catch (err) {

                return this.success({
                    code: 0,
                    msg: "Sign Doc error"
                });
            }
        }


        async getUserStatus() {
            let body = this.ctx.request.body;
            const bodyRule = schema({
                driver_id: {
                    type: 'string',
                    required: true
                }
            });
            let errors = bodyRule.validate(body);
            if (errors[0]) {
                return this.success({
                    code: 10,
                    msg: "invalid request parameters",
                    data: null
                })
            }

            try {
                let resultData = await  this.ctx.model.MedicalRecord.findOne({ driver_id: body.driver_id }, { driver_status: 1 });
                if (resultData) {
                    return this.success({
                        code: 1,
                        msg: "get user status success",
                        data: {
                            status: resultData.driver_status
                        }
                    });
                } else {
                    return this.success({
                        code: 100,
                        msg: "no such Patient",
                    });
                }
            } catch (err) {


                return this.success({
                    code: 0,
                    msg: "get user status error"
                });
            }
        }

        async changeStatus() {
            let body = this.ctx.request.body;
            const bodyRule = schema({
                driver_id: {
                    type: 'string',
                    required: true
                },
                status: {
                    type: 'number',
                    required: true
                },
            });
            let errors = bodyRule.validate(body);

            if (errors[0]) {
                return this.success({
                    code: 10,
                    msg: "invalid request parameters",
                    data: null
                })
            }

            try {
                let md = await  this.ctx.model.MedicalRecord.findOne({ driver_id: body.driver_id });
                md.set({
                    driver_status: body.status
                });
                let mdResult = await  md.save();

                let theCase = await  this.ctx.model.Case.findOne({ driver_id: body.driver_id });
                theCase.set({
                    driver_status: body.status
                });
                let caseResult = await  theCase.save();

                if (mdResult && caseResult) {
                    return this.success({
                        code: 1,
                        msg: "update status success"
                    });
                } else {
                    return this.success({
                        code: 100,
                        msg: "no such Patient",
                        data: null
                    });
                }
            } catch (err) {

                return this.success({
                    code: 0,
                    msg: "update status error"
                });
            }
        }

        async userSummaryJson() {
            let body = this.ctx.request.body;

            const bodyRule = {
                driver_id: "string",
                lang: "string"
            };

            try {
                this.ctx.validate(bodyRule, body);

            } catch (err) {
                return this.success({
                    code: 0,
                    msg: "invalid request parameters"
                })
            }

            try {
                let medicalRecordResult = undefined;

                if (body.lang === "cn") {
                    medicalRecordResult = await  this.ctx.model.MedicalRecord.findOne({ driver_id: body.driver_id }, { en: 0 });

                }

                if (body.lang === "en") {

                    medicalRecordResult = await  this.ctx.model.MedicalRecord.findOne({ driver_id: body.driver_id }, { en: 1, driver_id: 1, created_time: 1, update_time: 1, driver_status: 1 });

                }


                if (medicalRecordResult && (
                        (body.lang === "en" && medicalRecordResult.driver_status >= app.config.CONSTANT.ACTIVATION_STATUS.COMPLETED_SUMMARY_TRANSLATION) ||
                        (body.lang === "cn" && medicalRecordResult.driver_status >= app.config.CONSTANT.ACTIVATION_STATUS.CREATED_SUMMARY)
                    )) {
                    if (medicalRecordResult) {
                        medicalRecordResult.update_time = medicalRecordResult.created_time
                    }

                    return this.success({
                        code: 1,
                        msg: "get user summary json success",
                        data: {
                            driver_id: medicalRecordResult.driver_id,
                            updated_time: medicalRecordResult.update_time,
                            lang: body.lang,
                            report: (
                                body.lang === "cn" ? medicalRecordResult : medicalRecordResult.en
                            )
                        }
                    });
                } else {
                    return this.success({
                        code: 100,
                        msg: "no such Patient",
                        data: null
                    });
                }
            } catch (err) {
                this.ctx.logger.error('get userSummaryJson data: %j', this.ctx.request.body, err);
                return this.success({
                    code: 0,
                    msg: "get user summary json error"
                });
            }
        }


        async userSummaryFile() {
            let body = this.ctx.request.body;

            const bodyRule = {
                driver_id: "string",
                lang: "string"
            };

            try {
                this.ctx.validate(bodyRule, body);

            } catch (err) {
                return this.success({
                    code: 0,
                    msg: "invalid request parameters"
                })
            }

            try {

                const res = await  this.ctx.curl(app.config.CONSTANT.URLS.GETREPRTURL + body.driver_id + '/' + body.lang, {
                    method: 'GET',
                    rejectUnauthorized: false
                });

                let medicalRecordResult = await  this.ctx.model.MedicalRecord.findOne({ driver_id: body.driver_id }, { driver_id: 1, update_time: 1 });
                if (!medicalRecordResult || (
                        (body.lang === "en" && medicalRecordResult.driver_status < app.config.CONSTANT.ACTIVATION_STATUS.COMPLETED_SUMMARY_TRANSLATION) ||
                        (body.lang === "cn" && medicalRecordResult.driver_status < app.config.CONSTANT.ACTIVATION_STATUS.CREATED_SUMMARY)
                    )) {
                    return this.success({
                        code: 100,
                        msg: "no such Patient",
                        data: null
                    });
                }

                let html = res.data.toString();
                let pdfData = await  this.csService.printPDf(html, body.lang);

                if (pdfData) {

                    let fileUrl = pdfData.cnReportfileurl;
                    if (body.lang === "en") {
                        fileUrl = pdfData.enReportfileurl
                    }

                    return this.success({
                        code: 1,
                        msg: "get user summary file success",
                        data: {
                            driver_id: medicalRecordResult.driver_id,
                            updated_time: medicalRecordResult.update_time,
                            lang: body.lang,
                            file: fileUrl
                        }
                    });
                } else {
                    return this.success({
                        code: 0,
                        msg: "get user summary file error"
                    });
                }
            } catch (err) {
                this.ctx.logger.error('get userSummaryFile data: %j', this.ctx.request.body, err);

                return this.success({
                    code: 0,
                    msg: "get user summary file  error"
                });
            }
        }

        
        async plandTrialJson() {
            let body = this.ctx.request.body;
            const bodyRule = schema({
                driver_id: {
                    type: 'string',
                    required: true
                },
                lang: {
                    type: 'string',
                    required: true
                }
            });
            let errors = bodyRule.validate(body);
            if (errors[0] || !body.lang.match(/en|cn/ig)) {
                return this.success({
                    code: 10,
                    msg: "invalid request parameters",
                    data: null
                })
            }


            try {
                let caseReport = await  this.ctx.model.CaseReport.findOne({ driver_id: body.driver_id });

                if (caseReport && (
                        (body.lang === "en" && caseReport.driver_status >= app.config.CONSTANT.ACTIVATION_STATUS.COMPLETED_TRIAL_TRANSLATION) ||
                        (body.lang === "cn" && caseReport.driver_status >= app.config.CONSTANT.ACTIVATION_STATUS.READY_FOR_TRIAL_TRANSLATION)
                    )) {
                    return this.success({
                        code: 1,
                        msg: "get pland trial json success",
                        data: {
                            driver_id: caseReport.driver_id,
                            updated_time: caseReport.update_time,
                            lang: body.lang,
                            report: (
                                body.lang === "cn" ? caseReport.trialGroupsCN : caseReport.trialGroups
                            )
                        }
                    });
                } else {
                    return this.success({
                        code: 100,
                        msg: "no pland trial",
                        data: null
                    });
                }
            } catch (err) {
                console.log('get user pland trial json err: %j', err);
                return this.success({
                    code: 0,
                    msg: "get pland trial json error",
                    data: null
                });
            }
        }


        async plandTrialFile() {
            let body = this.ctx.request.body;

            const bodyRule = {
                driver_id: "string",
                lang: "string"
            };

            try {
                this.ctx.validate(bodyRule, body);

            } catch (err) {
                return this.success({
                    code: 0,
                    msg: "invalid request parameters"
                })
            }

            try {
                let medicalRecordResult = await  this.ctx.model.MedicalRecord.findOne({ driver_id: body.driver_id }, { driver_id: 1, update_time: 1 });

                let url = app.config.CONSTANT.URLS.GETREPRTURL + body.driver_id + '/' + body.lang + "?file=report";
                console.log(url)
                const res = await  this.ctx.curl(url, {
                    method: 'GET',
                    rejectUnauthorized: false
                });


                if (!medicalRecordResult || (
                        (body.lang === "en" && medicalRecordResult.driver_status < app.config.CONSTANT.ACTIVATION_STATUS.COMPLETED_SUMMARY_TRANSLATION) ||
                        (body.lang === "cn" && medicalRecordResult.driver_status < app.config.CONSTANT.ACTIVATION_STATUS.CREATED_SUMMARY)
                    )) {
                    return this.success({
                        code: 100,
                        msg: "no such Patient",
                        data: null
                    });
                }

                let html = res.data.toString();
                let pdfData = await  this.csService.printPDf(html, body.lang);

                if (pdfData) {

                    let fileUrl = pdfData.cnReportfileurl;
                    if (body.lang === "en") {
                        fileUrl = pdfData.enReportfileurl
                    }

                    return this.success({
                        code: 1,
                        msg: "get trial file success",
                        data: {
                            driver_id: medicalRecordResult.driver_id,
                            updated_time: medicalRecordResult.update_time,
                            lang: body.lang,
                            file: fileUrl
                        }
                    });
                } else {
                    return this.success({
                        code: 0,
                        msg: "get trial file error"
                    });
                }
            } catch (err) {
                this.ctx.logger.error('get trial data: %j', this.ctx.request.body, err);

                return this.success({
                    code: 0,
                    msg: "get trial file  error"
                });
            }
        }
    }
    return driverController;
};