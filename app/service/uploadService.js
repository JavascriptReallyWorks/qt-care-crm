'use strict';

const co = require('co');
const OSS = require('ali-oss');

const fs = require('fs');
const request = require('request');
const exec = require('child_process').exec;
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const ffmpegPath = ffmpeg.path;

const fileType = require('file-type');

let client;


module.exports = app => {
    class uploadService extends app.Service {
        ossClient() {
            if (!client) {
                client = new OSS(app.config.OSS.params);
            }
            return client;
        }

        uploadBuffer(uri, filename, BufferData, callback) {
            try {
                let rType = fileType(BufferData);
                if(rType && rType.ext){
                  filename += "." + rType.ext
                }
                console.log(uri, filename)

                let that = this;
            
                co(function*() {
                    let result = yield that.ossClient().put(filename, new Buffer(BufferData));
                    callback(result);
                }).catch(function(err) {
                    callback(err);
                });
            } catch (e) {
                callback(null)
            }
        }

        downloadFile(uri, filename, callback) {
            let that = this;
            console.log('---head img filename----')
            console.log(filename)
            console.log(uri);
            try {
                request(uri).pipe(fs.createWriteStream(userFilePath + filename)).on('close', function() {
                    console.log("download success");
                    let stream = fs.createReadStream(userFilePath + filename);
                    co(function*() {
                        let result = yield that.ossClient().putStream(
                            "user_profile/" + filename, stream);
                        result.url = result.url.replace(/^http:/, "");
                        callback(result);
                    }).catch(function(err) {
                        console.log(err);
                    });
                }).on('error', function() {
                    console.log("download error");
                    callback({
                        success: false
                    })
                });
            } catch (e) {
                console.log(e)
            }
        }

        downloadVoice(data, filename, callback) {
            let that = this;
            let resourcePath = app.config.resourcePath;
            let amrFileName = filename + ".amr";
            try {

                fs.writeFile(resourcePath.voicePath + amrFileName, data, function(err) {
                    if (err)
                        return console.error(err);

                    amrToMp3(resourcePath.voicePath + amrFileName, resourcePath.mp3Path)
                        .then(function(fname) {
                            console.log("download success");
                            console.log(fname);

                            let stream = fs.createReadStream(resourcePath.mp3Path + fname);
                            //
                            co(function*() {
                                let result = yield that.ossClient().putStream(
                                    "wechat_voice/" + fname, stream);
                                callback(result);
                            }).catch(function(err) {
                                console.log(err);
                            });
                        })
                        .catch(function(err) {
                            callback(null)
                        });

                });

            } catch (e) {
                console.log(e)
            }
        }

        uploadPdfReport(path, filename, callback) {
            let that = this;
            let stream = fs.createReadStream(path + filename);
            const ossFileKey = app.config.CONSTANT.FILE.OSS.PDF_REPORT_PREFIX + filename;
            co(function*() {
                let result = yield that.ossClient().putStream(ossFileKey, stream);
                callback({
                    ...result,
                    ossFileKey
                });
            }).catch(function(err) {
                console.error('uploadPdfReport data: %j', path, filename, err);
                callback(0);
            });
        }


    }

    return uploadService;
};




const amrToMp3 = function(filepath, mp3Path) {
    let outputDir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : mp3Path;

    return new Promise(function(resolve, reject) {
        let basename = path.basename(filepath);
        let filename = basename.split('.')[0];
        let etc = basename.split('.')[1];
        if (etc != 'amr') {
            console.log('please input a amr file');
            return;
        }
        let cmdStr = ffmpegPath + ' -y -i ' + filepath + ' ' + outputDir + filename + '.mp3';
        exec(cmdStr, function(err, stdout, stderr) {
            if (err) {
                console.log('error:' + stderr);
                reject('error:' + stderr);
            } else {
                resolve(filename + '.mp3');
                console.log('transform to mp3 success!  ' + filepath + '->' + outputDir + filename + '.mp3');
            }
        });
    });
}
