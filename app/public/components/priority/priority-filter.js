/**
 * Created by lele on 16/7/14.
 */

angular.module('ZLApp.priority-filter', [])
    .filter("priorityCompare", ['$filter', 'ComparePriority', 'ZLService', function ($filter, ComparePriority, ZLService) {
        return function (effects, conditions) {
            var condition = conditions[0],
                effectData = conditions[1],
                effectTrial = conditions[2],
                effectProvision = ZLService.getEffectProvision();

            var resultEffect = [];
            if(!effects){
                return false;
            }
            for (var e in effects) {
                var value = effects[e],include = true;

                value.priority = 0; //优先级


                //同一临床实验
                if (effectTrial && effectTrial.trial) {
                    if (value.trial && effectTrial.trial && value.trial.toUpperCase() == effectTrial.trial.toUpperCase()) {
                        value.priority += ComparePriority.getConstant('TRIAL_EQUAL');
                    }
                }

                if (effectProvision && effectProvision.provision) {
                    //high 优先于条件显示
                    if (value.provision == "high") {
                        value.priority += ComparePriority.getConstant('PROVISION_HIGH');
                    }
                    //low 优先于数值,低于条件显示
                    if (value.provision == "low") {
                        value.priority += ComparePriority.getConstant('PROVISION_LOW');
                    }
                    // NONE不显示
                    if (value.provision == "none") {
                        value.priority += ComparePriority.getConstant('PROVISION_NONE');
                        include = false;
                    }
                }

                condition.drug_name = value.drug_name;
                //属性条件
                conditionCompare(value, condition, ComparePriority, "compare");
                //值是否对称权重
                if (effectData && (effectData.orr || effectData.pfs || effectData.os || effectData.mos || effectData.mpfs || effectData.sre || effectData.efs_year_2 || effectData.sr_year_2 || effectData.sr_m_6 || effectData.pfsr_m_6 || effectData.orr_cycle_1)) {
                    var num = 0;
                    for (var p in effectData) {
                        //值对应
                        if (compareData("unEmpty", value[p], effectData[p])) {
                            value.priority += ComparePriority.getConstant('VALUE_EQUAL');
                            num++;
                        }
                    }
                    //值全不对应
                    if (num == 0) {
                        value.priority += ComparePriority.getConstant('VALUE_UNEQUAL');
                    }
                }

                resultEffect.push(value);
            }
            if(!resultEffect && resultEffect.length <=0){
                return false;
            }
            var orderByEffects = $filter('orderBy')($filter('filter')(resultEffect, function (value) {
                if (value.priority > 0) {
                    return value;
                }
            }), ["priority", "orr", "os", "pfs", "mos", "mpfs", "sre",'efs_year_2','sr_year_2','sr_m_6','pfsr_m_6','orr_cycle_1'], true);


            var drugNames = [];
            var _effects = [];
            $filter('orderBy')($filter('filter')(orderByEffects, function (value) {
                if (drugNames.indexOf(value.drug_name) == -1) {
                    _effects.push(value);
                    drugNames.push(value.drug_name);
                }
            }));

            return _effects;
        }
    }])
    .filter("prioritySelf", ['$filter', 'ComparePriority', 'ZLService', function ($filter, ComparePriority, ZLService) {
        return function (effects, conditions) {
            var condition = conditions[0],
                effectProvision = ZLService.getEffectProvision();

            var resultEffect = [];

            for (var e in effects) {

                var value = effects[e],include = true;
                //if (drug.drug_name == value.drug_name && drug.cancer_name == value.cancer_name) {
                value.priority = 0; //优先级
                if (effectProvision && effectProvision.provision) {
                    //high 优先于条件显示
                    if (value.provision == "high") {
                        value.priority += ComparePriority.getConstant('PROVISION_HIGH');
                    }
                    //low 优先于数值,低于条件显示
                    if (value.provision == "low") {
                        value.priority += ComparePriority.getConstant('PROVISION_LOW');
                    }
                    // NONE不显示
                    if (value.provision == "none") {
                        value.priority += ComparePriority.getConstant('PROVISION_NONE');
                        include = false;
                    }
                }

                //属性条件
                conditionCompare(value, condition, ComparePriority);

                resultEffect.push(value);
            }
            //}
            var orderByEffects = $filter('orderBy')($filter('filter')(resultEffect, function (value) {
                if (value.priority > 0) {
                    return value;
                }
            }), ["priority", "orr", "os", "pfs", "mos", "mpfs", "sre",'efs_year_2','sr_year_2','sr_m_6','pfsr_m_6','orr_cycle_1'], true);

            var drugNames = [];
            var _effects = [];


            $filter('orderBy')($filter('filter')(orderByEffects, function (value) {
                if (drugNames.indexOf(value.drug_name) == -1) {
                    _effects.push(value);
                    drugNames.push(value.drug_name);
                }
            }));
            return _effects;
        }
    }]);

