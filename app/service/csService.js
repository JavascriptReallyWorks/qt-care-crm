'use strict';

let mongoose = require('mongoose'); //var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');
let pdf = require('html-pdf');
let path = require('path');

module.exports = app => {
    class Cs extends app.Service {
        async queryMedicalRecords(cond, page, limit) {
            const {ctx} = this;
            let count = await ctx.model.MedicalRecord.count(cond);
            if (count < limit * (page - 1)) page = 1;
            let include = {
                createdAt: 1,
                patientName: 1,
                presentDiagnosis: 1,
                patientBirthday: 1,
                translated:1,
                summaryCnOssKey:1,
                summaryEnOssKey:1,
            };
            let docs = await ctx.model.MedicalRecord.find(cond, include).skip(limit * (page - 1)).limit(limit).sort({
                createdAt: -1
            }).lean();

            let promises = [];
            docs.forEach(doc => {
                promises.push(new Promise(function (resolve, reject) {
                    ctx.model.Case.find({
                        medical_record_id:doc._id.toString()
                    },{
                        sid:1
                    }).then(cases => {
                        doc.cases = cases;
                        resolve();
                    });
                }));
            });
            await Promise.all(promises);
            if (docs)
                return { rows: docs, total: count };
            else
                return null;
        }


        async queryCases(cond, page, limit) {
            let count = await  this.ctx.model.Case.count(cond);
            if (count < limit * (page - 1)) page = 1;
            let docs = await  this.ctx.model.Case.find(cond).skip(limit * (page - 1)).limit(limit).sort({ sid: -1});
            if (docs)
                return { rows: docs, total: count };
            else
                return null;
        }


        async queryProducts(cond, page, limit) {
            let count = await  this.ctx.model.Product.count(cond);
            if (count < limit * (page - 1)) page = 1;
            let docs = await  this.ctx.model.Product.find(cond, { content: 0 }).skip(limit * (page - 1)).limit(limit).sort({ top: -1, update_time: -1 });
            if (docs)
                return { rows: docs, total: count };
            else
                return null;
        }


        async saveProductReport(report, status) {
            let newCaseReport = await  this.ctx.model.CaseReport.updateOne({
                product_id: report.product_id,
                case_id: report.case_id
            }, {
                $set: report
            }, {
                new: true
            });
            if (newCaseReport) {
                let newCase = await  this.ctx.model.Case.updateOne({
                    _id: mongoose.Types.ObjectId(report.case_id),
                    products: { $elemMatch: { _id: mongoose.Types.ObjectId(report.product_id) } }
                }, {
                    $set: { "products.$.status": status }
                }, {
                    new: true
                });
                if (newCase) {
                    return { status: 'ok' }
                } else {
                    return { status: 'no' }
                }
            } else {
                return { status: 'no' }
            }
        }


        async changeReportStatus(case_id, product_id, status) {
            let newCase = await  this.ctx.model.Case.updateOne({
                _id: mongoose.Types.ObjectId(case_id),
                products: { $elemMatch: { _id: mongoose.Types.ObjectId(product_id) } }
            }, {
                $set: { "products.$.status": status }
            }, {
                new: true
            });
            if (newCase) {
                // 检查是否所有product状态都为已审核, 是的话将case状态改为 TO_EVALUATE
                let theCase = await  this.ctx.model.Case.findById(case_id);
                let allChecked = true;
                for (let i = 0; i < theCase.products.length; i++) {
                    let product = theCase.products[i];
                    if (!product.status || product.status !== app.config.CONSTANT.CASE_REPORT.STATUS.CHECKED) {
                        allChecked = false;
                        break;
                    }
                }
                if (!allChecked) {
                    return { status: 'ok' }
                } else {
                    theCase.status = app.config.CONSTANT.CASE.STATUS.TO_EVALUATE;
                    var res = await  theCase.save();
                    if (res)
                        return { status: 'ok' }
                    else
                        return { status: 'no' }

                }
            } else {
                return { status: 'no' }
            }

        }


        async printPDf(html, lang) {

            let pdfconf = {
                // Export options
                "directory": "./app/public/resource/download", // The directory the file gets written into if not using .toFile(filename, callback). default: '/tmp'

                // "viewportSize":{ width: "210mm", height: "297mm" },
                // Papersize Options: http://phantomjs.org/api/webpage/property/paper-size.html
                "height": "297mm", // allowed units: mm, cm, in, px
                "width": "210mm", // allowed units: mm, cm, in, px
                "format": "A4", // allowed units: A3, A4, A5, Legal, Letter, Tabloid
                "orientation": "portrait", // portrait or landscape

                // Page options
                "border": 0,
                /*{
                    "top": "0.4in",            // default is 0, units: mm, cm, in, px
                    "right": "0.5in",
                    "bottom": "0.3in",
                    "left": "0.5in"
                },*/

                "header": {
                    "height": "20mm",
                    "contents": {
                        // 1: '&nbsp;',
                        // 2: '<div class="pageHeader-top-head"><img src="https://www.zlzhidao.com/img/print/logo-white.png"></div>',
                        // 3: '<div style="height: 12mm;background-color: #60bbc2;border-radius: 0 0 90% 90% / 0 0 70% 70%;line-height: 0.4in;text-align: center;color: #fff;">肿瘤知道</div>', // fallback value
                        // 4: '<div style="height: 012mm;background-color: #60bbc2;border-radius: 0 0 90% 90% / 0 0 70% 70%;line-height: 0.4in;text-align: center;color: #fff;">肿瘤知道</div>', // fallback value
                        // default: '<div style="height: 12mm;background-color: #60bbc2;border-radius: 0 0 90% 90% / 0 0 70% 70%;line-height: 0.4in;text-align: center;color: #fff;">肿瘤知道</div>', // fallback value
                    }
                },
                "footer": {
                    "height": "16mm",
                    // "contents": {
                    //     1: '&nbsp;',
                    //     2: '&nbsp;',
                    //     default: '<div class="footer"><div class="footer-inner">' +
                    //     '{{page}}/{{pages}}' +
                    //     '<div class="f-right">' +
                    //     ' <span id="abc_html"></span>' +
                    //     '</div>' +
                    //     '</div>' +
                    //     '</div>'
                    //     // last: 'Last Page'
                    // }
                },


                "base": 'file://' + path.resolve('./app/public/'), // Base path that's used to load files (images, css, js) when they aren't referenced using a host

                // Zooming option, can be used to scale images if `options.type` is not pdf
                // "zoomFactor": "1", // default is 1

                // File options
                "type": "pdf", // allowed file types: png, jpeg, pdf
                // "quality": "100",           // only used for types png & jpeg

                // Script options
                "phantomPath": "./node_modules/phantomjs/bin/phantomjs", // PhantomJS binary which should get downloaded automatically
                // "phantomArgs": [], // array of strings used as phantomjs args e.g. ["--ignore-ssl-errors=yes"]
                // "script": './public',           // Absolute path to a custom phantomjs script, use the file in lib/scripts as example
                "timeout": 600000, // Timeout that will cancel phantomjs, in milliseconds

                // HTTP Headers that are used for requests
                "httpHeaders": {
                    // e.g.
                    "Authorization": "www.zlzhidao.com"
                }
            };

            const { ctx, service } = this;
            let filename = 'pdf-' + (new Date().getTime()) + "-" + (lang || '') + '.pdf';


            try {
                return new Promise(function(resolve, reject) {
                    pdf.create(html, pdfconf).toFile("app/public/build/pdf/" + filename, function(err, pdfres) {
                        if (err) {
                            resolve({
                                success: false
                            })
                        } else {

                            ctx.service.uploadService.uploadPdfReport("app/public/build/pdf/", filename, function(data) {

                                let rsData = {
                                    success: true,
                                    filename: 'pdf/' + filename,
                                    ossFileKey:data.ossFileKey
                                };
                                if (lang === "cn") {
                                    rsData.cnReportfileurl = data.url
                                }
                                if (lang === "en") {
                                    rsData.enReportfileurl = data.url
                                }

                                resolve(rsData)
                            });


                        }

                    });
                });
            } catch (e) {
                console.log("catch")
                console.log(e)
            }
        };

        sortMedical(md){
            if(md.treatmentHistory && md.treatmentHistory.length > 0){
                md.treatmentHistory.sort( (a,b)=>{
                    if(a.date && b.date){
                        if(a.date > b.date){
                            return 1;
                        }else{
                            return -1;
                        }
                    }else{
                        return 0;
                    }
                })
            }
            if(md.currentMedications && md.currentMedications.length > 0){
                md.currentMedications.sort( (a,b)=>{
                    if(a.startDate && b.startDate){
                        if(a.startDate > b.startDate){
                            return 1;
                        }else{
                            return -1;
                        }
                    }else{
                        return 0;
                    }
                })
            }
            return md;
        };

        parseMdFromWechat(md){
            let result = {};
            md.openid && (result.openid = md.openid);
            md.userid && (result.userid = md.userid);
            md.create_time && (result.createTime = md.create_time);
            md.patient_name && (result.patientName = md.patient_name);
            md.patient_birthday && (result.patientBirthday = md.patient_birthday);
            md.patient_address && (result.patientAddress = md.patient_address);
            md.patient_mobile && (result.patientMobile = md.patient_mobile);
            result.presentDiagnosis = {
                cancerType: md.patient_disease || '',
                stage: md.disease_staging || '',
                diagnosisMethod: '',
                diagnosisDate: null,
                source: '患者报告',
            };

            result.briefTreatment = {
                description: md.treatment_history ? (md.treatment_history.join(',') + (md.treatment_history_other ? (',' + md.treatment_history_other):'')) : '',
                source: '患者报告'
            };


            return result;
        };
    }
    return Cs;
};
