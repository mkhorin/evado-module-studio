/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseRuleParam');

module.exports = class ConditionParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'condition'
            ],
            RULES: [
                ...super.RULES,
                ['condition', 'json']
            ]
        };
    }
};
module.exports.init(module);