/**
 * Created by lele on 16/6/29.
 */

'use strict'

describe('ZLApp.conditions_filter',function () {
    beforeEach(module('ZLApp'));
    beforeEach(module('ZLApp.contain-filter'));
    
    describe('test ["egfrt790m","pdl1","stage","treated"] contact "stage"',function () {
        it('should true',inject(function ($filter) {
            var contain = $filter("contain");
            expect(contain(["egfrt790m","pdl1","stage","treated"],"stage")).toBeTruthy();
            expect(contain(["egfrt790m","pdl1","stage","treated"],"her")).toBeFalsy();
        }))
    });
})