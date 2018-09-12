/*
    browser1: admin answer_chat_manager 全部问答
    browser2: admin answer_chat_manager 有效问答
    browser3: driver_cs_test 测试前最好没有对话
    browser4: qt_cs_test, 测试前最好没有对话


    // browser3 点击查看新对话, 如果这个对话不在当前页面需要滚动才可以查看到的话，以下查询为空
    let newConv3 = element3.all(by.repeater('conv in convs')).filter(function(elem){
        return elem.element(by.className('user')).getText().then(function(text){
            return /新用户/.test(text);
        });
    })

 */

'use strict';
let textSender = require('./helper/send_text');
let EC = protractor.ExpectedConditions;

describe('answer_chat_view', function() {
    it('should show list', function() {

        //sendText('dummy'); // 确保browser 2,3中都有对话打开后能检测到。

        browser.waitForAngularEnabled(false);
        browser.get('/login');
        element(by.id("luser")).clear().sendKeys('qt_cs_test');
        element(by.id("lpass")).clear().sendKeys('qt_cs_test');
        element(by.id("lcaptcha")).clear().sendKeys('1');
        element(by.className("button")).click();
        browser.waitForAngularEnabled(true);
        browser.get('/cs/#!/answer_chat');

        // browser2 login
        var browser2 = browser.forkNewDriverInstance(false, true);
        browser2.ignoreSynchronization = true;
        browser2.get('/login');
        var $2 = browser2.$;
        var element2 = browser2.element;
        $2('#luser').sendKeys('driver_cs_test');
        $2('#lpass').sendKeys('driver_cs_test');
        $2('#lcaptcha').sendKeys('1');
        $2('.button').click();
        browser2.waitForAngularEnabled(true);
        browser2.get('/cs/#!/answer_chat');

        // browser3 login
        var browser3 = browser.forkNewDriverInstance(false, true);
        browser3.ignoreSynchronization = true;
        browser3.get('/login');
        var $3 = browser3.$;
        var element3 = browser3.element;
        $3('#luser').sendKeys('admin');
        $3('#lpass').sendKeys('admin');
        $3('#lcaptcha').sendKeys('1');
        $3('.button').click();
        browser3.waitForAngularEnabled(true);
        browser3.get('cs#!/cs/answer_chat_manager');

        let brower1ConvCount, brower2ConvCount, brower3ConvCount;

        // 等browser3原有对话出现，否则 brower3ConvCount统计错误
        browser3.wait(EC.visibilityOf(element3.all(by.repeater('conv in convs')).first()), 3000);
        element3.all(by.repeater('conv in convs')).count().then(function (countValue3) {    // browser3 记录管理页面初始对话个数
            brower3ConvCount = countValue3;

            element.all(by.repeater('conv in convs')).count().then(function (countValue1) {     // browser1 记录初始对话个数
                brower1ConvCount = countValue1;

                var newMessage =  Date.now().toString().substr(-4);

                // 等browser2原有对话出现，否则 brower2ConvCount统计错误
                var convElement = element2(by.repeater('conv in convs'));
                browser2.wait(EC.visibilityOf(convElement), 4000);
                element2.all(by.repeater('conv in convs')).count().then(function (countValue2) {    // browser2 记录初始对话个数
                    brower2ConvCount = countValue2;

                    // 发送http请求wechatAPI生成新对话
                    sendText(newMessage);

                    // browser3 等新对话，对话数+1
                    browser3.wait(function () {
                        return element3.all(by.repeater('conv in convs')).count().then(function (countValue) {
                            return countValue === (brower3ConvCount + 1);
                        });
                    }, 5000);

                    // browser3 点击查看新对话
                    let newConv3 = element3.all(by.repeater('conv in convs')).filter(function(elem){
                        return elem.element(by.className('user')).getText().then(function(text){
                            return /新用户/.test(text);
                        });
                    }).first();
                    newConv3.click();

                    // browser3 查看当前对话消息队列
                    var messages3 = element3(by.repeater('message in curMessages track by $index'));
                    browser3.wait(EC.visibilityOf(messages3), 6000);
                    expect(element3.all(by.repeater('message in curMessages track by $index')).count()).toEqual(1);
                    expect(element3.all(by.repeater('message in curMessages track by $index')).first().getText()).toMatch(new RegExp(newMessage,'ig'));




                    // browser2 等新对话，对话数+1
                    browser2.wait(function () {
                        return element2.all(by.repeater('conv in convs')).count().then(function (countValue) {
                            return countValue === (brower2ConvCount + 1);
                        });
                    }, 7000);

                    // browser2 接入新对话 M_TO_1
                    let newConv2 = element2.all(by.repeater('conv in convs')).filter(function(elem){
                        return elem.element(by.className('user')).getText().then(function(text){
                            return /新用户.*排队/.test(text);
                        });
                    }).first();
                    newConv2.click();

                    // browser2 接入后对话数不变
                    browser2.sleep(1000);
                    expect(element2.all(by.repeater('conv in convs')).count()).toEqual(brower2ConvCount + 1);


                    /* -1然后+1，变化太快，前段未必每次能检测到
                    role channel, browser2 对话数-1
                    browser2.wait(function () {
                        return element2.all(by.repeater('conv in convs')).count().then(function (countValue) {
                            return countValue === brower2ConvCount;
                        });
                    }, 8000);

                    room channel, browser2 对话数+1
                    browser2.wait(function () {
                        return element2.all(by.repeater('conv in convs')).count().then(function (countValue) {
                            return countValue === (brower2ConvCount + 1);
                        });
                    }, 9000);
                    */

                    // browser2 查看当前对话消息队列
                    var messages2 = element2(by.repeater('message in curMessages track by $index'));
                    browser2.wait(EC.visibilityOf(messages2), 10000);
                    expect(element2.all(by.repeater('message in curMessages track by $index')).count()).toEqual(1);
                    expect(element2.all(by.repeater('message in curMessages track by $index')).first().getText()).toMatch(new RegExp(newMessage,'ig'));

                    // browser2 转移对话
                    $2('#dLabel').click();
                    // mouse over qt_cs to transfer conv
                    let qtCsRole = element2.all(by.repeater('role in crmUserMap')).filter(function(elem){
                        return elem.getText().then(function(text){
                            return /qt_cs/.test(text);
                        });
                    }).first();
                    browser2.actions().mouseMove(qtCsRole).perform();

                    // browser2 转移对话 1_TO_1 to  qt_cs_test
                    let qtCsUser = element2.all(by.repeater('u in role.users')).filter(function(elem){
                        return elem.getText().then(function(text){
                            return text === 'qt_cs_test';
                        });
                    }).first();
                    qtCsUser.click();

                    // browser2 当前对话删除，brower2ConvCount减一
                    browser2.wait(function () {
                        return element2.all(by.repeater('conv in convs')).count().then(function (countValue) {
                            return countValue === brower2ConvCount;
                        });
                    }, 1500);
                    // 当前对话删除
                    expect(element2.all(by.repeater('message in curMessages track by $index')).count()).toEqual(0);


                    // browser1 新增对话，brower1ConvCount加1
                    browser.wait(function () {
                        return element.all(by.repeater('conv in convs')).count().then(function (countValue) {
                            return countValue === (brower1ConvCount + 1);
                        });
                    }, 2500);

                    // browser1 接入新对话
                    let newConv1 = element.all(by.repeater('conv in convs')).filter(function(elem){
                        return elem.element(by.className('user')).getText().then(function(text){
                            return /新用户/.test(text);
                        });
                    }).first();

                    expect(newConv1.element(by.className('user')).getText()).toMatch(new RegExp('新消息','ig'));

                    newConv1.click();

                    // browser1 点击新对话
                    var messages1 = element(by.repeater('message in curMessages track by $index'));
                    browser.wait(EC.visibilityOf(messages1), 3500);
                    expect(element.all(by.repeater('message in curMessages track by $index')).count()).toEqual(1);
                    expect(element.all(by.repeater('message in curMessages track by $index')).first().getText()).toMatch(new RegExp(newMessage,'ig'));

                    // browser1 转移对话 1_TO_M to driver_cs queue
                    $('#dLabel').click();
                    // mouse over driver_cs to transfer conv
                    let driverCsRole = element.all(by.repeater('role in crmUserMap')).filter(function(elem){
                        return elem.getText().then(function(text){
                            return /driver_cs/.test(text);
                        });
                    }).first();
                    browser.actions().mouseMove(driverCsRole).perform();

                    let driverCsQueue = element.all(by.repeater('u in role.users')).filter(function(elem){
                        return elem.getText().then(function(text){
                            return /排队/.test(text);
                        });
                    }).first();
                    driverCsQueue.click();

                    // browser1 当前对话删除，brower1ConvCount减一
                    browser.wait(function () {
                        return element.all(by.repeater('conv in convs')).count().then(function (countValue) {
                            return countValue === brower1ConvCount;
                        });
                    }, 4000);

                    // browser2 新增对话，brower2ConvCount加一
                    browser2.wait(function () {
                        return element2.all(by.repeater('conv in convs')).count().then(function (countValue) {
                            return countValue === (brower2ConvCount + 1) ;
                        });
                    }, 5500);


                    // browser2 再次接入新对话 M_TO_1
                    let newConv2_1 = element2.all(by.repeater('conv in convs')).filter(function(elem){
                        return elem.element(by.className('user')).getText().then(function(text){
                            return /新用户.*排队/.test(text);
                        });
                    }).first();
                    newConv2_1.click();

                    // browser2 接入后对话数不变
                    browser2.sleep(1000);
                    expect(element2.all(by.repeater('conv in convs')).count()).toEqual(brower2ConvCount + 1);

                    // browser2 查看当前对话消息队列
                    var messages2_1 = element2(by.repeater('message in curMessages track by $index'));
                    browser2.wait(EC.visibilityOf(messages2_1), 6500);
                    expect(element2.all(by.repeater('message in curMessages track by $index')).count()).toEqual(1);
                    expect(element2.all(by.repeater('message in curMessages track by $index')).first().getText()).toMatch(new RegExp(newMessage,'ig'));

                    // browser2 发送第二条消息
                    let secondMessage =  Date.now().toString().substr(-4);
                    element2(by.model('msg_content')).sendKeys(secondMessage);
                    $2('#send_btn').click();
                    browser2.sleep(1000);
                    expect(element2.all(by.repeater('message in curMessages track by $index')).count()).toEqual(2);
                    expect(element2.all(by.repeater('message in curMessages track by $index')).last().getText()).toMatch(new RegExp(secondMessage,'ig'));

                    // browser2 新增病例
                    $2('#new_md').click();
                    $2('.fa-plus').click();
                    /*  下面的代码找不到element，不知道原因
                        browser2.wait(EC.visibilityOf(element2.all(by.repeater('medicalRecord in medicalRecords')).first()), 7500);
                        element2.all(by.repeater('medicalRecord in medicalRecords track by $index')).then(function(mds) {
                            var nameInput = mds[0].all(by.tagName('input')).get(0);
                            nameInput.sendKeys('hello world');
                        });
                    */
                    let nameInput = element2.all(by.tagName('input')).get(1);
                    nameInput.clear().sendKeys('test_patient');
                    $2('#save_btn').click();

                    // browser2 结束对话
                    $2('#end_btn').click();
                    $2('.md-confirm-button').click();
                    browser2.sleep(2000);
                    expect(element2.all(by.repeater('message in curMessages track by $index')).count()).toEqual(0);
                    expect(element2.all(by.repeater('conv in convs')).count()).toEqual(brower2ConvCount);



                    browser2.close();
                    browser3.close();

                });

            });
        });
    });
});