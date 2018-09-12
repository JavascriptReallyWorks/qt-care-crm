/**
 * Created by lele on 16/7/21.
 */
'use strict';
describe('ZLApp search directive',function () {
    beforeEach(module('ZLApp'));
    beforeEach(module('ZLApp.search-directive'));


    describe('search directive',function () {
        it('should search',inject(function ($rootScope,$compile) {
            var scope = $rootScope.$new();

            var element = $compile("<search-bar></search-bar>")(scope);
            expect(element.html()).toContain("md-toolbar");
            expect(element.html()).toContain("hideSearch");

        }))
    })
})