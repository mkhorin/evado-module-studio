/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseRuleParam');

module.exports = class NumberParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'integerOnly',
                'max',
                'min'
            ],
            RULES: [
                ...super.RULES,
                ['integerOnly', 'checkbox'],
                [['max', 'min'], 'number']
            ],
            ATTR_LABELS: {
                max: 'Maximum value',
                min: 'Minimum value'
            }
        };
    }
};
module.exports.init(module);