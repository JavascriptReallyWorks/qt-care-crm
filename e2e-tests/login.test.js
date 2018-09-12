describe('login view', function() {
    it('should login', function() {
        browser.waitForAngularEnabled(false);

        browser.get('/login');

        element(by.id("luser")).clear().sendKeys('qt_cs_test');
        element(by.id("lpass")).clear().sendKeys('qt_cs_test');
        element(by.id("lcaptcha")).clear().sendKeys('1');
        element(by.className("button")).click();
    });
});