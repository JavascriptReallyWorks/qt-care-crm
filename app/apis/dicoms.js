const crypto = require("crypto");

exports.show =  async function () {
    const {app} = this;
    let {id} = this.params;

    let algorithm = "aes-128-cbc";
    let key = app.config.CONSTANT.DICOM.PRIVATE_KEY;
    let iv = app.config.CONSTANT.DICOM.IV;
    let content = {"filter.accession_number.equals":id};
    let url = "https://qtclinics.ambrahealth.com/api/v3/link/external?u=faacb9c4-48c8-42f1-a6a3-236d45f9441c&v=" + encodeURIComponent(encryptText(algorithm, key, iv, JSON.stringify(content), "base64"));

    this.data = {url};
};


let encryptText = function(cipher_alg, key, iv, text, encoding) {
    let cipher = crypto.createCipheriv(cipher_alg, Buffer.from(key,'utf8') ,  Buffer.from(iv,'utf8'));
    encoding = encoding || "binary";
    let result = cipher.update(text, "utf8", encoding);
    result += cipher.final(encoding);
    return result;
};