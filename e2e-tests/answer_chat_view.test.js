/*
    browser1: admin answer_chat_manager 全部问答
    browser2: admin answer_chat_manager 有效问答
    browser3: driver_cs_test 测试前最好没有对话
    browser4: qt_cs_test, 测试前最好没有对话

    // 全局变量 secondConv1和secondConv2 由于绑定的是secondMessage, 当最新消息变为thirdMessage后，secondConv1和secondConv2不再指向之前的对话，不可用

 */

let textSender = require('./helper/send_text');
let EC = protractor.ExpectedConditions;

let browser2, browser3, browser4, $2, $3, $4, element2, element3, element4;
let browser1ConvCount, browser2ConvCount;
let secondConv1, secondConv2;   // 在browser1和browser2中secondMessage对应的对话

const ADMIN = 'admin',
    DRIVER_CS = 'driver_cs',
    DRIVER_CS_TEST = 'driver_cs_test',
    QT_CS = 'qt_cs',
    QT_CS_TEST = 'qt_cs_test',
    QUEUE = '排队',
    NEW_MESSAGE = '新消息',
    COUNTED_CONVERSATION = '有效对话';

// 第一条发给 第一个对话， 第二、三条发给第二个对话
const firstMessage = 'first_message', secondMessage = 'second_message', thirdMessage = 'third_message';



