'use strict';
var request = require('request');
var WXBizMsgCrypt = require('wechat-crypto');
var crypto = require('crypto');
var parser = require("xml2json");

const mock = require('egg-mock');
var config = {
    token: 'zlzhidaotest',
    appid: 'wx064c32c2931490aa',
    mch_id: '1377389402',
    encodingAESKey: '3iyqjJ3c2aX7fnENZG4VNBBe5fMRrUsXjcTuC6tTS4x',
    payApiKey: 'JCJSBQSXK44HF6B8XP2XQ7AHQ36H6T7G',
    appSecret: '707231ec2de2ab7d4a1b56e31b12dc1e',
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
};;

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
function getMsgXML() {
    var openid = 'test_openid_' + Date.now().toString().substr(-4);
    var text = '客户消息：' + Date.now().toString().substr(-2);
    var msg = '<xml><ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName>\n<FromUserName><![CDATA[' + openid + ']]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[text]]></MsgType>\n<Content><![CDATA[ ' + text + ']]></Content>\n<MsgId>6321491209218392426</MsgId>\n</xml>';
    return msg;
}

//发送消息事件
function getVoiceMsgXML(text) {
    var msg = '<xml><ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName>\n<FromUserName><![CDATA[ow-p8wL8rO3jj0Q2YMngZIfSpM98]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[voice]]></MsgType>\n<Recognition><![CDATA[ ' + text + ']]></Recognition>\n<MediaId>8O1kQvsjVGmz_XjTQN21WfFjUqqPIRWl01LIEpHRsv9p5IEQlK2a1It2v4sp_eBD</MediaId>\n</xml>';
    return msg;
}


function getSubscribeXML(event) {
    return '<xml><ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName>\n<FromUserName><![CDATA[ow-p8wL8rO3jj0Q2YMngZIfSpM98]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA[' + event + ']]></Event>\n</xml>';
}

function getEventKeyXMl(event, enentkey) {
    return '<xml><ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName>\n<FromUserName><![CDATA[ow-p8wL8rO3jj0Q2YMngZIfSpM98]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA[' + event + ']]></Event>\n<EventKey><![CDATA[' + enentkey + ']]></EventKey> </xml>';
}

function getEventXML(event) {
    return '<xml><ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName>\n<FromUserName><![CDATA[ow-p8wL8rO3jj0Q2YMngZIfSpM98]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA[' + event + ']]></Event>\n<EventKey><![CDATA[]]></EventKey> </xml>';
}

function getImageXml(eventType) {
    return '<xml><ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName><FromUserName><![CDATA[ow-p8wL8rO3jj0Q2YMngZIfSpM98]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[image]]></MsgType><PicUrl><![CDATA[https://img.wdstatic.cn/console/images/logo-632b60596e.svg]]></PicUrl><MediaId><![CDATA[IKaxQF3GU3-CILhZS5pxOqouvpmpN-nH4jFTYbgO99p0GZxi_huATuu1GTPplxsp]]></MediaId><MsgId>6480733435454799132</MsgId></xml>';
}

var textUrl = '';

//发送文字最终post数据
function getPostMsg() {
    var xml = getMsgXML();
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);


    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=ow-p8wL8rO3jj0Q2YMngZIfSpM98&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}

//发送语音
function getPostVoiceMsg(text) {
    console.log(text)
    var xml = getVoiceMsgXML(text);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);


    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=ow-p8wL8rO3jj0Q2YMngZIfSpM98&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}

//事件最终post数据
function getSubscribePostXML(type) {
    var xml = getSubscribeXML(type);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=ow-p8wL8rO3jj0Q2YMngZIfSpM98&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}


//事件最终post数据
function getEventKeyXML(event, enentkey) {
    var xml = getEventKeyXMl(event, enentkey);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=ow-p8wL8rO3jj0Q2YMngZIfSpM98&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}


//事件最终post数据
function getEvent(event) {
    var xml = getEventXML(event);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=ow-p8wL8rO3jj0Q2YMngZIfSpM98&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}

//图片
function getImagePost(type) {
    var xml = getImageXml();
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=ow-p8wL8rO3jj0Q2YMngZIfSpM98&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}

//从返回的xml中获取text数据
function getStringData(res) {
    var xml = res.text;
    var json = parser.toJson(xml, { object: true });
    var Encrypt = json.xml.Encrypt;
    var result = cryptor.decrypt(Encrypt);
    return result.message;
}

function sendText() {

    var postParameter = getPostMsg();

    var url = "http://127.0.0.1:7072" + postParameter.url;

    request({
            url: url,
            body: postParameter.body,
            method: "post",
            headers: { 'Content-Type': 'text/xml' },
            "rejectUnauthorized": false
        },
        function(error, response, body) {
            // console.log(error);
            // console.log(response);
            // console.log(body);
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
}

sendText();

// return false;

// var postParameter = getPostVoiceMsg("subscribe");
// var postParameter = getImagePost("subscribe");
//
// var url = "https://127.0.0.1:7072" + postParameter.url;
// request({
//         url: url,
//         body: postParameter.body,
//         method: "post",
//         headers: { 'Content-Type': 'text/xml' },
//         "rejectUnauthorized": false
//     },
//     function(error, response, body) {
//         console.log("error", error);
//         console.log("body", body)
//             // console.log(response);
//             // console.log(body);
//         if (!error && response.statusCode == 200) {
//             console.log(body)
//         }
//     }
// )
