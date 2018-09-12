var EC = protractor.ExpectedConditions;


describe('medical record list view', function() {
    it('should show list', function() {

        browser.waitForAngularEnabled(false);
        browser.get('/login');
        element(by.id("luser")).sendKeys('admin');
        element(by.id("lpass")).sendKeys('admin');
        element(by.id("lcaptcha")).sendKeys('1');
        element(by.className("button")).click();
        browser.waitForAngularEnabled(true);

        element(by.repeater('m in user.role.menu').row(0)).click();     // 病历管理

        browser.wait(EC.visibilityOf(element.all(by.repeater('md in list.rows')).first()), 3000);
        expect(element.all(by.repeater('md in list.rows')).count()).toBeGreaterThan(0);

        var fisrtMD = element.all(by.repeater('md in list.rows')).get(0);
        expect(fisrtMD.element(by.id("patientName")).getText()).toMatch(new RegExp('test_patient',''));

        fisrtMD.element(by.className("btn-primary")).click();
        // $('.btn-primary').click();
        expect(element.all(by.tagName('input')).get(0).getAttribute('value')).toMatch(new RegExp('test_patient',''));
        element.all(by.tagName('input')).get(0).clear().sendKeys('test_patient_2');
        $('#save_btn').click();

        browser.navigate().back();
        browser.wait(EC.visibilityOf(element.all(by.repeater('md in list.rows')).first()), 3000);
        var fisrtMD_2 = element.all(by.repeater('md in list.rows')).get(0);
        expect(fisrtMD_2.element(by.id("patientName")).getText()).toMatch(new RegExp('test_patient_2','ig'));
        fisrtMD_2.element(by.className("btn-danger")).click();
        $('.md-confirm-button').click();

        browser.wait(function () {

        },3500);

    });
});