'use strict';

var app = require('../server');
var request = require('supertest');
var assert = require('assert');
var WXBizMsgCrypt = require('wechat-crypto');
var crypto = require('crypto');
var config = require('../wechat.config');
let fs = require('fs');
var wechatGroupConfigFile = "wechat.group.config.json";
var wechatGroupConfig = JSON.parse(fs.readFileSync(wechatGroupConfigFile));
var parser = require("xml2json");
var lib = require("../wechat/zlzd_wechat");
var tags = require("../wechat/tags");
var dbConfig = require('../database.conf');
var assert = require('assert');
parser = require("xml2json");
var cache = require('memory-cache');
var tagsDao = require('../models/tags.dao');
var mongodb = require('mongodb'),
    MongoClient = mongodb.MongoClient,
    db;
///api/wechat/feiai?signature=c2b5aff2ec012fe5d1f20c2b796854cbaaff222f&timestamp=1491035448&nonce=1844347741&openid=oCTJoszSQ3s2fwbSvazGju5pDJUY&encrypt_type=aes&msg_signature=00e26e838590d1598300ab2be2f5f64f593be7e7
///api/wechat/feiai?signature=c2b5aff2ec012fe5d1f20c2b796854cbaaff222f&timestamp=1491035448&nonce=1844347741&openid=oCTJoszSQ3s2fwbSvazGju5pDJUY&encrypt_type=aes&msg_signature=69b76d44ec8d5932163a40c1064474eb0d432e37
before(function (done) {
    MongoClient.connect(dbConfig.url, function (err, database) {
        if (err) throw err;
        db = database;
        // var cond = {
        //     relation: {$in: ["别名", "关联"]}
        // };
        // tagsDao.queryTagsAll(db, cond, function (tags) {
        //     if (tags) {
        //         cache.put("tags", tags);
        //     }
        //     done()
        // });
    });
    done()
});

var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.appid);

//发送消息事件
function getMsgXML(text) {
    var msg = '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[text]]></MsgType>\n<Content><![CDATA[ ' + text + ']]></Content>\n<MsgId>6321491209218392426</MsgId>\n</xml>';
    return msg;
}
//关注事件xml
function getEventXML(eventType) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA[' + eventType + ']]></Event>\n<MsgId>6321491209218392426</MsgId>\n</xml>';
}

function getEventKeyXMl(eventType) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName>\n<FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName>\n<CreateTime>1471836867</CreateTime>\n<MsgType><![CDATA[event]]></MsgType>\n<Event><![CDATA[CLICK]]></Event>\n<EventKey><![CDATA['+eventType+']]></EventKey> </xml>';
}

