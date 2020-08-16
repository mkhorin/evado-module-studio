/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../param/ParamContainer');

module.exports = class BaseRule extends Base {

    static getConstants () {
        return {
            PARAM_MAP: {
                'custom': require('../../model/rule-param/CustomParam'),
                'email': require('../../model/rule-param/EmailParam'),
                'expression': require('../../model/rule-param/ExpressionParam'),
                'condition': require('../../model/rule-param/ConditionParam'),
                'number': require('../../model/rule-param/NumberParam'),
                'string': require('../../model/rule-param/StringParam'),
                'regex': require('../../model/rule-param/RegexParam'),
                'relationCounter': require('../../model/rule-param/RelationCounterParam'),
                'unique': require('../../model/rule-param/UniqueParam')
            },
            ATTR_VALUE_LABELS: {
                'type': {
                    custom: 'Custom validator',
                    email: 'Email',
                    condition: 'Condition',
                    expression: 'Expression',
                    number: 'Number',
                    string: 'String',
                    regex: 'Regular expression',
                    relationCounter: 'Relation counter',
                    unique: 'Unique'
                }
            }
        };
    }
};
module.exports.init();