describe('answer_chat_view', function() {
    it('should login and show answer_chat_view && answer_chat_manager tabs', async function() {

        // admin login
        browser.waitForAngularEnabled(false);
        browser.ignoreSynchronization = true;

        browser2 = browser.forkNewDriverInstance(false, true);
        browser3 = browser.forkNewDriverInstance(false, true);
        browser4 = browser.forkNewDriverInstance(false, true);


        await browser.get('/login');
        await $('#luser').sendKeys(ADMIN);
        await $('#lpass').sendKeys(ADMIN);
        await $('#lcaptcha').sendKeys('1');
        await $('.button').click();
        browser.waitForAngularEnabled(true);
        let answerChatManagerTab1 = element.all(by.repeater('m in user.role.menu')).filter(async function(elem){
                return (await elem.getText()) === '在线问答管理';
        }).first();
        await answerChatManagerTab1.click();

        // browser2 admin login
        browser2.waitForAngularEnabled(false);
        await browser2.get('/login');
        $2 = browser2.$;
        element2 = browser2.element;
        await $2('#luser').sendKeys(ADMIN);
        await $2('#lpass').sendKeys(ADMIN);
        await $2('#lcaptcha').sendKeys('1');
        await $2('.button').click();
        browser2.waitForAngularEnabled(true);
        let answerChatManagerTab2 = element2.all(by.repeater('m in user.role.menu')).filter(async function(elem){
            return (await elem.getText()) === '在线问答管理';
        }).first();
        await answerChatManagerTab2.click();
        await $2('.dropdown a').click();
        let countedConvTab = element2.all(by.repeater('option in convTypeOptions')).filter(async function(elem){
            return (await elem.getText()) === COUNTED_CONVERSATION;
        }).first();
        await countedConvTab.click();

        // browser3 login
        browser3.waitForAngularEnabled(false);
        await browser3.get('/login');
        $3 = browser3.$;
        element3 = browser3.element;
        await $3('#luser').sendKeys(DRIVER_CS_TEST);
        await $3('#lpass').sendKeys(DRIVER_CS_TEST);
        await $3('#lcaptcha').sendKeys('1');
        await $3('.button').click();
        browser3.waitForAngularEnabled(true);
        let answerChatTab3 = element3.all(by.repeater('m in user.role.menu')).filter(async function(elem){
            return (await elem.getText()) === '在线回答';
        }).first();
        expect(answerChatTab3.isPresent()).toBe(true);
        await browser3.get('/cs/#!/answer_chat');

        // browser4 login
        await browser4.waitForAngularEnabled(false);
        await browser4.get('/login');
        $4 = browser4.$;
        element4 = browser4.element;
        await $4('#luser').sendKeys(QT_CS_TEST);
        await $4('#lpass').sendKeys(QT_CS_TEST);
        await $4('#lcaptcha').sendKeys('1');
        await $4('.button').click();
        browser4.waitForAngularEnabled(true);
        let answerChatTab4 = element4.all(by.repeater('m in user.role.menu')).filter(async function(elem){
            return (await elem.getText()) === '在线回答';
        }).first();
        await expect(answerChatTab4.isPresent()).toBe(true);
        browser4.get('/cs/#!/answer_chat');
    });


    it('should show first conversation in all four browsers', async function () {
        textSender.sendText(firstMessage);
        await browser.sleep(2000);

        // browser1 记录管理页面初始对话个数
        browser1ConvCount = await element.all(by.repeater('conv in convs')).count();
        let firstConv1 = element.all(by.repeater('conv in convs')).filter(async function(elem){
                let text = await elem.element(by.className('new_message')).getText();
                return (new RegExp(text,'')).test(firstMessage);
        }).first();
        await firstConv1.click();
        await browser.sleep(1000);
        let messages1 = element.all(by.repeater('message in curMessages track by $index'));
        expect(await messages1.count()).toEqual(1);
        expect(await messages1.first().getText()).toMatch(new RegExp(firstMessage,'ig'));


        // browser2 记录管理页面初始对话个数
        browser2ConvCount = await element2.all(by.repeater('conv in convs')).count();
        let firstConv2 = element2.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(firstMessage);
        }).first();
        await firstConv2.click();
        await browser2.sleep(1000);
        let messages2 = element2.all(by.repeater('message in curMessages track by $index'));
        expect(await messages2.count()).toEqual(1);
        expect(await messages2.first().getText()).toMatch(new RegExp(firstMessage,'ig'));

        // browser3 对话数为1
        expect(await element3.all(by.repeater('conv in convs')).count()).toEqual(1);
        let firstConv3 = element3.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(firstMessage);
        }).first();
        await firstConv3.click();
        await browser3.sleep(1000);
        let messages3 = element3.all(by.repeater('message in curMessages track by $index'));
        expect(await messages3.count()).toEqual(1);
        expect(await messages3.first().getText()).toMatch(new RegExp(firstMessage,'ig'));
    });


    it('should show second conversation in browser1, browser2, browser3 ', async function () {
        textSender.sendText(secondMessage);
        await browser.sleep(2000);

        // browser1 对话个数+1
        expect(await element.all(by.repeater('conv in convs')).count()).toEqual(browser1ConvCount + 1);
        secondConv1 = element.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(secondMessage);
        }).first();
        // browser1 对话2显示 DRIVER_CS 排队
        expect(await secondConv1.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + QUEUE,''));
        await secondConv1.click();
        await browser.sleep(2000);
        let messages1 = element.all(by.repeater('message in curMessages track by $index'));
        expect(await messages1.count()).toEqual(1);
        expect(await messages1.first().getText()).toMatch(new RegExp(secondMessage,'ig'));


        // browser2 对话个数+1
        expect(await element2.all(by.repeater('conv in convs')).count()).toEqual(browser2ConvCount + 1);
        secondConv2 = element2.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(secondMessage);
        }).first();
        // browser2 对话2显示 DRIVER_CS 排队
        expect(await secondConv2.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + QUEUE,''));
        await secondConv2.click();
        await browser.sleep(2000);
        let messages2 = element2.all(by.repeater('message in curMessages track by $index'));
        expect(await messages2.count()).toEqual(1);
        expect(await messages2.first().getText()).toMatch(new RegExp(secondMessage,'ig'));

        // browser3 对话数为2
        expect(await element3.all(by.repeater('conv in convs')).count()).toEqual(2);
    });


    it('browser3 replies second conversation M_TO_1, browser1 and browser2 corresponds correctly', async function () {
        let newConv3 = element3.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(secondMessage);
        }).first();
        // browser3中对话2显示排队
        expect(await newConv3.element(by.className('user')).getText()).toMatch(new RegExp(QUEUE,''));
        await newConv3.click();
        await browser3.sleep(2000);
        // browser3中对话2显示新消息
        expect(await newConv3.element(by.className('user')).getText()).toMatch(new RegExp(NEW_MESSAGE,''));
        let messages3 = element3.all(by.repeater('message in curMessages track by $index'));
        expect(await messages3.count()).toEqual(1);
        expect(await messages3.first().getText()).toMatch(new RegExp(secondMessage,'ig'));

        // browser3 对话数为仍为2
        expect(await element3.all(by.repeater('conv in convs')).count()).toEqual(2);
        // browser1 对话2显示DRIVER_CS_TEST接听
        expect(await secondConv1.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + DRIVER_CS_TEST,''));
        // browser2 对话2显示DRIVER_CS_TEST接听
        expect(await secondConv2.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + DRIVER_CS_TEST,''));
    });



    it('browser3(DRIVER_CS_TEST) transfer secondConv 1_TO_1 to browser4(QT_CS_TEST)', async function(){
        await $3('#dLabel').click();
        // mouse over QT_CS to transfer conv
        let qtCsRole = element3.all(by.repeater('role in crmUserMap')).filter(async function(elem){
            return (await elem.getText()) === QT_CS;
        }).first();
        await browser3.actions().mouseMove(qtCsRole).perform();
        // find QT_CS_TEST
        let qtCsUser = element3.all(by.repeater('u in role.users')).filter(async function(elem){
            return (await elem.getText()) === QT_CS_TEST;
        }).first();
        await qtCsUser.click();
        await browser3.sleep(2000);
        // browser3 对话数-1
        expect(await element3.all(by.repeater('conv in convs')).count()).toEqual(1);
        // 当前对话删除
        expect(await element3.all(by.repeater('message in curMessages track by $index')).count()).toEqual(0)

        // browser4 对话数+1
        expect(await element4.all(by.repeater('conv in convs')).count()).toEqual(1);
        let newConv4 = element4.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(secondMessage);
        }).first();
        expect(await newConv4.element(by.className('user')).getText()).toMatch(new RegExp(NEW_MESSAGE,''));
        await newConv4.click();
        await browser4.sleep(2000);
        let messages4 = element4.all(by.repeater('message in curMessages track by $index'));
        expect(await messages4.count()).toEqual(1);
        expect(await messages4.first().getText()).toMatch(new RegExp(secondMessage,'ig'));

        // browser1 对话2显示QT_CS 队列中 QT_CS_TEST 接听
        expect(await secondConv1.element(by.className('user')).getText()).toMatch(new RegExp(QT_CS + '.*' + QT_CS_TEST,''));
        // browser2 对话2显示QT_CS 队列中 QT_CS_TEST 接听
        expect(await secondConv2.element(by.className('user')).getText()).toMatch(new RegExp(QT_CS + '.*' + QT_CS_TEST,''));
    });

    it('browser4(QT_CS_TEST) transfer secondConv 1_TO_M back to browser3(DRIVER_CS queue)', async function() {
        let newConv4 = element4.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(secondMessage);
        }).first();
        await newConv4.click();
        await $4('#dLabel').click();
        // mouse over DRIVER_CS to transfer conv
        let driverCsRole = element4.all(by.repeater('role in crmUserMap')).filter(async function(elem){
            return (await elem.getText()) === DRIVER_CS;
        }).first();
        await browser4.actions().mouseMove(driverCsRole).perform();
        // find DRIVER_CS_TEST
        let driverCsQueue = element4.all(by.repeater('u in role.users')).filter(async function(elem){
            return (await elem.getText()) === QUEUE;
        }).first();
        await driverCsQueue.click();
        await browser4.sleep(2000);
        // browser4 对话数-1
        expect(await element4.all(by.repeater('conv in convs')).count()).toEqual(0);
        // browser4 当前对话删除
        expect(await element4.all(by.repeater('message in curMessages track by $index')).count()).toEqual(0)
        // browser3 对话数+1
        expect(await element3.all(by.repeater('conv in convs')).count()).toEqual(2);

        // browser1 对话2显示DRIVER_CS 队列中排队
        expect(await secondConv1.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + QUEUE,''));
        // browser2 对话2显示DRIVER_CS 队列中排队
        expect(await secondConv2.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + QUEUE,''));

        let newConv3 = element3.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(secondMessage);
        }).first();
        // browser3中对话2显示排队
        expect(await newConv3.element(by.className('user')).getText()).toMatch(new RegExp(QUEUE,''));
        // // browser3再次接入对话2
        // await newConv3.click();
        // await browser3.sleep(2000);
        // // browser3中对话2显示新消息
        // expect(await newConv3.element(by.className('user')).getText()).toMatch(new RegExp(NEW_MESSAGE,''));
        // let messages3 = element3.all(by.repeater('message in curMessages track by $index'));
        // expect(await messages3.count()).toEqual(1);
        // expect(await messages3.first().getText()).toMatch(new RegExp(secondMessage,'ig'));
        //
        // // browser3 对话数为仍为2
        // expect(await element3.all(by.repeater('conv in convs')).count()).toEqual(2);
        // // browser1 对话2显示DRIVER_CS_TEST接听
        // expect(await secondConv1.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + DRIVER_CS_TEST,''));
        // // browser2 对话2显示DRIVER_CS_TEST接听
        // expect(await secondConv2.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + DRIVER_CS_TEST,''));
    });

    it('browser1(ADMIN) transfer secondConv M_TO_M from DRIVER_CS queue to browser4(QT_CS queue)', async function() {
        await $('#dLabel').click();
        // mouse over QT_CS to transfer conv
        let qtCsRole = element.all(by.repeater('role in crmUserMap')).filter(async function(elem){
            return (await elem.getText()) === QT_CS;
        }).first();
        await browser.actions().mouseMove(qtCsRole).perform();
        // find QT_CS queue
        let qtCsQueue = element.all(by.repeater('u in role.users')).filter(async function(elem){
            return (await elem.getText()) === QUEUE;
        }).first();
        await qtCsQueue.click();
        await browser.sleep(2000);
        // browser4 对话数+1
        expect(await element4.all(by.repeater('conv in convs')).count()).toEqual(1);
        // browser3 对话数-1
        expect(await element3.all(by.repeater('conv in convs')).count()).toEqual(1);

        let newConv4 = element4.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(secondMessage);
        }).first();
        // browser4中对话2显示排队
        expect(await newConv4.element(by.className('user')).getText()).toMatch(new RegExp(QUEUE,''));

        // browser1 对话2显示QT_CS 队列中排队
        expect(await secondConv1.element(by.className('user')).getText()).toMatch(new RegExp(QT_CS + '.*' + QUEUE,''));
        // browser2 对话2显示QT_CS 队列中排队
        expect(await secondConv2.element(by.className('user')).getText()).toMatch(new RegExp(QT_CS + '.*' + QUEUE,''));
    });

    it('browser1(ADMIN) transfer secondConv M_TO_1 from QT_CS queue to browser3(DRIVER_CS_TEST)', async function() {
        await $('#dLabel').click();
        // mouse over QT_CS to transfer conv
        let driverCsRole = element.all(by.repeater('role in crmUserMap')).filter(async function(elem){
            return (await elem.getText()) === DRIVER_CS;
        }).first();
        await browser.actions().mouseMove(driverCsRole).perform();
        // find QT_CS queue
        let driverCsUser = element.all(by.repeater('u in role.users')).filter(async function(elem){
            return (await elem.getText()) === DRIVER_CS_TEST;
        }).first();
        await driverCsUser.click();
        await browser.sleep(2000);
        // browser4 对话数-1
        expect(await element4.all(by.repeater('conv in convs')).count()).toEqual(0);
        // browser3 对话数+1
        expect(await element3.all(by.repeater('conv in convs')).count()).toEqual(2);

        // browser1 对话2显示QT_CS 队列中排队
        expect(await secondConv1.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + DRIVER_CS_TEST,''));
        // browser2 对话2显示QT_CS 队列中排队
        expect(await secondConv2.element(by.className('user')).getText()).toMatch(new RegExp(DRIVER_CS + '.*' + DRIVER_CS_TEST,''));

        let newConv3 = element3.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(secondMessage);
        }).first();
        // browser3中对话2显示新消息
        expect(await newConv3.element(by.className('user')).getText()).toMatch(new RegExp(NEW_MESSAGE,''));
        await newConv3.click();
        await browser3.sleep(2000);
    });


    it('secondConv send new message(thirdMessage)', async function () {
        // browser3 发送第二条消息
        await element3(by.model('msg_content')).sendKeys(thirdMessage);
        await $3('#send_btn').click();
        await browser3.sleep(2000);
        let messages3 = element3.all(by.repeater('message in curMessages track by $index'));
        expect(await messages3.count()).toEqual(2);
        expect(await messages3.last().getText()).toMatch(new RegExp(thirdMessage,'ig'));

        // browser3 中第二个对话最新消息变为thirdMessage
        let newConv3 = element3.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(thirdMessage);
        }).first();
        expect(newConv3.isPresent()).toBe(true);

        // 全局变量 secondConv1和secondConv2 由于绑定的是secondMessage, 当最新消息变为thirdMessage后，secondConv1和secondConv2不再指向之前的对话，不可用
        // browser1 中第二个对话最新消息变为thirdMessage
        let newConv1 = element.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(thirdMessage);
        }).first();
        expect(newConv1.isPresent()).toBe(true);

        // browser2 中第二个对话最新消息变为thirdMessage
        let newConv2 = element2.all(by.repeater('conv in convs')).filter(async function(elem){
            let text = await elem.element(by.className('new_message')).getText();
            return (new RegExp(text,'')).test(thirdMessage);
        }).first();
        expect(newConv2.isPresent()).toBe(true);
    });


    it('browser3 new create medical record', async function () {
        await $3('#new_md').click();
        await browser3.sleep(1000);
        await $3('.fa-plus').click();
        await browser3.sleep(1000);
        /*  下面的代码找不到element，不知道原因
            browser2.wait(EC.visibilityOf(element2.all(by.repeater('medicalRecord in medicalRecords')).first()), 7500);
            element2.all(by.repeater('medicalRecord in medicalRecords track by $index')).then(function(mds) {
                var nameInput = mds[0].all(by.tagName('input')).get(0);
                nameInput.sendKeys('hello world');
            });
        */

        let nameInput = element3.all(by.tagName('input')).get(1);
        await nameInput.clear().sendKeys('test_patient');
        await $3('#save_btn').click();
        await browser3.sleep(2000);

        // browser3 结束对话2
        await $3('#end_btn').click();
        await $3('.md-confirm-button').click();
        await browser3.sleep(2000);
        expect(await element3.all(by.repeater('conv in convs')).count()).toEqual(1);
        expect(await element3.all(by.repeater('message in curMessages track by $index')).count()).toEqual(0);

        await browser3.sleep(10000);
    })

});
