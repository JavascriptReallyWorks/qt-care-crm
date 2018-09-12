/**
 * Created by Yang1 on 5/4/17.
 */

var crypto = require('crypto');

module.exports = app => {
    class Tool extends app.Service {
        /**
         * substring occurence in string
         * */
        countInstances(string, word) {
            let substrings = string.split(word);
            return substrings.length - 1;
        };

        /**
         * 生成随机字符串
         * */
        randomString(len) {
            len = len || 32;
            let CHARS = 'ABCDEFGHJKMNPQRSTWXYZ2345678';
            let maxPos = CHARS.length;
            let str = '';
            for (let i = 0; i < len; i++) {
                str += CHARS.charAt(Math.floor(Math.random() * maxPos));
            }
            return str;
        };

        /**
         * 去重
         * */
        uqArray(arr) {
            if (Array.isArray(arr) && arr.length > 0) {
                let uq = {};
                let re = [];
                for (let i = 0; i < arr.length; i++) {
                    if (!uq[arr[i]] && arr[i] && arr[i] != "") {
                        uq[arr[i]] = true;
                        re.push(arr[i]);
                    }
                }
                return re;
            } else {
                return arr;
            }

        };

        /**
         * 去重
         * */
        uqConcain(arr) {
            let maxConcain = [];
            if (Array.isArray(arr) && arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    let c1 = arr[i];

                    if (c1) {
                        let p = true;
                        for (let j = 0; j < arr.length; j++) {
                            let c2 = arr[j];
                            if (c2.match(new RegExp(c1, "ig")) && c2.length > c1.length) {
                                p = false;
                                break;
                            }
                        }
                        if (p) {
                            maxConcain.push(c1);
                        }
                    }
                }
                return maxConcain;
            } else {
                return arr;
            }

        };

        /**
         * 去重
         * */
        uniquify(arr) {
            let mySet = new Set();
            let uniArr = [];
            for (let i = 0; i < arr.length; i++) {
                mySet.add(arr[i]);
            }
            for (let key of mySet) {
                uniArr.push(key);
            }
            return uniArr;
        };

        /**
         * 去除特殊符号
         * */
        removeMarks(str) {
            return str.replace(/[@^&\/\\#,+()\[\]$~%.'":*?<>{}!]/g, '');
        };

        /**
         * 去除逗号特殊符号
         * */
        removeNonCommaMarks(str) {
            return str.replace(/[@^&\/\\#+()\[\]$~%.'":*?<>{}!]/g, '');
        };

        /**
         * 去除new line
         * */
        removeNewLine(str) {
            return str.replace(/(\r\n|\n|\r)/gm, "");
        };

        /**
         * 去除数组中的空字符串
         * */
        removeEmptyStr(arr) {
            let newArr = [];
            for (let item of arr) {
                item && newArr.push(item);
            }
            return newArr;
        };


        keysrt(key, desc) {
            return function (a, b) {
                return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
            }
        };

        //url参数追加
        appendUrl(url, url_str) {
            if (url_str) {
                let isQuestionMarkPresent = url && url.indexOf('?') !== -1,
                    separator = isQuestionMarkPresent ? '&' : '?';
                url += separator + url_str;
            }

            return url;
        };

        getMaxStringInArray(arr) {
            let max_arr = [];
            for (let i = 0; i < arr.length; i++) {
                let p = true;
                for (let j = 0; j < arr.length; j++) {
                    if (arr[j].match(arr[i]) && arr[j].length > arr[i].length) {
                        p = false;
                        break;
                    }
                }
                if (p) {
                    max_arr.push(arr[i]);
                }
            }
            return max_arr;
        };


        getMatchTags(word) {
            let tags = cache.get("tags");
            if (tags) {
                let math_wd_arr = [];
                for (let y = 0, l = tags.length; y < l; y++) {
                    let str_reg = new RegExp((tags[y].relevance_tags + tags[y].tags).replace(/[&\|\\\()*^%$#@]/g, "").replace(/,/gi, "|"), "gi");
                    word.replace(str_reg, function (w) {
                        if (w && math_wd_arr.indexOf(w) == -1) {
                            math_wd_arr.push(w);
                        }
                        return null;
                    });
                }
                return math_wd_arr.length > 0 ? this.getMaxStringInArray(math_wd_arr) : false;
            } else {
                return;
            }
        };

        rotating(str) {
            let that = this;
            if (str && str != "") {
                let hash = crypto.createHash("sha1");
                hash.update(str);
                return hash.digest('hex');
            } else {
                return str;
            }
        };

        delHTMLRotating(str) {
            let that = this;
            if (str && str != "") {
                str = that.delHtmlTag(str);
                let hash = crypto.createHash("sha1");
                hash.update(str);
                return hash.digest('hex');
            } else {
                return str;
            }
        };

        delHtmlTag(html) {
            if (html) {
                let str = html.replace(/<\/?[^>]*>/gim, "");    //去掉所有的html标记
                let result = str.replace(/(^\s+)|(\s+$)/g, ""); //去掉前后空格
                return result.replace(/[\r\n]/g, "");
            }
            else
                return '';
        };

        stripScript(s) {
            let pattern = new RegExp("[`~!@#$^&*()=|{}';:：',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘'。，、？]")
            let rs = "";
            for (let i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        };

        getENLengthInWord(str) {
            if (/[a-z]/i.test(str)) {
                return str.match(/[a-z]/ig).length;
            }
            return 0;
        };


        getDigest(html) {
            if (html) {
                var text = this.delHtmlTag(html);
                text = text.replace(/&nbsp;|&nbsp/, "");
                var str = text.replace(/(^\s+)|(\s+$)/g, "");//去掉前后空格
                str = str.substring(0, 80);
                return str;
            }
            return "";
        };

        getMinStringInArray(arr) {
            let max_arr = [];
            for (let i = 0; i < arr.length; i++) {
                let p = true;
                for (let j = 0; j < arr.length; j++) {
                    if (arr[i].match(arr[j]) && arr[i].length > arr[j].length) {
                        p = false;
                        break;
                    }
                }
                if (p) {
                    max_arr.push(arr[i]);
                }
            }
            return max_arr;
        };

        isAllMsgFace(text) {
            let reg = /\/::\)|\/::~|\/::B|\/::\||\/:8-\)|\/::<|\/::$|\/::X|\/::Z|\/::'\(|\/::-\||\/::@|\/::P|\/::D|\/::O|\/::\(|\/::\+|\/:--b|\/::Q|\/::T|\/:,@P|\/:,@-D|\/::d|\/:,@o|\/::g|\/:\|-\)|\/::!|\/::L|\/::>|\/::,@|\/:,@f|\/::-S|\/:\?|\/:,@x|\/:,@@|\/::8|\/:,@!|\/:!!!|\/:xx|\/:bye|\/:wipe|\/:dig|\/:handclap|\/:&-\(|\/:B-\)|\/:<@|\/:@>|\/::-O|\/:>-\||\/:P-\(|\/::'\||\/:X-\)|\/::\*|\/:@x|\/:8\*|\/:pd|\/:|\/:beer|\/:basketb|\/:oo|\/:coffee|\/:eat|\/:pig|\/:rose|\/:fade|\/:showlove|\/:heart|\/:break|\/:cake|\/:li|\/:bome|\/:kn|\/:footb|\/:ladybug|\/:shit|\/:moon|\/:sun|\/:gift|\/:hug|\/:strong|\/:weak|\/:share|\/:v|\/:@\)|\/:jj|\/:@@|\/:bad|\/:lvu|\/:no|\/:ok|\/:love|\/:|\/:jump|\/:shake|\/:|\/:circle|\/:kotow|\/:turn|\/:skip|\/:oY|\/:#-0|\/:hiphot|\/:kiss|\/:<&|\/:&>/ig
            text = text.replace(reg, "");
            if (text.trim() == "") {
                return true;
            }
            return false;
        };


    }
    return Tool;
};