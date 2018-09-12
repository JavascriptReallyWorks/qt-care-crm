/**
 * Created by lele on 16/6/29.
 */

'use strict'

describe('ZLApp.priority_filter',function () {
    beforeEach(module('ZLApp'));
    beforeEach(module('ZLApp.priority-filter'));
    
    describe('test priority-filter',function () {
        it('should true',inject(function ($filter,ComparePriority, ZLService) {
            var effects = [
                {
                    "cancer_name" : "肺癌",
                    "lc_type" : "11",
                    "category" : "11",
                    "drug_name" : "Keytruda",
                    "chinese_name" : "派姆单抗",
                    "orr" : "",
                    "pfs" : 5.2,
                    "os" : 17.3,
                    "adverse" : "",
                    "trial" : "keynote-010",
                    "stage" : [
                        "4"
                    ],
                    "pdl1" : "high"
                },
                {
                    "cancer_name" : "肺癌",
                    "lc_type" : "11",
                    "category" : "11",
                    "drug_name" : "Keytruda",
                    "chinese_name" : "派姆单抗",
                    "orr" : 41,
                    "pfs" : "",
                    "os" : "",
                    "adverse" : "",
                    "trial" : ""
                },
                {
                    "cancer_name" : "肺癌",
                    "lc_type" : "11",
                    "category" : "11",
                    "drug_name" : "Keytruda",
                    "chinese_name" : "派姆单抗",
                    "orr" : "",
                    "pfs" : 4,
                    "os" : 12.7,
                    "adverse" : 16,
                    "trial" : "NCT01905657",
                    "treated" : "true",
                    "pdl1" : "high"
                }
            ];
            var condition = ZLService.getCondition();
            condition.stage = {
                match_type:"contain",
                value:"4"
            };
            condition.pdl1 = "high";
            condition.drug_name = "Keytruda";
            condition.cancer_name = "肺癌";
            var trial = ZLService.getEffectTrial();
            var data = ZLService.getEffectData();
            var effect = $filter('prioritySelf')(effects, [condition, data, trial])[0];
            expect(effect.os).toEqual(17.3);
        }))
    });
})