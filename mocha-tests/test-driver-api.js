const request = require("request");

let host = 'http://127.0.0.1:3000'
//let host = 'https://driver.qtclinics.com'

// '/driver/user/create'
/*request({
    url: host + "/driver/user/create",
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: '1005',
        created_time: new Date().getTime(),
        name: '梁杰亨',
        phone: '18621601671',
        gov_id: '450001198508260000',
        birthday: 496512000000,
        gender: 2,
        trade: {
            id: '2017110200000001',
            createTime: new Date().getTime(),
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
    })
}, function(err, res, body) {
    console.log(err, JSON.parse(body))
});*/

// '/driver/user/update'
/*
request({
    url: host + "/driver/user/update",
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: "1005",
        phone: "10086",
        gov_id: "360702"

    })
}, function(err, res, body) {
    console.log(err);
    console.log(body);
});
*/

// '/driver/user/signdoc'
/*
request({
    url: host + "/driver/user/signdoc",
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: "1005"

    })
}, function(err, res, body) {
    console.log(err)
    console.log(body)
});
*/

// '/driver/user/record/status'
/*
request({
    url: host + '/driver/user/record/status',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: "1005"

    })
}, function(err, res, body) {
    console.log(err)
    console.log(body)
});
*/


// 'driver/pland/active/status'
/*
request({
    url: host + '/driver/pland/active/status',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: "1005"

    })
}, function(err, res, body) {
    console.log(err)
    console.log(body)
});
*/

// driver/pland/active/change
/*
 request({
    url: host + '/driver/pland/active/change',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: "1005",
        status: 300

    })
}, function(err, res, body) {
    console.log(err)
    console.log(body)
});
*/


// '/driver/user/summary/json'
/*request({
    url: host + '/driver/user/summary/json',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: "1003",
        lang: "en"
    })
}, function(err, res, body) {
    console.log(err)
    console.log(body)
});*/

/* request({
    url: host + '/driver/user/summary/json',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: "string",
        lang: "en"
    })
}, function(err, res, body) {
    console.log(err)
    console.log(body)
}); */
// '/driver/user/summary/file'
/* request({
    url: host + '/driver/user/summary/file',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: "1003",
        lang: "cn"
    })
}, function(err, res, body) {
    console.log(err, body)
});*/



// pland/trial/json
/*request({
    url: host + '/driver/pland/trial/json',
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
        driver_id: "1003",
        lang: "cn"
    })
}, function(err, res, body) {
    console.log(err)
    console.log(body)
});*/
//  request({
//     url: host + '/driver/pland/trial/file',
//     method: 'POST',
//     headers: { 'content-type': 'application/json' },
//     body: JSON.stringify({
//         driver_id: "1003",
//         lang: "en"
//     })
// }, function(err, res, body) {
//     console.log(err)
//     console.log(body)
// });
/*
return false;
request({
    url: "http://wxproxy.magicfish.cn/weixin/token",
    method: 'get',
    headers: { "WX-Proxy-Pass": "magicFish@SH2017" }
}, function(err, res, body) {
    console.log(err)
    console.log(body)
});
return false;

*/