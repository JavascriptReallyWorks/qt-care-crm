
'use strict';



let WechatAPI = require('wechat-api');
let wechatConfig = require('../wechat.config.js');
let cache = require('memory-cache');
let env = process.env.NODE_ENV || 'development';
let $wechatAPI;



let mongo = require('../db.connect');
let db;



if (env === 'production') {
    console.log("production")
    $wechatAPI = new WechatAPI(wechatConfig.appid, wechatConfig.appSecret, function (callback) {
        let token = {"accessToken":"WN121qRiFot9cGPua1y2IZjeVB_f6Xcoe66F-P0xzBYkh76-K758_N5Pt5idUUurLzPTQ_lfdOiw8kMBN7g3Qz91rA8yWhVtN9DJtjKUCQyZmvhNyGpQBdFoWri440u2REZjAAAUHC","expireTime":1504013901122};
        console.log("cache token");
        callback(null, token);
    }, function (token, callback) {
        if (token) {
            console.log(token);
            cache.put("callback wechat_api_token", token);
        }
    });
}else{
    console.log("development")
    $wechatAPI = {};
    $wechatAPI.sendTemplate = function(openid, templateId, url, data) {
        console.log(openid, templateId, url, data)
    }
}


let n = 0;

let fs  = require("fs");
function getUser() {
    mongo.getDb(function (database) {
        db = database;

        // db.users.distinct('openid',{$or:[{SEARCH_QA:{$exists:true}},{ZLZD_HELP:{$exists:true}},{SERVICE_RSS:{$exists:true}},{CANCER_QA:{$exists:true}},{MANUAL:{$exists:true}}]});

        let query = db.collection('users').distinct('openid',{$or:[{SEARCH_QA:{$exists:true}},{ZLZD_HELP:{$exists:true}},{SERVICE_RSS:{$exists:true}},{CANCER_QA:{$exists:true}},{MANUAL:{$exists:true}}]});
        query.then(function (data) {
            console.log(data.length)
            fs.appendFileSync("./mocha-tests/userAll.txt", data.join("\n"));
        });
        return false;


    });
}

const readLine = require('readline');
let lineReader = readLine.createInterface({
    input: fs.createReadStream(__dirname + '/userAll.txt')
});
let lines = [];

function sendMsgtoAllUser() {
    try {
        lineReader.on('line', function (line) {
            lines.push(line)
        }).on('close', function () {
            let i = 0;
            console.log(lines.length)
            let time = setInterval(function () {


                if (i == lines.length) {
                    clearInterval(time);
                    console.log("---end")
                    return false;
                }

                let openid = lines[i];
                i++;
                let timer = (2*Math.random()+1)*100;
                timer = parseInt(timer);
                setTimeout(function () {
                    console.log("to user:"+openid + " timer:"+timer);
                    sendTplMsg(openid)
                },timer);


            },200);
        });
    }catch (e) {
        console.error(e);
    }
}

let err_count = 0;
let success_count = 0;


function sendTplMsg(openid) {

    let templateId = 'KkrgOs6ICH3MphpBhwUgGugpfFGkq-sTEBl9KcVLpbg';
    let url = "https://mp.weixin.qq.com/s?__biz=MzAwOTk1MDIxNw==&mid=100005070&idx=1&sn=a93896c8863e46781ada8e48c1ab3ef0&chksm=1b5691a82c2118bea1f615a057ac0b1d745ea39c6c0a106499e3cf95a0f9ad7b7ce2cec7ddfc&mpshare=1&scene=1&srcid=09266r9NfyxN0fO3hSWJH0oH&key=9963078bd8180cdf53df132af370192b86ec7790f23450b4b2cec9eccc704011192320105c619bafa6dcbda84fec9738032f029851c754d5ac9119e9d74db6193b804970bd93433519b77a88f579026e&ascene=0&uin=MTA2NjYyMDg2Mg%3D%3D&devicetype=iMac+MacBookAir7%2C2+OSX+OSX+10.12.6+build(16G29)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=ZQdurgxemRXKAqJlyNS%2BQNXz2TWn51vFHbVKtB%2BtvNPe%2FGyACdzBt0BJ0tbUxFqA";
    let data = {
        "first": {
            "value":"菠萝科普讲座上海站，邀请您亲临现场！",
            "color":"#173177"
        },
        //主题
        "keyword1":{
            "value":"菠萝癌症科普讲座暨新书签售会",
            "color":"#333333"
        },
        //时间
        "keyword2": {
            "value":"2017-8-30 晚上19点",
            "color":"#333333"
        },

        "remark":{
            "value":"想来一场奇妙的科普之旅吗？点击通知，查看预告",
            "color":"#333333"
        }
    };
    
    console.log(openid)

    $wechatAPI.sendTemplate(openid, templateId, url, data, function (err,res) {
        if(err){
            console.log(err)
            console.log("err_count:",(err_count++))
        }else{
            console.log("success_count:",(success_count++))
        }
    });
}
sendMsgtoAllUser();