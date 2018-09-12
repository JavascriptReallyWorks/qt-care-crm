
const striptags = require('striptags');
const _ = require('underscore');
const crypto = require("crypto");
let htmlDecode = require('js-htmlencode').htmlDecode;

const co = require('co');
const OSS = require('ali-oss');

module.exports = {
    async delay(ms){
        return new Promise( resolve => {
            setTimeout(resolve, ms);
        });
    },

    //转为微信可以支持发送的HTML，仅A标签
    getWechatHtmlContent(html) {
        if (html) {
            //将br p div 转为换行符
            html = html.replace(/<\/br>|<br>|<\/p>|<\/div>/ig, "\n");
            //去除html标签，排除a标签和br标签
            let str = striptags(html, ['a', 'br']);
            str = htmlDecode(str);
            return str;
        }
        return html;
    },
    uploadBuffer(uri, filename, BufferData, callback) {
        try {
            co(function* () {
                console.log("uploadBuffer")
                console.log(uri, filename)
                let result = yield client.put(filename, new Buffer(BufferData));
                callback(result);
            }).catch(function (err) {
                callback(err);
            });
        } catch (e) {
            callback(null)
        }
    },

    encryptText(cipher_alg, key, iv, text, encoding) {
        let cipher = crypto.createCipheriv(cipher_alg, Buffer.from(key,'utf8') ,  Buffer.from(iv,'utf8'));
        encoding = encoding || "binary";
        let result = cipher.update(text, "utf8", encoding);
        result += cipher.final(encoding);
        return result;
    },

    signature(str) {
        let newStr = str + (parseInt(new Date().getTime() / 1000 / 60 / 5)).toString(12);
        let hash = crypto.createHash("sha1");
        hash.update(newStr);
        newStr = hash.digest('hex');
        return newStr;
    },

    async reqPost(url,body) {
        const {clientId, clientSecret} = this.ctx.app.config.CONSTANT.appsConf.crm;
        const result = await this.ctx.curl(url, {
            method: "POST",
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'client_id': clientId,
                'code': this.ctx.helper.signature(clientId + clientSecret)
            },
            data: body
        });
        return result;
    },

    async reqGet(url) {
        const {clientId, clientSecret} = this.ctx.app.config.CONSTANT.appsConf.crm;
        const result = await this.ctx.curl(url, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'client_id': clientId,
                'code': this.ctx.helper.signature(clientId + clientSecret)
            }
        });
        return result;
    },

    randomString(len){
        len = len || 32;
        let CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let maxPos = CHARS.length;
        let str = '';
        for (let i = 0; i < len; i++) {
            str += CHARS.charAt(Math.floor(Math.random() * maxPos));
        }
        return str;
    },

    async getNextSid(collectionName){
        let serialDoc = await this.ctx.model.Counter.findOneAndUpdate(
            {collectionName},
            {$inc:{serialCount:1}},
            {new:true}
        );

        return serialDoc.serialCount;
    },

    isEmptyObject(obj){
        return Object.keys(obj).length === 0 && obj.constructor === Object
    },


    isPlainObject(obj){
        return obj && !Array.isArray(obj) && typeof obj === 'object';
    },


    /*
        params = {
            token:'123321',
            id:'123456'
        }
     */

    addQueryParams(url, params){
        if(!this.isPlainObject(params)){
            return url;
        }
        let first_iteration = true;
        for (let prop in params) {
            if (params.hasOwnProperty(prop)) {
                let separator;
                if (first_iteration) {
                    separator = (url.indexOf("?")===-1)?"?":"&";
                    first_iteration = false;
                }
                else{
                    separator = "&";
                }
                url += `${separator}${prop}=${params[prop]}`;
            }
        }
        return url;
    }
};
