'use strict';

module.exports = app => {
    class apiService extends app.Service {

        async getSubTag(r_tag) {
            const {helpDomain,URLS} = app.config.CONSTANT;

            let url = helpDomain+URLS.getSubTag;
            if (r_tag) {
                url += "&r_tag=" + encodeURIComponent(r_tag)
            }

            let result = await this.ctx.curl(url, {
                method: 'GET',
                dataType: 'json'
            });
            // console.log(result)
            return result.data;
        }

        async getTags() {
            const {URLS} = app.config.CONSTANT;
            let result = await this.ctx.curl(URLS.tagsJSON, {
                method: 'GET',
                dataType: 'json'
            });
            // console.log(result)
            return result.data;
        }

        async searchQa(cond,limit,from) {
            const {searchUrl,URLS} = app.config.CONSTANT;
            let url = searchUrl+URLS.searchQaLimit;
            let result = await this.ctx.helper.reqPost(url,{cond,limit,from});
            return result;
        }

        async getOneQa(id) {
            const {searchUrl,URLS} = app.config.CONSTANT;
            let url = searchUrl+URLS.getOneQa+"?id="+id;
            let result = await this.ctx.helper.reqGet(url);
            return result;
        }


    }
    return apiService;
};