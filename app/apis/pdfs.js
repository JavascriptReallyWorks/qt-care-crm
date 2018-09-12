
const co = require('co');
const OSS = require('ali-oss');

exports.show =   function * () {
    const {app} = this;
    let client = new OSS(app.config.OSS.params);
    let {id} = this.params;

    let file;
    try{
        file = yield app.oss.getStream(id);
        this.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': `attachment; filename=test.pdf`,
            // 'Content-Length': stats.size
        });

    } catch (err){
        throw err;
    }
    this.body = file.stream;
};


/*
exports.show =   function * () {
    const {app} = this;
    let client = new OSS(app.config.OSS.params);
    let {id} = this.params;

    let file;
    try{
        file = yield client.get(id);
    } catch (err){
        throw err;
    }
    this.body = file.content;
};
*/

/*
exports.show =  async function () {
    const {app} = this;
    let {id} = this.params;

    const res = await app.curl('https://localhost:7072/cs/previewReport/' + id + '/en', {
        method: 'GET',
        rejectUnauthorized: false
    });


    let html = res.data.toString();
    let pdfData = await  this.service.csService.printPDf(html, 'en');

    if (pdfData) {

        fileUrl = pdfData.enReportfileurl;


        this.data = {
            code: 1,
            msg: "get user summary file success",
            data: {
                file: fileUrl
            }
        };
    } else {
        this.data = {
            code: 0,
            msg: "get user summary file error"
        };
    }
};
*/