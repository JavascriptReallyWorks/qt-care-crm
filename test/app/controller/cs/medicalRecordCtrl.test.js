const mock = require('egg-mock');
const assert = require('assert');
const request = require('supertest');


const mockUser = {
    _id:'59ee8103534dc8bfe350941c',
    "name" : "cat",
    "nickname" : "cat",
    "crm_role" : "qt_cs",
    "crm_admin" : true,
    "user_type" : "crm"
};

describe('medicalRecordCtrl integration test', () => {

    let app,ctx,constant;
    before(() => {
        app = mock.app();
        return app.ready();
    });
    beforeEach(() => {
        ctx = app.mockContext({
            user: mockUser
        });
    });
    // afterEach(mock.restore);


    it('medicalRecordCtrl.queryAllMedicalRecordByOpenId', function (done) {
        ctx.model.MedicalRecord.findOne().exec().then(function (medicalRecord) {
            let cond = {
                openid:medicalRecord.openid
            };

            request(app.callback())
                .post('/cs/mdr/findMedicalRecord')
                .send(cond)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert(Array.isArray(res.body.content));
                    assert(res.body.content.length > 0);
                    done();
                });
        });
    });

    it('medicalRecordCtrl.queryAllMedicalRecordById,  return array', function * () {
        let medicalRecord  = yield ctx.model.MedicalRecord.findOne();
        let cond = {
            id:medicalRecord._id.toString()
        };

        let res = yield app.httpRequest()
            .post('/cs/mdr/findMedicalRecordOfId')
            .send(cond)
            .expect(200)
            .expect('Content-Type', /json/);

        let medicalRecordArr = res.body.content;
        assert(Array.isArray(medicalRecordArr));
        assert(medicalRecordArr.length === 1);
        assert.equal(medicalRecordArr[0]._id.toString(), cond.id.toString());
    });


    it('medicalRecordCtrl.queryMedicalRecords', function (done) {
        let cond = {
            page:1,
            pageSize:1
        };

        request(app.callback())
            .post('/cs/mdr/queryMedicalRecords')
            .send({cond:cond})
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                let data = res.body.content;
                assert(data.rows);
                assert(data.total);
                done();
            });
    });


    it('medicalRecordCtrl.updateMedicalRecord, create new medicalRecord', function (done) {
        const newMedicalRecord = {
            openid: Date.now().toString(),
            patientName: 'testName',
            patientGender: 'testGender',
            patientWeight: [
                {
                    value:'51Kg',
                    date:new Date(),
                    source:'患者报告'
                },
                {
                    value:'52Kg',
                    date:new Date(),
                    source:'患者报告'
                }
            ],
            patientHeight: {
                value:'180cm',
                date:new Date(),
                source:'患者报告'
            },
        };

        let body = {
            medicalRecord:newMedicalRecord
        };

        request(app.callback())
            .post('/cs/mdr/updateMedicalRecord')
            .send(body)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                assert(res.body.status === 'ok');

                ctx.model.MedicalRecord.findOne({openid:newMedicalRecord.openid}).exec().then(function (medicalRecord) {

                    assert.equal(newMedicalRecord.openid, medicalRecord.openid);
                    assert.equal(newMedicalRecord.patientGender, medicalRecord.patientGender);
                    assert.equal(newMedicalRecord.patientName, medicalRecord.patientName);
                    assert.equal(newMedicalRecord.patientWeight[0].value, medicalRecord.patientWeight[0].value);
                    assert.equal(newMedicalRecord.patientHeight.value, medicalRecord.patientHeight.value);

                    ctx.model.MedicalRecord.remove({openid:newMedicalRecord.openid}).exec().then(function (res) {
                        done();
                    });

                });
            });
    });


    it('medicalRecordCtrl.updateMedicalRecord, update old medicalRecord', function (done) {
        ctx.model.MedicalRecord.findOne().exec().then(function (oldMedicalRecord) {
            let update = {
                patientName:Date.now().toString()
            };

            let body = {
                id:oldMedicalRecord._id.toString(),
                medicalRecord:update
            };

            request(app.callback())
                .post('/cs/mdr/updateMedicalRecord')
                .send(body)
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) return done(err);
                    assert(res.body.status === 'ok');

                    ctx.model.MedicalRecord.findById(oldMedicalRecord._id).exec().then(function (newMedicalRecord) {
                        assert.equal(newMedicalRecord.patientName, update.patientName);
                        newMedicalRecord.patientName = oldMedicalRecord.patientName;
                        newMedicalRecord.save(function (err, updatedDoc) {
                            if(err)
                                done(err);
                            else
                                done();
                        })
                    });
                });
        })
    });



});


