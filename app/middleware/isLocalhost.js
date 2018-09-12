module.exports = () => {
    return function*(next) {

        if (this.request.ip === '127.0.0.1') {
            yield next;
        } else {
            this.throw(404, '404');
        }
    };
};