function getImageXml(eventType) {
    return '<xml><ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName><FromUserName><![CDATA[oCTJoszSQ3s2fwbSvazGju5pDJUY]]></FromUserName><CreateTime>1348831860</CreateTime><MsgType><![CDATA[image]]></MsgType><PicUrl><![CDATA[https://img.wdstatic.cn/console/images/logo-632b60596e.svg]]></PicUrl><MediaId><![CDATA[grvGu5mJXl46I0OvZRzDexHgPzRTf2hnzXgXot78BJw]]></MediaId><MsgId>6321491209218392426</MsgId></xml>';
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


var textUrl = '';
//发送文字最终post数据
function getPostMsg(text) {
    var xml = getMsgXML(text);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=f20c871037b573551ef2c0fea3196bad5c3d45e0&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return result;
}
//事件最终post数据
function getEventPostXML(type) {
    var xml = getEventXML(type);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=f20c871037b573551ef2c0fea3196bad5c3d45e0&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return result;
}
//click事件最终post数据
function getEventKeyXML(type) {
    var xml = getEventKeyXMl(type);
    var encrypt = cryptor.encrypt(xml);
    var result = '<xml> <ToUserName><![CDATA[gh_1491d480bdd6]]></ToUserName> <Encrypt><![CDATA[' + encrypt + ']]></Encrypt> </xml>';
    var msg_sign = cryptor.getSignature("1471836867", "315820554", encrypt);
    textUrl = '/api/wechat?signature=f20c871037b573551ef2c0fea3196bad5c3d45e0&timestamp=1471836867&nonce=315820554&openid=oCTJosxkVN8s4aQQxXBWQgAIta7w&encrypt_type=aes&msg_signature=' + msg_sign;
    return result;
}


//从返回的xml中获取text数据
function getStringData(res) {
    var xml = res.text;
    var json = parser.toJson(xml, {object: true});
    var Encrypt = json.xml.Encrypt;
    var result = cryptor.decrypt(Encrypt);
    return result.message;
}

describe('wechat.text', function () {
    /*it('wechat. test', function (done) {
        this.timeout(5000);
        var postData = getPostMsg("上海天气");
        request(app)
        .post(textUrl).type('xml').send(postData).end(function (err, res) {
            console.log("err:%s",err);
            console.log("res:%s",JSON.stringify(res));
            // var xml = getStringData(res);
            // var json = parser.toJson(xml, {object: true});
            // console.log(xml)
            // // if(json.xml.Articles.item){
            // //     var arr = json.xml.Articles.item;
            // //     for(var i = 0;i<arr.length;i++){
            // //         console.log(arr[i].Title)
            // //         console.log(arr[i].Url)
            // //     }
            // // }
            // done();
        });
    });*/

    /*it('wechat. test image', function (done) {
        this.timeout(5000);
        var postData = getImagePost("image");
        request(app)
        .post(textUrl).type('xml').send(postData).end(function (err, res) {
            console.log("err:%s",err);
            console.log("res:%s",JSON.stringify(res));
            // var xml = getStringData(res);
            // var json = parser.toJson(xml, {object: true});
            // console.log(xml)
            // // if(json.xml.Articles.item){
            // //     var arr = json.xml.Articles.item;
            // //     for(var i = 0;i<arr.length;i++){
            // //         console.log(arr[i].Title)
            // //         console.log(arr[i].Url)
            // //     }
            // // }
            // done();
        });
    })*/

    /*it('wechat. subscribe', function (done) {
        this.timeout(5000);
        var postData = getEventPostXML("subscribe");
        request(app)
        .post(textUrl).type('xml').send(postData).end(function (err, res) {
            done();
        });
    });*/

    /*it('should enter 123456789 after subscribe', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
        .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            console.log(message)
            // assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("1");
            request(app).post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/请问您最关心的癌症类型是/));
                //enter 肺癌
                var postData = getPostMsg("肺癌");
                request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/根据您选择的癌症类型/));

                    var postData = getPostMsg("123");
                    request(app)
                    .post(textUrl)
                    .type('xml')
                    .send(postData)
                    .end(function (err, res) {
                        var message = getStringData(res);
                        assert.ok(message.match(/适用于肺癌的新药/));
                        assert.ok(message.match(/肺癌的治疗方案/));
                        done();
                    });
                });
            });
        });

    });*/


    /*it('should enter 123456789 after subscribe', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
        .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            console.log(message)
            done()
        });

    });*/
    
    /*it('should 9291 article', function (done) {
        var postData = getPostMsg("9291");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/AZD9291是一种激酶抑制剂，适用于EGFR T790阳性突变的晚期非小细胞肺癌患者/));
            done();
        });

    });*/
    /*it('should opdivo Instructions', function (done) {
        var postData = getPostMsg("opdivo");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/Opdivo中文说明书/));
            done();
        });

    });
    it('should opdivo Instructions', function (done) {
        var postData = getPostMsg("Keytruda");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/派姆单抗中文说明书/));
            done();
        });

    });
    it('should transfer_customer_service', function (done) {
        var postData = getPostMsg("helloworld");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/transfer_customer_service/));
            done();
        });

    });
    it('should Dr', function (done) {
        var postData = getPostMsg("Veach");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/凯特琳癌症中心肺癌专家Dr. Veach/));
            done();
        });

    });
    it('should 肺癌', function (done) {
        var postData = getPostMsg("肺癌");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            
            assert.ok(message.match(/肺癌的治疗方案/));
            assert.ok(message.match(/适用于肺癌的新药/));
            
            done();
        });
    });
    it('should 乳腺癌', function (done) {
        var postData = getPostMsg("乳腺癌");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            console.log(message)

            assert.ok(message.match(/乳腺癌的治疗方案/));
            assert.ok(message.match(/适用于乳腺癌的新药/));

            done();
        });
    });
    it('should her2', function (done) {
        var postData = getPostMsg("her2");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/乳腺癌/));
            done();
        });
    });
    it('should 量子健康', function (done) {
        var postData = getPostMsg("量子健康");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/量子健康/));
            done();
        });
    });*/
    /*it('should 请输入更加准确的信息 when text length < 3 ', function (done) {
     var postData = getPostMsg("a");
     request(app)
     .post(textUrl).type('xml').send(postData).end(function (err, res) {
     var message = getStringData(res);
     assert.ok(message.match(/请输入更加准确的信息/));
     done();
     });
     });
     it('should 请输入更加准确的信息 when text length < 3 ', function (done) {
     var postData = getPostMsg("hhh");
     request(app)
     .post(textUrl).type('xml').send(postData).end(function (err, res) {
     var message = getStringData(res);
     assert.ok(message.match(/请输入更加准确的信息/));
     done();
     });
     });*/
    /*it('should transfer_customer_service', function (done) {
        var postData = getPostMsg("nihao");
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/transfer_customer_service/));
            done();
        });
    });*/
    //
    /*it('should 笑脸表情', function (done) {
     var postData = getPostMsg("/::D");
     request(app)
     .post(textUrl).type('xml').send(postData).end(function (err, res) {
     var message = getStringData(res);
     assert.ok(message.match(/\/::D/));
     done();
     });
     });*/
});

/* describe('webchat.event.subscribes', function () {
    it('should enter 123456789 after subscribe', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("1");
            request(app).post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/请问您最关心的癌症类型是/));
                //enter 肺癌
                var postData = getPostMsg("肺癌");
                request(app)
                    .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/根据您选择的癌症类型/));

                    var postData = getPostMsg("123");
                    request(app)
                        .post(textUrl)
                        .type('xml')
                        .send(postData)
                        .end(function (err, res) {
                            var message = getStringData(res);
                            assert.ok(message.match(/适用于肺癌的新药/));
                            assert.ok(message.match(/肺癌的治疗方案/));
                            done();
                        });
                });
            });
        });

    });
    /!*it('should 量子远程会诊服务 after subscribe', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("1");
            request(app).post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/请问您最关心的癌症类型是/));
                //enter 肺癌
                var postData = getPostMsg("淋巴瘤");
                request(app)
                    .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/根据您选择的癌症类型/));

                    var postData = getPostMsg("1");
                    request(app)
                        .post(textUrl)
                        .type('xml')
                        .send(postData)
                        .end(function (err, res) {
                            var message = getStringData(res);
                            assert.ok(message.match(/您有兴趣邀请国内外专/));
                            var postData = getPostMsg("1");
                            request(app)
                                .post(textUrl)
                                .type('xml')
                                .send(postData)
                                .end(function (err, res) {
                                    var message = getStringData(res);
                                    assert.ok(message.match(/会诊/));
                                    done();
                                });
                        });
                });
            });
        });

    });*!/
    it('should step1 message after subscribe', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("1");
            request(app).post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/请问您最关心的癌症类型是/));
                //enter 肺癌
                var postData = getPostMsg("肺癌");
                request(app)
                    .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/根据您选择的癌症类型/));

                    var postData = getPostMsg("2");
                    request(app)
                        .post(textUrl)
                        .type('xml')
                        .send(postData)
                        .end(function (err, res) {
                            var message = getStringData(res);
                            assert.ok(message.match(/适用于肺癌的新药/));
                            done();
                        });
                });
            });
        });

    });
    it('should step2 message after subscribe', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("1");
            request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/请问您最关心的癌症类型是/));
                //enter 肺癌
                var postData = getPostMsg("非小细胞肺癌");
                request(app)
                    .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/根据您选择的癌症类型/));
                    

                    var postData = getPostMsg("2");
                    request(app)
                        .post(textUrl)
                        .type('xml')
                        .send(postData)
                        .end(function (err, res) {
                            var message = getStringData(res);
                            assert.ok(message.match(/适用于肺癌的新药/));
                            done();
                        });
                });

            });
        });

    });
    it('should step2 message1 cancer is null after subscribe enter is null', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("1");
            request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/请问您最关心的癌症类型是/));
                //enter 肺癌
                var postData = getPostMsg("不关心");
                request(app)
                    .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/根据您选择的癌症类型/));

                    var postData = getPostMsg("2");
                    request(app)
                        .post(textUrl)
                        .type('xml')
                        .send(postData)
                        .end(function (err, res) {
                            var message = getStringData(res);
                            assert.ok(message.match(/transfer_customer_service/));
                            done();
                        });
                });

            });
        });

    });
    it('should step2 message2 cancer is null after subscribe enter is null', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("1");
            request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/请问您最关心的癌症类型是/));
                //enter 肺癌
                var postData = getPostMsg("不知道");
                request(app)
                    .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/根据您选择的癌症类型/));

                    var postData = getPostMsg("2,7");
                    request(app)
                        .post(textUrl)
                        .type('xml')
                        .send(postData)
                        .end(function (err, res) {
                            var message = getStringData(res);
                            assert.ok(message.match(/transfer_customer_service/));
                            done();
                        });
                });

            });
        });

    });

    it('should multiple("2,8,9") message ', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("1");
            request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/请问您最关心的癌症类型是/));
                //enter 肺癌
                var postData = getPostMsg("肺癌");
                request(app)
                    .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/根据您选择的癌症类型/));

                    var postData = getPostMsg("1");
                    request(app)
                        .post(textUrl)
                        .type('xml')
                        .send(postData)
                        .end(function (err, res) {
                            var message = getStringData(res);
                            assert.ok(message.match(/肺癌的治疗方案/));
                            done();
                        });
                });

            });
        });

    });
    it('should multiple("1,2,3") message ', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("1");
            request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/请问您最关心的癌症类型是/));
                //enter 肺癌
                var postData = getPostMsg("乳腺癌");
                request(app)
                    .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/根据您选择的癌症类型/));

                    var postData = getPostMsg("1,2,3");
                    request(app)
                        .post(textUrl)
                        .type('xml')
                        .send(postData)
                        .end(function (err, res) {
                            var message = getStringData(res);
                            assert.ok(message.match(/适用于乳腺癌的新药/));
                            assert.ok(message.match(/乳腺癌的治疗方案/));
                            done();
                        });
                });

            });
        });

    });
    it('should step3 message after subscribe', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("2");
            request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/您想了解的是/));
                var postData = getPostMsg("123");
                request(app)
                    .post(textUrl).type('xml').send(postData).end(function (err, res) {
                    var message = getStringData(res);
                    assert.ok(message.match(/朱莉皮特离婚/));
                    done();
                });
            });
        });

    });
    it('should step4 message after subscribe', function (done) {
        var postData = getEventPostXML('subscribe');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            console.log("--:"+message)
            assert.ok(message.match(/欢迎您关注肿瘤知道/));
            //step1
            var postData = getPostMsg("3");
            request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                console.log("--:"+message);
                assert.ok(message.match(/感谢您关注我们/));
                done();
            });
        });

    });
});
describe('webchat.event.zlzd_help', function () {
    it('should zlzd_help number 1 message after click 量子君', function (done) {
        var postData = getEventKeyXML('zlzd_help');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            
            assert.ok(message.toString().match(/我是量子君/));
            //step1
            var postData = getPostMsg("1");
            request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/transfer_customer_service/));
                done();
            });
        });
    });
    it('should zlzd_help number 1 message after click 最新疗法', function (done) {
        var postData = getEventKeyXML('treat');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            console.log(message)
            assert.ok(message.toString().match(/治疗方案/));
            done();
        });
    });
    it('should zlzd_help number 1 message after click 食物', function (done) {
        var postData = getEventKeyXML('food');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.toString().match(/甘草/));
            done();
        });
    });
    it('should zlzd_help number 1 message after click 靠谱体检', function (done) {
        var postData = getEventKeyXML('health');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);

            assert.ok(message.toString().match(/牵手HLI/));
            done();
        });
    });
    
    it('should zlzd_help 2 after click 量子君', function (done) {
        var postData = getEventKeyXML('zlzd_help');
        
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.toString().match(/我是量子君/));
            done();
        });
    });
    it('should zlzd_help other message after click 量子君', function (done) {
        var postData = getEventKeyXML('zlzd_help');

        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.toString().match(/我是量子君/));
            //step1
            var postData = getPostMsg("opdivo");
            request(app)
                .post(textUrl).type('xml').send(postData).end(function (err, res) {
                var message = getStringData(res);
                assert.ok(message.match(/Opdivo中文说明书/));
                done();
            });
        });
    });


});*/
/*describe('webchat.event.article_topHospital', function () {
    it('should article_topHospital message after click 排行榜', function (done) {
        var postData = getEventKeyXML('article_topHospital');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            assert.ok(message.match(/排行榜/));
            done();
        });
    });

});*/
/*describe('webchat.event.article_drug', function () {
    it('should article_drug message after click 药物科普', function (done) {
        var postData = getEventKeyXML('article_drug');
        request(app)
            .post(textUrl).type('xml').send(postData).end(function (err, res) {
            var message = getStringData(res);
            
            assert.ok(message.match(/用于抑制布鲁顿酪/));
            done();
        });
    });
});*/

/*
describe('webchat.addTags', function () {
    it('should all tags ', function (done) {
        tags.addTags("ocYxcuAEy30bX0NXmGn4ypqx3tI0",'肾癌',function (t) {
            //assert.ok(t == 0);
            done();
        });
    });
});*/
