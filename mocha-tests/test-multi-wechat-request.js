'use strict';
var request = require('request');
var WXBizMsgCrypt = require('wechat-crypto');
var crypto = require('crypto');
var parser = require("xml2json");

const mock = require('egg-mock');
var config = {
    token: 'devzlzhidaotoken',
    appid: 'wx89f49b4ce923579e',
    mch_id: '1377389402',
    encodingAESKey: '3iyqjJ3c2aX7fnENZG4VNBBe5fMRrUsXjcTuC6tTS4x',
    payApiKey: 'JCJSBQSXK44HF6B8XP2XQ7AHQ36H6T7G',
    appSecret:'116c2f474f4de1c5de863aaae06adfdb',
    grant_type: 'client_credential',
    accessTokenUrl:'https://api.weixin.qq.com/cgi-bin/token',           //获取token
    oauth2AccessTokenUrl:'https://api.weixin.qq.com/sns/oauth2/access_token',           //获取token
    accessTagsUrl:'https://api.weixin.qq.com/cgi-bin/tags/get',         //获取tags列表
    ticketUrl:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',          //获取jsapi_ticket
    batchtaggingUrl:'https://api.weixin.qq.com/cgi-bin/tags/members/batchtagging',      //给用户批量打标签
    createTagUrl:'https://api.weixin.qq.com/cgi-bin/tags/create',                       //给用户打标签
    batchget_material:'https://api.weixin.qq.com/cgi-bin/material/batchget_material',  //获取永久素材
    add_news:'https://api.weixin.qq.com/cgi-bin/material/add_news',  //新增永久素材
    update_news:'https://api.weixin.qq.com/cgi-bin/material/update_news',  //修改永久素材
    getUserInfoUrl:'https://api.weixin.qq.com/cgi-bin/user/info', //根据openid获取用户信息url
    downloadUrl:'http://file.api.weixin.qq.com/cgi-bin/media/get', //下载
    unifiedorderUrl:'https://api.mch.weixin.qq.com/pay/unifiedorder', //统一下单
    orderqueryUrl:'https://api.mch.weixin.qq.com/pay/orderquery', //查询订单
    createQrcode:'https://api.weixin.qq.com/cgi-bin/qrcode/create', //生成二维码ticket
    showQrcode:'https://mp.weixin.qq.com/cgi-bin/showqrcode', //展示二维码
    cache_duration:1000*60*60*24,
    checkSignature: false
};

function getSignature(timestamp, nonce, encrypt) {
    var shasum = crypto.createHash('sha1');
    var arr = [this.token, timestamp, nonce, encrypt].sort();
    shasum.update(arr.join(''));

    return shasum.digest('hex');
};
var checkSignature = function (query, token) {
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
function getMsgXMLWithOpenId(text, openid) {
    var msg = '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[openid]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[text]]></MsgType>\n<Content><![CDATA[ ' + text + ']]></Content>\n<MsgId>6321491209218392426</MsgId>\n</xml>';
    return msg.replace('openid', openid);
}

//发送消息事件
function getVoiceMsgXML(text) {
    var msg = '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[voice]]></MsgType>\n<Recognition><![CDATA[ ' + text + ']]></Recognition>\n<MsgId>j_duiCoj3mEAYo4m_gZUeXcXeZdpveHcpQhx6aIAVoWnUE2qFJApo2Xw4u18o3WD</MsgId>\n</xml>';
    return msg;
}


function getSubscribeXML(event, openid) {
    var msg =  '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[openid]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA[' + event + ']]></Event>\n</xml>';
    return msg.replace('openid', openid);
}

function getEventKeyXMl(event, enentkey) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA[' + event + ']]></Event>\n<EventKey><![CDATA[' + enentkey + ']]></EventKey> </xml>';
}

function getEventXML(event) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA[' + event + ']]></Event>\n<EventKey><![CDATA[]]></EventKey> </xml>';
}

function getImageXml(eventType) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName><FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[image]]></MsgType><PicUrl><![CDATA[https://img.wdstatic.cn/console/images/logo-632b60596e.svg]]></PicUrl><MediaId><![CDATA[P-emNWgQp_O6yjSPZbiYRdjp3S_ZVVpo3p6dHyumnmFuhq4BmjwpfR0PweUqhGbp]]></MediaId><MsgId>6321491209218392426</MsgId></xml>';
}

var textUrl = '';

//发送文字最终post数据
function getPostMsgWithOpenId(text, openid) {
    var xml = getMsgXMLWithOpenId(text, openid);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);


    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
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
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);


    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}

