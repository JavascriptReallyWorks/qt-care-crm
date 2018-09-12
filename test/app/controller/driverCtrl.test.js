const mock = require('egg-mock');
const assert = require('assert');


const mockUser = {
    _id:'59ee8103534dc8bfe350941c',
    "name" : "cat",
    "nickname" : "cat",
    "crm_role" : "qt_cs",
    "crm_admin" : true,
    "user_type" : "crm"
};

let newUser, newCase, newMD;

describe('driverCtrl integration test', () => {

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


    it("POST /localhost/driver/user/create  >>> driverCtrl.userCreate ", function * () {
        let params = {
            driver_id: '9999',
            created_time: Date.now(),
            name: 'Jay',
            phone: '18621601671',
            gov_id: '450001198508260000',
            birthday: 496512000000,
            gender: 2,
            trade: {
                id: '2017110200000001',
                createTime: Date.now(),
                products: [{
                    id: "pland",
                    subject: "PlanD 一年会员",
                    fee: 0.01
                }],
                fee: 0.01,
                buyer: {
                    wx_openid: 'oZksA0yO65ot7gn9Hkukzox6qTn0',
                    wx_unionid: 'oD1F4t6c2S5ygEMTkR77WQEpTo0M',
                    wx_name: 'haha'
                }
            }
        };

        let response = yield app.httpRequest()
            .post('/localhost/driver/user/create')
            .send(params)
            .expect(200)
            .expect('Content-Type', /json/);

        assert.equal(response.body.content.code, 1);


        newUser = (yield ctx.model.User.find().sort({_id:-1}).limit(1))[0];
        assert.equal(newUser.openid, params.trade.buyer.wx_openid);
        assert.equal(newUser.nickname, params.trade.buyer.wx_name);
        assert.equal(newUser.wx_unionid, params.trade.buyer.wx_unionid);

        newMD = (yield ctx.model.MedicalRecord.find().sort({_id:-1}).limit(1))[0];
        assert.equal(newMD.driver_id, params.driver_id);
        assert.equal(newMD.openid, params.trade.buyer.wx_openid);
        assert.equal(newMD.wx_openid, params.trade.buyer.wx_openid);
        assert.equal(newMD.order_id, params.trade.id);

        newCase = (yield ctx.model.Case.find().sort({_id:-1}).limit(1))[0];
        assert.equal(newCase.driver_id, params.driver_id);
        assert.equal(newCase.openid, params.trade.buyer.wx_openid);
        assert.equal(newCase.order_id, params.trade.id);
        assert.equal(newCase.medical_record_id, newMD._id);

    });

    it("POST /localhost/driver/user/update  >>> driverCtrl.userUpdate ", function * () {
        let params = {
            driver_id: newMD.driver_id,
            phone: "10086" + Date.now().toString(),
            gov_id: "12345" + Date.now().toString(),
        };

        let response = yield app.httpRequest()
            .post('/localhost/driver/user/update')
            .send(params)
            .expect(200)
            .expect('Content-Type', /json/);

        assert.equal(response.body.content.code, 1);

        let updatedMD = yield ctx.model.MedicalRecord.findOne({driver_id: newMD.driver_id});
        assert.equal(updatedMD.patientMobile, params.phone);
        assert.equal(updatedMD.gov_id, params.gov_id);
    });

    it("POST /localhost/driver/user/signdoc  >>> driverCtrl.userSigndoc ", function * () {
        let params = {
            driver_id: newMD.driver_id,
        };

        let response = yield app.httpRequest()
            .post('/localhost/driver/user/signdoc')
            .send(params)
            .expect(200)
            .expect('Content-Type', /json/);

        assert.equal(response.body.content.code, 1);

        let updatedMD = yield ctx.model.MedicalRecord.findOne({driver_id: newMD.driver_id});
        assert.equal(updatedMD.driver_status, app.config.CONSTANT.ACTIVATION_STATUS.READY_FOR_COLLECTION);
    });


    it("POST /localhost/driver/user/record/status  >>> driverCtrl.getUserStatus ", function * () {
        let params = {
            driver_id: newMD.driver_id,
        };

        let response = yield app.httpRequest()
            .post('/localhost/driver/user/record/status')
            .send(params)
            .expect(200)
            .expect('Content-Type', /json/);

        assert.equal(response.body.content.code, 1);
        assert.equal(response.body.content.data.status, app.config.CONSTANT.ACTIVATION_STATUS.READY_FOR_COLLECTION);
    });


    it("POST /localhost/driver/pland/active/status  >>> driverCtrl.getUserStatus ", function * () {
        let params = {
            driver_id: newMD.driver_id,
        };

        let response = yield app.httpRequest()
            .post('/localhost/driver/pland/active/status ')
            .send(params)
            .expect(200)
            .expect('Content-Type', /json/);

        assert.equal(response.body.content.code, 1);
        assert.equal(response.body.content.data.status, app.config.CONSTANT.ACTIVATION_STATUS.READY_FOR_COLLECTION);
    });

    it("POST /localhost/driver/pland/active/change  >>> driverCtrl.changeStatus ", function * () {
        let params = {
            driver_id: newMD.driver_id,
            status: 300
        };

        let response = yield app.httpRequest()
            .post('/localhost/driver/pland/active/change')
            .send(params)
            .expect(200)
            .expect('Content-Type', /json/);

        assert.equal(response.body.content.code, 1);

        let updatedMD = yield ctx.model.MedicalRecord.findOne({driver_id: newMD.driver_id});
        assert.equal(updatedMD.driver_status, params.status);
    });



    it("delete test data ", function * () {
        let newUserD = yield ctx.model.User.findByIdAndRemove(newUser._id);
        assert(newUserD);

        let newMDDelete = yield ctx.model.MedicalRecord.findByIdAndRemove(newMD._id);
        assert(newMDDelete);

        let newCaseD = yield ctx.model.Case.findByIdAndRemove(newCase._id);
        assert(newCaseD);
    });

});


