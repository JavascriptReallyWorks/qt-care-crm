'use strict';

let mongoose = require('mongoose'); //var id = mongoose.Types.ObjectId('4edd40c86762e0fb12000003');

const co = require('co');
const OSS = require('ali-oss');
const path = require('path');
const sendToWormhole = require('stream-wormhole');

let client;

module.exports = app => {

    class CsController extends app.Controller {
        ossClient(){
            if(!client){
                client = new OSS(app.config.OSS.params);
            }
            return client;
        }

        async cs() {
            await  this.ctx.render('cs.jade', { user: this.ctx.user });
            // await  this.ctx.render('cs_test.jade', { user: this.ctx.user });
        }


        async csPartials() {
            const name = this.ctx.params.name;
            await  this.ctx.render('cs_partials/' + name + '.jade');
        }


        async newMongoId() {
            this.checkAndRespond(mongoose.Types.ObjectId());
        }

        //标签级联查询
        async getSubTags() {
            let r_tag = this.req.query.r_tag;
            let data = await  this.ctx.service.apiService.getSubTag(r_tag);
            this.ctx.body = data;
        }
        async getTags() {
            let data = await  this.ctx.service.apiService.getTags();
            this.ctx.body = data;
        }

        //
        async searchQa() {
            let page = this.req.body.page;
            let cond = this.req.body.cond;
            let limit = this.req.body.limit;
            if (!cond.text) {
                cond.text = "";
            }

            limit = limit ? limit : 10;
            let from = page == 0 ? 0 : (page - 1) * limit;

            let res = await  this.ctx.service.apiService.searchQa(cond,limit,from);
            this.ctx.body = res.data;

        }
        //
        async getOneQa() {
            let id = this.req.query.id;

            let res = await  this.ctx.service.apiService.getOneQa(id);
            this.ctx.body = res.data;

        }


        async getPdfReport() {
            let html = this.req.body.html;
            let lang = this.req.body.lang;
            if (!lang) {
                lang = 'cn';
            }
            let data = await  this.csService.printPDf(html, lang);
            this.ctx.body = data;
        }

        /*  单个文件
        * uploadFile (){
            const {ctx} = this;
            const stream = yield  ctx.getFileStream();
            const name = 'egg-multipart-test/' + path.basename(stream.filename);
            let result;
            try {
              // process file or upload to cloud storage
              result = yield  client.put(name, stream);
            } catch (err) {
              // must consume the stream, otherwise browser will be stuck.
              yield  sendToWormhole(stream);
              throw err;
            }
          
            ctx.body = {
              url: result.url,
              // process form fields by `stream.fields`
              fields: stream.fields,
            };
        }
        */


        * uploadFile() {
            const { ctx } = this;
            const parts = ctx.multipart();
            let part;
            let that = this;
            let result = yield  co(function*() {
                let result = [];
                while ((part = yield  parts) != null) {
                    if (part.length) {
                        // arrays are busboy fields
                        // console.log('field: ' + part[0]);
                        // console.log('value: ' + part[1]);
                        // console.log('valueTruncated: ' + part[2]);
                        // console.log('fieldnameTruncated: ' + part[3]);
                    } else {
                        if (!part.filename) {
                            return;
                        }
                        let fileInfo = {
                            filename: part.filename
                        };
                        let res;
                        let newFileName = Date.now().toString() + ctx.service.tool.randomString(16) + '.' + part.filename.split('.').pop();
                        let ossFileKey = 'user_file/' + newFileName;
                        try {
                            res = yield  that.ossClient().put(ossFileKey, part);
                        } catch (err) {
                            yield  sendToWormhole(part);
                            throw err;
                        }
                        if (res) {
                            fileInfo.ossFileKey = ossFileKey;
                            result.push(fileInfo);
                        }
                    }
                }
                return result;
            });
            if (result)
                ctx.body = result;
        }


        * downloadFile() {
            const { ctx } = this;
            let url = ctx.query.url;
            let fileKey = removeHttpOrSlash(url).replace(app.config.OSS.urlHead, '')
            let file = yield  this.ossClient().get(fileKey);
            ctx.body = file.content;
        }


        * getPicture() {
            const { ctx } = this;
            //GET /posts?category=egg&language=node
            let url = ctx.query.url;
            let fileKey = removeHttpOrSlash(url).replace(app.config.OSS.urlHead, '');
            let file;
            try{
                file = yield this.ossClient().get(fileKey);
            } catch (err){
                throw err;
            }
            ctx.body = file.content;
        }

        * getAudio() {
            const { ctx } = this;
            let url = ctx.query.url;
            let fileKey = removeHttpOrSlash(url).replace(app.config.OSS.urlHead, '');
            let fileStream;
            try{
                fileStream = yield  this.ossClient().getStream(fileKey);
            } catch (err){
                yield  sendToWormhole(part);
                throw err;
            }
            // ctx.response.set({
            //     'Content-Type': 'audio/mpeg',
            // });
            ctx.body = fileStream.stream;
        }
    }
    return CsController;
};


let removeHttpOrSlash  = function (str) {
    // 先除去有可能的 "//",如wechat_message中存的url， 再除去有可能的 "http://" or "https://"
    return str.replace(/^\/+/g, '').replace(/^https?\:\/\//i, "");
};