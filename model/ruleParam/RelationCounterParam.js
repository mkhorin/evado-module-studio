/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseRuleParam');

module.exports = class RelationCounterParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'max',
                'min'
            ],
            RULES: [
                ...super.RULES,
                [['max', 'min'], 'integer', {min: 1}]
            ],
            ATTR_LABELS: {
                max: 'Maximum objects',
                min: 'Minimum objects'
            }
        };
    }
};
module.exports.init(module);