//条件查询
function conditionCompare(value, condition, ComparePriority, compare) {
    for (var p in condition) {
        var condition_value;
        //条件值为非对象的时候 或 条件为对象且比较方式为equal 做 == 比较
        if (typeof(condition[p]) != "object" || (typeof(condition[p]) == "object" && condition[p].match_type == "equal")) {
            if (typeof(condition[p]) == "object") {
                condition_value = condition[p].value;
            } else {
                condition_value = condition[p];
            }
            if (condition_value == "undefined") {
                condition_value = undefined;
            }

            //完全相等
            if (compareData("equal", value[p], condition_value)) {
                value.priority += ComparePriority.getConstant('CONDITION_EQUAL');
            }
            //完全不相等,同一种药
            if (compareData("unequal", value[p], condition_value)) {
                value.priority += ComparePriority.getConstant('CONDITION_UNEQUAL');
            }

            //包含
            if (!compare) {
                if (compareData("conditionContain", value[p], condition_value)) {
                    value.priority += ComparePriority.getConstant('CONDITION_CONTAIN');
                }
            } else {
                if (compareData("compareContain", value[p], condition_value) || compareData("conditionContain", value[p], condition_value)) {
                    value.priority += ComparePriority.getConstant('CONDITION_CONTAIN');
                }
            }
        }
        //条件为对象且比较方式为 contain 做 contain 比较
        if (typeof(condition[p]) == "object" && condition[p].match_type == "contain") {
            condition_value = condition[p].value;
            if (condition_value == "undefined") {
                condition_value = undefined;
            }
            if (compareData("ArrayEqual", value[p], condition_value)) {
                value.priority += ComparePriority.getConstant('CONDITION_EQUAL');
            }
            if (compareData("ArrayUnEqual", value[p], condition_value)) {
                value.priority += ComparePriority.getConstant('CONDITION_UNEQUAL');
            }
            //包含
            if (!compare) {
                if (compareData("conditionContain", value[p], condition_value)) {
                    value.priority += ComparePriority.getConstant('CONDITION_CONTAIN');
                }
            } else {
                if (compareData("compareContain", value[p], condition_value) || compareData("conditionContain", value[p], condition_value)) {
                    value.priority += ComparePriority.getConstant('CONDITION_CONTAIN');
                }
            }

        }
    }
}

//比较方式
function compareData(type, data, condition_value) {

    switch (type) {

        case "unEmpty":
            //比较双方都有值
            if (data && data != "" && condition_value && condition_value != "") {
                return true;
            }
            return false;
            break;
        case "equal":
            //相等
            if (data  && condition_value && data == condition_value) {
                return true;
            }
            return false;
            break;
        case "conditionContain":
            //条件不为空, 值为空 //单药
            if (!data && condition_value) {
                return true;
            }
            break;
        case "compareContain":
            //条件为空,值不为空 //药比较
            if (data && !condition_value) {
                return true;
            }
            break;
        case "unequal":
            //不为空,且不想等
            if (data != condition_value && data && condition_value) {
                return true;
            }
            break;
        case "ArrayEqual":
            //数组包含
            if ((data && data.indexOf(condition_value) != -1) || (!data && !condition_value)) {
                return true;
            }
            break;
        case "ArrayUnEqual":
            //不包含,且不为空
            if (data && data.indexOf(condition_value) == -1 && condition_value) {
                return true;
            }
            break;
        default :
            break;
    }

}