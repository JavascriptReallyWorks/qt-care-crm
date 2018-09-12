/**
 * Created by lele on 16/6/23.
 */
'usr strict'

describe('ZLApp survival directive',function () {
    beforeEach(module('ZLApp'));
    beforeEach(module('ZLApp.survival-directive'));

    
    describe('survival directive',function () {
        it('should svg',inject(function ($rootScope,$compile) {
            var scope = $rootScope.$new();
            scope.field = 'os';
            var element = $compile("<survival></survival>")(scope);
            expect(element.html()).toContain("svg");

        }))
    })
})