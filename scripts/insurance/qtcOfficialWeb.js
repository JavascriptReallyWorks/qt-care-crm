const Request = require('supertest');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBsaWNhbnRQaG9uZSI6IjE4Mjk2ODYxNjE2IiwiaWF0IjoxNTQxMzc0ODEyfQ.WgHEkDv9rkFdy_JKWugYOJy-iIzSJ9sZen2cbgd0MoQ'

const sendCode = () => {
  let request = Request('https://crm-care.qtclinics.com');
  // let request = Request('http://127.0.0.1:7073');
  request
    .get('/api/qtcWeb/sendCode/18296861616')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
        console.log(err);
        console.log(res.status);
    });
};


const qtcWebLogin = () => {
  let request = Request('https://crm-care.qtclinics.com');
  // let request = Request('http://127.0.0.1:7073');
  request
    .post('/api/qtcWeb/login')
    .send({
      phone:'18296861616',
      code:'3473',
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
        console.log(err);
        console.log(res.body);
    });
};

// 保险会员会员登录
const getOrder = () => {    
  let request = Request('https://crm-care.qtclinics.com');
  // let request = Request('http://127.0.0.1:7073');
  request
    .get(encodeURI('/api/insurance/getOrder?IDType=身份证&IDNumber=360702198903250019&mobile=18296861616&verifyCode=6628'))
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
        console.log(err);
        console.log(res.body);
    });
}

const getUserOrders = () => {
  let request = Request('https://crm-care.qtclinics.com');
  // let request = Request('http://127.0.0.1:7073');
  request
    .get('/api/insurance/getUserOrders')
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
        console.log(err);
        console.log(res.body);
    });
}

const getOrderById= () => { 
  let request = Request('https://crm-care.qtclinics.com');
  // let request = Request('http://127.0.0.1:7073');
  request
    .get('/api/insurance/getOrderById/v789789789')
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (err, res) {
        console.log(err);
        console.log(res.body);
        console.log(res.body.data.payload);
    });
}

sendCode();
// qtcWebLogin();
// getOrder();
// getUserOrders();
// getOrderById()