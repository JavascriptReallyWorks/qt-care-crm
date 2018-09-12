var request = require('request');
var WXBizMsgCrypt = require('wechat-crypto');
var crypto = require('crypto');
var parser = require("xml2json");

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
};

var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.appid);
function getPostMsg(text) {
    var xml = getMsgXML(text);
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

function getMsgXML(text) {
    var openid = 'test_openid_' + Date.now().toString().substr(-4);
    var msg = '<xml><ToUserName><![CDATA[gh_02c7b9ffe0de]]></ToUserName>\n<FromUserName><![CDATA[' + openid + ']]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[text]]></MsgType>\n<Content><![CDATA[ ' + text + ']]></Content>\n<MsgId>6321491209218392426</MsgId>\n</xml>';
    return msg;
}

exports.sendText = function(text) {
    var postParameter = getPostMsg(text);
    var url = "http://127.0.0.1:7072" + postParameter.url;
    request({
            url: url,
            body: postParameter.body,
            method: "post",
            headers: { 'Content-Type': 'text/xml' },
            "rejectUnauthorized": false
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
        }
    );
}
