'use strict';
var request = require('request');
var WXBizMsgCrypt = require('wechat-crypto');
var crypto = require('crypto');
var config = require('../wechat.config');
let fs = require('fs');
var parser = require("xml2json");
var tags = require("../wechat/tags");
var assert = require('assert');
parser = require("xml2json");
var cache = require('memory-cache');
var async = require("async");


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
    signature:"f20c871037b573551ef2c0fea3196bad5c3d45e0",
    nonce:"315820554",
    timestamp:"1471836867",
},"devzlzhidaotoken")



var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.appid);

//发送消息事件
function getMsgXML(text ,userName) {
    var msg = '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[userToReplace]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[text]]></MsgType>\n<Content><![CDATA[ ' + text + ']]></Content>\n<MsgId>6321491209218392426</MsgId>\n</xml>';
    msg = msg.replace('userToReplace',userName)
    return msg;
}

//发送消息事件
function getVoiceMsgXML(text) {
    var msg = '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[voice]]></MsgType>\n<Recognition><![CDATA[ ' + text + ']]></Recognition>\n<MsgId>j_duiCoj3mEAYo4m_gZUeXcXeZdpveHcpQhx6aIAVoWnUE2qFJApo2Xw4u18o3WD</MsgId>\n</xml>';
    return msg;
}


function getSubscribeXML(event) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA['+event+']]></Event>\n</xml>';
}

function getEventKeyXMl(event,enentkey) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA['+event+']]></Event>\n<EventKey><![CDATA['+enentkey+']]></EventKey> </xml>';
}
function getEventXML(event) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA['+event+']]></Event>\n<EventKey><![CDATA[]]></EventKey> </xml>';
}
function getImageXml(eventType) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName><FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[image]]></MsgType><PicUrl><![CDATA[https://img.wdstatic.cn/console/images/logo-632b60596e.svg]]></PicUrl><MediaId><![CDATA[P-emNWgQp_O6yjSPZbiYRdjp3S_ZVVpo3p6dHyumnmFuhq4BmjwpfR0PweUqhGbp]]></MediaId><MsgId>6321491209218392426</MsgId></xml>';
}

var textUrl = '';
//发送文字最终post数据
function getPostMsg(text,userName) {
    var xml = getMsgXML(text,userName);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);


    var signature = cryptor.getSignature("1471836867","315820554",encrypt);
    textUrl = '/api/wechat?signature='+signature+'&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url:textUrl,
        encrypt:encrypt,
        body:result
    };
}
//发送语音
function getPostVoiceMsg(text) {
    console.log(text)
    var xml = getVoiceMsgXML(text);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);


    var signature = cryptor.getSignature("1471836867","315820554",encrypt);
    textUrl = '/api/wechat?signature='+signature+'&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url:textUrl,
        encrypt:encrypt,
        body:result
    };
}
//事件最终post数据
function getSubscribePostXML(type) {
    var xml = getSubscribeXML(type);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867","315820554",encrypt);
    textUrl = '/api/wechat?signature='+signature+'&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url:textUrl,
        encrypt:encrypt,
        body:result
    };
}


//事件最终post数据
function getEventKeyXML(event,enentkey) {
    var xml = getEventKeyXMl(event,enentkey);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867","315820554",encrypt);
    textUrl = '/api/wechat?signature='+signature+'&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url:textUrl,
        encrypt:encrypt,
        body:result
    };
}



//事件最终post数据
function getEvent(event) {
    var xml = getEventXML(event);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867","315820554",encrypt);
    textUrl = '/api/wechat?signature='+signature+'&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url:textUrl,
        encrypt:encrypt,
        body:result
    };
}