//事件最终post数据
function getSubscribePostXML(type, openid) {
    var xml = getSubscribeXML(type,openid);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
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
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
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
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
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
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=' + signature + '&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url: textUrl,
        encrypt: encrypt,
        body: result
    };
}

//从返回的xml中获取text数据
function getStringData(res) {
    var xml = res.text;
    var json = parser.toJson(xml, {object: true});
    var Encrypt = json.xml.Encrypt;
    var result = cryptor.decrypt(Encrypt);
    return result.message;
}

function sendText(text, openid) {

    var postParameter = getPostMsgWithOpenId(text, openid);

    var url = "http://localhost:7072" + postParameter.url;

    request(
        {
            url: url,
            body: postParameter.body,
            method: "post",
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


let idArr = [
    // { "openid" : "oCTJos-a9y5cLLbpUoZ2JtjK59L0" },
    // { "openid" : "oCTJos4eWIKHWT9-QCdbig0mrEi0" },
    // { "openid" : "oCTJos37xfSoUbkZcTDcNLOKWCoI" },
    // { "openid" : "oCTJos66QvyiJJgTTgCyH6F0TITU" },
    // { "openid" : "oCTJosxR2lQJViOAI2TvJ7CR3zVA" },
    // { "openid" : "oCTJosxjxp3vjNXEZJGT4FjkZwyM" },
    // { "openid" : "oCTJosywAUbwgBSCpSyv41BigX2k" },
    // { "openid" : "oCTJos_IdEUxQ_zeMds72RlVnPng" },
    // { "openid" : "oCTJosxVnPR0ME4mi7xWc87p6atk" },
    // { "openid" : "oCTJos7lfp8fBg4ueLYndw2lnhaA" },
    // { "openid" : "oCTJos_lrxnDL8ui_S7gQU5Ij8P0" },
    // { "openid" : "oCTJos-ZaJNHRLT_JPGnHYs5z6D0" },
    // { "openid" : "oCTJos5oooTZSnPyzLC90oI09a-Y" },
    // { "openid" : "oCTJoszOqiTQkTFI32PvYWzL9ltw" },
    // { "openid" : "oCTJoszUL3R-DNwOh-aODN2pyG1s" },
    // { "openid" : "oCTJos6JvMxgf7HZJ9LpAnVI7mUI" },
    // { "openid" : "oCTJos_TI6EBeQd7GfsEaA7ISKQM" },
    // { "openid" : "oCTJosxLh0ebI8fpkpP4DLSOoj5w" },
    // { "openid" : "oCTJosyk4vW5gBxeAFOtK_wTjzfU" },
    // { "openid" : "oCTJoszz_OSxkXnFbhPCizhfalOM" },
    // { "openid" : "oCTJoszQ2b8hfURUpgWerNpjHqGs" },
    // { "openid" : "oCTJoszSJ-W7wjzfAtZj48MMdB7E" },
    // { "openid" : "oCTJos3Ttzp0JblIp6ySCLaSVVRk" },
    // { "openid" : "oCTJoswy1wBJA0_vtbML_30XjkjA" },
    // { "openid" : "oCTJos0z8xvMfqEQDJuMfE_is_Ww" },
    // { "openid" : "oCTJos2kWUyOo6g7VvaXppCceWic" },
    // { "openid" : "oCTJos1zQyEybdz4ZmbT9Ogc8zjo" },
    // { "openid" : "oCTJos5tOg9M3unhPHxpb_NqAcMA" },
    // { "openid" : "oCTJos3-S9eja6eFem-5rOrCqTzo" },
    // { "openid" : "oCTJos3z233MggIK7d5uRqQiBOlM" },
    // { "openid" : "oCTJos8Au-JRvtvtL7tLmoISCf_8" },
    // { "openid" : "oCTJoswZa2ttD7jNjUgK4Hlf1JMc" },
    // { "openid" : "oCTJosxSiegZhV9aIAz3tPpz88JA" },
    // { "openid" : "oCTJoswGNC5D2_UeEh58Obl-8ixE" },
    // { "openid" : "oCTJos9s8rmu3_96hEtaapA_G0l0" },
    // { "openid" : "oCTJoszRPlXTGozwaN5Eujo4Qhj0" },
    // { "openid" : "oCTJos6VlSJFiiQGMYAR68gyVJ5o" },
    // { "openid" : "oCTJos5zAWZn9qond_e_jmTS3PAk" },
    // { "openid" : "oCTJosxaACs9NARg49ae_0aVFIsE" },
    // { "openid" : "oCTJos156alk1Ypnmii-ANjmnHEQ" },
    // { "openid" : "oCTJos72KCJMkbjiziRZb-Gp5_YE" },
    // { "openid" : "oCTJos9aNa-7JgqxB8BV1lDGlTi0" },
    // { "openid" : "oCTJos9gOJqNvTlO-tiXt45-kvvc" },
    // { "openid" : "oCTJos5btScSV11RnLDmhkwt8Ys0" },
    // { "openid" : "oCTJos8xdvO-n6fJ8UpJ8SNbqs1Q" },
    // { "openid" : "oCTJos9SIhrfZPTbofA6OjY8CUD0" },
    // { "openid" : "oCTJosynSGfaAZg91aOKxwQIxhGc" },
    // { "openid" : "oCTJos3BgfesV3rLxv6bNkngepIg" },
    // { "openid" : "oCTJos-8Bqfg2ztS5lIcYR82OIyg" },
    // { "openid" : "oCTJos96DE9DFWYT_HsdWAqaLtCs" },
    // { "openid" : "oCTJos8Y1KbSmm7ffixYPzKskYQw" },
    // { "openid" : "oCTJos3pod_qMH_0EkZ-NtmB_VmQ" },
    // { "openid" : "oCTJos2v05oDJpxe2k3RoRia-q5U" },
    // { "openid" : "oCTJosxO-vilIzxRkQdxMPsDanhs" },
    // { "openid" : "oCTJos8S3qovF1J0AWidbfk0vlPg" },
    // { "openid" : "oCTJos0hQ3kwhUtQEYVpVoliLpOk" },
    // { "openid" : "oCTJos6kat_BhfLZD8Ax_k9XFKLI" },
    // { "openid" : "oCTJos6URYtIW4CLeRsMT401rMBo" },
    // { "openid" : "oCTJos4EUnF1SqwKY3L-9D9hM5Zo" },
    // { "openid" : "oCTJos5nfSM6SHVhKRzX6mG8Zjxk" },
    // { "openid" : "oCTJos2p41QQHdfBKERteRJj-z94" },
    // { "openid" : "oCTJos6gWKQpTbGrgDdTan1_v9qU" },
    // { "openid" : "oCTJos4F3EfUOOBi8LgWLwW0ep64" },
    // { "openid" : "oCTJos6azypLL-tupMg8Q3zDUkGw" },
    // { "openid" : "oCTJos92wN_Zfmz0u_sMnMNxanw0" },
    // { "openid" : "oCTJos3ykeDgN-ZPJGUK6VtTakxU" },
    // { "openid" : "oCTJos-ySUGA68HP7VCy3yGhznpY" },
    // { "openid" : "oCTJosyFV--_HCqcQyJBtrunXA2Y" },
    // { "openid" : "oCTJos9erMYwM4ZescLFjEQqn-cg" },
    // { "openid" : "oCTJoszQVYNrPOpMM3Wf8XT7t5kY" },
    // { "openid" : "oCTJos5NhIGpzoN_8Fa6GWHT9RAc" },
    // { "openid" : "oCTJosyMPi3ItwVCZw1l1jH2cRr4" },
    // { "openid" : "oCTJos4cfTc2-3bwFv46rIzn0Wsc" },
    // { "openid" : "oCTJos6X8PmyNHSEezK2nHystVXQ" },
    // { "openid" : "oCTJosx2na3M_zCk745zjC1S_pSo" },
    // { "openid" : "oCTJos9PCTt2mch3__ttehg_CbgU" },
    // { "openid" : "oCTJos7vRyvZbpEQe-LkKmpdbCXM" },
    // { "openid" : "oCTJos77qZ2Cxugj2w7dhVEruTgA" },
    // { "openid" : "oCTJos5iAiz92npUZyDS_F99YrkA" },
    // { "openid" : "oCTJos9R21QNsPPC2Z3ElaAJ9JKw" },
    // { "openid" : "oCTJos9bJGyLfdJPjCR9ZFJr8aRU" },
    // { "openid" : "oCTJos7wgFabI_UAFlSws4_7xaqw" },
    // { "openid" : "oCTJos_Sh3d9wWbOvYgYUH6Yp6Ck" },
    // { "openid" : "oCTJos010hdrRfRMAXfbDPM5-pvA" },
    // { "openid" : "oCTJos2WCxt2saMoTe0rgGHFNEaU" },
    // { "openid" : "oCTJosy46CacjsoJTvQx6BdlCWZk" },
    // { "openid" : "oCTJoswnXjkxDjfMDU2jMQ7cWxhU" },
    // { "openid" : "oCTJos9xkX03hq8IFN_LGuQ863ks" },
    // { "openid" : "oCTJosxTMmYmkW7dofIkVvgD3Rzw" },
    // { "openid" : "oCTJos4hBi4UuqwJRZSHKuJLls50" },
    // { "openid" : "oCTJos-e0gnPWqXFBx8PXpw477k8" },
    // { "openid" : "oCTJos08yGU4BhGHzTZpE0-MvIe0" },
    // { "openid" : "oCTJoswQaSIdP2fgkD1Ow_VEyAHE" },
    // { "openid" : "oCTJoszfJPkBJe8cy3qey5Njpqho" },
    // { "openid" : "oCTJos32LzrE5xVKYNc1fSzKcxXY" },
    // { "openid" : "oCTJos4uKxG8Qyhr2Ev_Z3cKcGCw" },
    // { "openid" : "oCTJos1lPy6i1b45gqdR04KQlWAc" },
    // { "openid" : "oCTJosze0K5_Denozz4VVWO_b-FU" },
    // { "openid" : "oCTJos6bjgvkF4Kk81u_Rp3lM1l8" },
    // { "openid" : "oCTJos6bzjPsYXM7604JB1Iao2To" },
    // { "openid" : "oCTJos6LySMCQu_KStJqfy-UnJiM" },
    // { "openid" : "oCTJoswjjOtfP581zuIirc6idso0" },
    // { "openid" : "oCTJosxFLSbGZbHG_yo9icbzVJvY" },
    // { "openid" : "oCTJos0mMAhM2ZkcKeBcuOMdW_K8" },
    // { "openid" : "oCTJosxd55LBEK82sQ6KZA0VRm8I" },
    // { "openid" : "oCTJos2obr_NPEC_GLGC58CIDEOw" },
    // { "openid" : "oCTJos0EH9M8lbQwrIV_Ky8m18ok" },
    // { "openid" : "oCTJosw0wHX4ErJlPkejtnasL7TA" },
    // { "openid" : "oCTJos9pBiQtKBq_RDoTsPpS_F34" },

    // 第二批
    { "openid" : "oCTJos8b0WBCiC9s-7YjljAM1xpw" },
    { "openid" : "oCTJos8UHwk7fY5mIfm_XswsLEFk" },
    { "openid" : "oCTJosx5gs54Bm5KWaIMAkWCLaLM" },
    { "openid" : "oCTJos17RchM4wdH9uvmK6jXQmhU" },
    { "openid" : "oCTJos3PX6CK3BKXM0LVFtjG7uNM" },
    { "openid" : "oCTJos7vWLImYbmGy9JT2BtycxfA" },
    { "openid" : "oCTJoswFWbQsGp8kSiOGJBOzV3_0" },
    { "openid" : "oCTJos9t4nS9-HVPPcfiE8LZkQ-8" },
    { "openid" : "oCTJos6J0nm4zg6AMEOVCG5ozk7M" },
    { "openid" : "oCTJos2w0rZMWoi15YfIXfIMImpg" },
    { "openid" : "oCTJos-_s03pjVfL630Dhp9DV5Nc" },
    { "openid" : "oCTJos4RV-4Srl_76qJVNBH0AeQY" },
    { "openid" : "oCTJosxlG1ffdvDj8WyvtXSJ1i9A" },
    { "openid" : "oCTJos_lwwOVlg2pzmvl4kgo3wmo" },
    { "openid" : "oCTJos9r2XZVupu7_yZZbiOP63jw" },
    { "openid" : "oCTJos412m_K13mlBnAqAwzrlkcU" },
    { "openid" : "oCTJosw0794ERWNhdAvF7qhCEYAs" },


    // 第一批32个测试
    // { "openid" : "oCTJos5XMD55nIzFGzihX5eGfWWs" },
    // { "openid" : "oCTJosyPEMxJx47jDhkMHQdT07Tg" },
    // { "openid" : "oCTJosxa-4geHkRVqcHVk16b4uP4" },
    // { "openid" : "oCTJos1kYVRgMnDjCw7n70Byw_oI" },
    // { "openid" : "oCTJos1G952gaFAZPsnDZeDRmyT0" },
    // { "openid" : "oCTJos2rQ-dtdyYXmwlTR0nGYeiY" },
    // { "openid" : "oCTJos3h4Gj9qeJ6D_ZFq1ztvOTM" },
    // { "openid" : "oCTJos82sjRpc5DqCIvjtVpL97ow" },
    // { "openid" : "oCTJos3ZF1VULmhR3q1lL2c_QrXc" },
    // { "openid" : "oCTJos8kDtGhJ0P57ekxOwQzA4zM" },
    // { "openid" : "oCTJos6LL2YZcEklngfy3AiOm1tk" },
    // { "openid" : "oCTJos0ddCWLTNV45DchSShHVujs" },
    // { "openid" : "oCTJos7tv28E4wqCKfTXtI2fTpIY" },
    // { "openid" : "oCTJosz1q0PwiwdgFybFUMpUIWRc" },
    // { "openid" : "oCTJoszGng-vd5uQCcIRXPn9kX5U" },
    // { "openid" : "oCTJosxddysagVCaqs3qaEdnKbLE" },
    // { "openid" : "oCTJos36pua9tSLDUNGLLclScjHs" },
    // { "openid" : "oCTJos-P4PX6Am5vvLMGEk2lAYBY" },
    // { "openid" : "oCTJos8T7shUkMAJqIAxrCI5RbiI" },
    // { "openid" : "oCTJos-MuiG8tn_g-6ZwafLpMGFA" },
    // { "openid" : "oCTJos4_1yofIY-HQ8T6xopzhIs8" },
    // { "openid" : "oCTJos8RreeHKqtqT9nR84OwgTgo" },
    // { "openid" : "oCTJos0qVvZtbNuepJFDZxHnO-MY" },
    // { "openid" : "oCTJos9FVLkWpSFeAPRsSBUPMBro" },
    // { "openid" : "oCTJos8ZeihLTo-9l4DfTjLRCzEY" },
    // { "openid" : "oCTJos-4jK_EJG9u7cvJwglGcZ_Y" },
    // { "openid" : "oCTJos8Zh2yd_eKoTFw9a2szWCU4" },
    // { "openid" : "oCTJos_u7UNCi3X42_2-tyxQ-ewQ" },
    // { "openid" : "oCTJos_ApuH7hzmpmXQdJRkQgPtQ" },
    // { "openid" : "oCTJos1k-OzvQDPKVZxutCQB5PCE" },
    // { "openid" : "oCTJos2crM37KZy7XzYTg53PSl_o" },
    // { "openid" : "oCTJosxZ5q9ddjaS0Itag4jJVziA" },
];

for(let i=0; i<idArr.length; i++){
    setTimeout(function () {
        sendText('你好0', idArr[i].openid);
        sendText('你好1', idArr[i].openid);
    },300*i);
}


// for(let i=0; i<idArr.length; i++){
//     setTimeout(function () {
//
//         var postParameter = getSubscribePostXML("subscribe", idArr[i].openid);
//         var url = "http://localhost:9090"+postParameter.url;
//         request(
//             {url:url,
//                 body : postParameter.body,
//                 method:"post",
//                 headers: {'Content-Type': 'text/xml'}
//             },
//             function (error, response, body) {
//                 console.log(error);
//                 // console.log(response);
//                 console.log(body);
//                 if (!error && response.statusCode == 200) {
//                     console.log(body)
//                 }
//             }
//         );
//
//     },300*i);
// }



// var postParameter = getSubscribePostXML("subscribe", openid);
// var url = "http://localhost:9090"+postParameter.url;
// request(
//     {url:url,
//         body : postParameter.body,
//         method:"post",
//         headers: {'Content-Type': 'text/xml'}
//     },
//     function (error, response, body) {
//         console.log(error);
//         // console.log(response);
//         console.log(body);
//         if (!error && response.statusCode == 200) {
//             console.log(body)
//         }
//     }
// );

