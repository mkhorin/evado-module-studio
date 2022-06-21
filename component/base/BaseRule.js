/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../param/ParamContainer');

module.exports = class BaseRule extends Base {

    static getConstants () {
        return {
            PARAM_MAP: {
                'custom': require('../../model/ruleParam/CustomParam'),
                'email': require('../../model/ruleParam/EmailParam'),
                'expression': require('../../model/ruleParam/ExpressionParam'),
                'condition': require('../../model/ruleParam/ConditionParam'),
                'date': require('../../model/ruleParam/DateParam'),
                'number': require('../../model/ruleParam/NumberParam'),
                'string': require('../../model/ruleParam/StringParam'),
                'regex': require('../../model/ruleParam/RegexParam'),
                'relationCounter': require('../../model/ruleParam/RelationCounterParam'),
                'unique': require('../../model/ruleParam/UniqueParam')
            },
            ATTR_LABELS: {
                type: 'Validator type'
            },
            ATTR_VALUE_LABELS: {
                'type': {
                    custom: 'Custom validator',
                    email: 'Email',
                    string: 'String',
                    number: 'Number',
                    date: 'Date',
                    expression: 'Calculated expression',
                    condition: 'Condition',
                    regex: 'Regular expression',
                    relationCounter: 'Relation counter',
                    unique: 'Uniqueness'
                }
            }
        };
    }
};
module.exports.init();