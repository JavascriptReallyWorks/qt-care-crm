exports.config = {
    capabilities: {
        'browserName': 'chrome'
    },
    baseUrl: 'http://127.0.0.1:7072',

    framework: 'jasmine',

    jasmineNodeOpts: {
        defaultTimeoutInterval: 30000
    },

    specs: [
        // 'login.test.js',
        'answer_chat_view.test.js',
        // 'medical_record_manager.test.js',
    ],

    // when using async/await
    SELENIUM_PROMISE_MANAGER: false,


    /*
    onPrepare: function() {
        browser.waitForAngularEnabled(false);

        browser.get('/login');
        element(by.id("luser")).clear().sendKeys('cat');
        element(by.id("lpass")).clear().sendKeys('111');
        element(by.id("lcaptcha")).clear().sendKeys('1');
        element(by.className("button")).click();

        // Login takes some time, so wait until it's done.
        // For the test app's login, we know it's done when it redirects to
        // index.html.
        return browser.driver.wait(function() {
            return browser.driver.getCurrentUrl().then(function(url) {
                return /index/.test(url);
                // return;
            });
        }, 10000);
    }
    */
};
