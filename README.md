QTC-Care 官网登录API


1.发送验证码

```js
let request = Request('https://crm-care.qtclinics.com');
request
  .get('/api/qtcWeb/sendCode/18296861616')
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function (err, res) {
      console.log(err);
  });
```


2.QTC会员登录 / 保险会员登录,  保留token

QTC会员登录

```js
let request = Request('https://crm-care.qtclinics.com');
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
```

保险会员登录

```js
let request = Request('https://crm-care.qtclinics.com');
request
  .get(encodeURI('/api/insurance/getOrder?IDType=身份证&IDNumber=360702198903250019&mobile=18296861616&verifyCode=6628'))
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function (err, res) {
      console.log(err);
      console.log(res.body);
  });
```


3.登录获得token以后， 调取用户所有的order id，

```js
let request = Request('https://crm-care.qtclinics.com');
request
  .get('/api/insurance/getUserOrders')
  .set('Authorization', `Bearer ${TOKEN}`)
  .expect(200)
  .expect('Content-Type', /json/)
  .end(function (err, res) {
      console.log(err);
      console.log(res.body);
  });
```

4.获得id以后，获取order详细信息

```js
let request = Request('https://crm-care.qtclinics.com');
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
```