//图片
function getImagePost(type) {
    var xml = getImageXml();
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    var signature = cryptor.getSignature("1471836867","315820554",encrypt);
    textUrl = '/api/wechat?signature='+signature+'&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return {
        url:textUrl,
        encrypt:encrypt,
        body:result
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

let dataArr = [
    "肺癌的靶向治疗",
    "更多",
    "小细胞肺癌",
    "肺癌",
    "更多",

    "肺癌",
    "更多",
    "乳腺癌",
    "更多",

    "急性白血病",
    "肺癌和吸烟",

    "霍奇金淋巴瘤",

    // "更多",
    // "更多",
    // "9291",
    // "0",
    // "远程会诊",
    // "乳腺癌的预防",
    // "说明书"
    // "opdivo",
    // "0"
    // "更多",
    // "nihao",
    // "呼叫客服",
    // "呼叫顾问",
    // "肺癌的治疗1",
    // "2"

    // "1"
    // 肺癌   0
    // 肺腺癌
    // 小细胞肺癌
    // 肺腺癌
];



// getPostVoiceMsg("hhh")
//
/*

var conversation = require('../wechat/conversation');
const readLine = require('readline');
let lineReader = readLine.createInterface({
    input: fs.createReadStream(__dirname + '/user.txt')
});
var lines = [];
return new Promise((resolve, reject)=> {
    lineReader.on('line', function (line) {
        lines.push(line)
    }).on('close', function () {
        console.log("success");

        var i = 0;
        var time = setInterval(function () {
            i++;
            if (i == lines.length - 1) {
                clearInterval(time);
                console.log("---end")
            }
            var openid = lines[i];
            if(openid){
                var newMsg = {
                    "ToUserName": "gh_1491d480bdd6",
                    "FromUserName": openid,
                    "CreateTime": "1471836867",
                    "MsgType": "event",
                    "Event": "WifiConnected",
                    "EventKey": ""
                };

                conversation.chatZLZD(newMsg,{
                    params:{},
                    body:{},
                    session:{
                        user:null
                    },
                    wxsession:{
                        user:null
                    }
                },{});
            }

        }, 5000);
    });
});


return false;


*/
/*

var postParameter = getEventKeyXML("SCAN","boluoqianshou");

var url = "http://localhost:9090"+postParameter.url;
request(
    {url:url,
        body : postParameter.body,
        method:"post",
        headers: {'Content-Type': 'text/xml'}
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
*/

// return false;

// let i = 0;
// let timer = setInterval(function () {
//     if(i >= dataArr.length-1){
//         clearTimeout(timer);
//     }
//     let t = dataArr[i];
//     console.log(t);
//     i++;
//     sendText(t)
// },150);
//
// return false;

function sendText(text,userName) {

    var postParameter = getPostMsg(text,userName);

    var url = "http://localhost:9090"+postParameter.url;

    request(
        {url:url,
            body : postParameter.body,
            method:"post",
            headers: {'Content-Type': 'text/xml'}
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

var sendMultiText = function (userName) {
    sendText('肺癌', userName);
    setTimeout(function () {
        sendText('0', userName);
    },2000);
};

var funcArr = [];
for(var i=0; i<100; i++){
    var userName = Date.now().toString() + i.toString();


    (function (_userName) {
        funcArr.push(function () {
            sendText('肺癌', _userName);
        });
    })(userName)

    // funcArr.push(function () {
    //     sendText('肺癌', _userName);
    // });
}

// async.parallel 并发
async.parallel(funcArr,
    function(err, results) {
        console.log('err: ' + err);
        console.log('results: ' + results);
    });


// var userName = Date.now().toString();
// for(var j=0; j<10; j++) {
//     for (var i = 0; i < dataArr.length; i++) {
//         sendText(dataArr[i], userName);
//     }
// }



/*
var postParameter = getSubscribePostXML("subscribe");

var url = "http://localhost:9090"+postParameter.url;
request(
    {url:url,
        body : postParameter.body,
        method:"post",
        headers: {'Content-Type': 'text/xml'}
    },
    function (error, response, body) {
        console.log(error);
        // console.log(response);
        console.log(body);
        if (!error && response.statusCode == 200) {
            console.log(body)
        }
    }
);
*/
