'use strict';
var request = require('request');
var WXBizMsgCrypt = require('wechat-crypto');
var crypto = require('crypto');
var parser = require("xml2json");


var config = {

    // 米茶健康
    token: 'michahealth',
    appid: 'wx79eaf33ec41ba6a8',
    encodingAESKey: '3iyqjJ3c2aX7fnENZG4VNBBe5fMRrUsXjcTuC6tTS4x',
    appSecret: 'cf0a83a9d0a5a17afc004217e9cdbace',

    // 小肿瘤知道
    // token: 'zlzhidaotest',
    // appid: 'wx064c32c2931490aa',
    // mch_id: '1377389402',
    // encodingAESKey: '3iyqjJ3c2aX7fnENZG4VNBBe5fMRrUsXjcTuC6tTS4x',
    // payApiKey: 'JCJSBQSXK44HF6B8XP2XQ7AHQ36H6T7G',
    // appSecret: '707231ec2de2ab7d4a1b56e31b12dc1e',

    // 某公众号
    // appid: 'wx68451915b0affd17',
    // mch_id: '1446561402',
    // encodingAESKey: 'EbJG23WzxpCfCq8lpTUIxXAXeS4GHRwYyZVA8oDsFih',
    // payApiKey: 'JCJSBQSXK44HF6B8XP2XQ7AHQ36H6T7G',
    // appSecret: 'ef502e162c19307b69a6f10b3a4ffdcb',


    grant_type: 'client_credential',
    accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token', //获取token
    oauth2AccessTokenUrl: 'https://api.weixin.qq.com/sns/oauth2/access_token', //获取token
    accessTagsUrl: 'https://api.weixin.qq.com/cgi-bin/tags/get', //获取tags列表
    ticketUrl: 'https://api.weixin.qq.com/cgi-bin/ticket/getticket', //获取jsapi_ticket
    batchtaggingUrl: 'https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging', //给用户批量打标签
    createTagUrl: 'https://api.weixin.qq.com/cgi-bin/tags/create', //给用户打标签
    batchget_material: 'https://api.weixin.qq.com/cgi-bin/material/batchget_material', //获取永久素材
    add_news: 'https://api.weixin.qq.com/cgi-bin/material/add_news', //新增永久素材
    update_news: 'https://api.weixin.qq.com/cgi-bin/material/update_news', //修改永久素材
    getUserInfoUrl: 'https://api.weixin.qq.com/cgi-bin/user/info', //根据openid获取用户信息url
    downloadUrl: 'http://file.api.weixin.qq.com/cgi-bin/media/get', //下载
    unifiedorderUrl: 'https://api.mch.weixin.qq.com/pay/unifiedorder', //统一下单
    orderqueryUrl: 'https://api.mch.weixin.qq.com/pay/orderquery', //查询订单
    createQrcode: 'https://api.weixin.qq.com/cgi-bin/qrcode/create', //生成二维码ticket
    showQrcode: 'https://mp.weixin.qq.com/cgi-bin/showqrcode', //展示二维码
    cache_duration: 1000 * 60 * 60 * 24,
    checkSignature: false
};



function getSignature(timestamp, nonce, encrypt) {
    var shasum = crypto.createHash('sha1');
    var arr = [this.token, timestamp, nonce, encrypt].sort();
    shasum.update(arr.join(''));

    return shasum.digest('hex');
};
var checkSignature = function(query, token) {
    var signature = query.signature;
    var timestamp = query.timestamp;
    var nonce = query.nonce;

    var shasum = crypto.createHash('sha1');
    var arr = [token, timestamp, nonce].sort();
    shasum.update(arr.join(''));
    var _signature = shasum.digest('hex');
    console.log(_signature)

    return _signature === signature;
};

checkSignature({
    signature: "f20c871037b573551ef2c0fea3196bad5c3d45e0",
    nonce: "315820554",
    timestamp: "1471836867",
}, "devzlzhidaotoken")


var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.appid);

//发送消息事件
function getMsgXML(openid, text) {
    var msg = '<xml><ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName>\n<FromUserName><![CDATA[' + openid + ']]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[text]]></MsgType>\n<Content><![CDATA[ ' + text + ']]></Content>\n<MsgId>6321491209218392426</MsgId>\n</xml>';
    return msg;
}

var textUrl = '';

function getEventKey(openid, event, enentkey) {
    var xml = getEventKeyXML(openid, event, enentkey);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=' + openid + '&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}

function getEventKeyXML(openid, event, enentkey) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[' + openid + ']]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA[' + event + ']]></Event>\n<EventKey><![CDATA[' + enentkey + ']]></EventKey> </xml>';
}



//发送文字最终post数据
function getPostMsg(openid, text, source) {
    var xml = getMsgXML(openid, text);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);


    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    // textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=ojUvl5RVgau8DQfPfZ6rlp8Q-Uy8&encrypt_type=aes&msg_signature=' + msg_sign;
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=123&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}

function sendText() {

    const openid = 'ojUvl5RVgau8DQfPfZ6rlp8Q-Uy8'; // Yang

    const text = process.argv[2] ||  'hello at：' + new Date().toISOString().split('T')[0];

    var postParameter = getPostMsg(openid, text);
    var url = "https://127.0.0.1:7073" + postParameter.url;
    request({
            url: url,
            body: postParameter.body,
            method: "post",
            headers: { 'Content-Type': 'text/xml' },
            "rejectUnauthorized": false
        },
        function(error, response, body) {
            console.log(response.body);
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
}

function sendQtcText() {

    const openid = 'ojUvl5RVgau8DQfPfZ6rlp8-0352'; // Yang

    const text = process.argv[2] ||  new Date().toISOString().split('T')[0];

    var postParameter = getPostMsg(openid, text);
    var url = "https://127.0.0.1:7073" + postParameter.url;
    request({
            url: url,
            body: postParameter.body,
            method: "post",
            headers: { 'Content-Type': 'text/xml' },
            "rejectUnauthorized": false
        },
        function(error, response, body) {
            console.log(response.body);
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
}

function sendQtcEventKey(){
    const openid = 'ojUvl5RVgau8DQfPfZ6rlp8-0352'; // Yang

    var postParameter = getEventKey(openid, "CLICK","insurance");

    var url = "https://localhost:7073"+postParameter.url;
    request(
        {url:url,
            body : postParameter.body,
            method:"post",
            headers: {'Content-Type': 'text/xml'},
            "rejectUnauthorized": false
        },
        function (error, response, body) {
            console.log(error);
            // console.log(response);
            // console.log(body);
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
}


sendQtcText();
// sendQtcEventKey()