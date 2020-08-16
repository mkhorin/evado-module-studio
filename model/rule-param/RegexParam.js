/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseRuleParam');

module.exports = class RegexParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'pattern',
                'flags',
                'mismatch'
            ]),
            RULES: super.RULES.concat([
                ['pattern', 'required'],
                [['pattern', 'flags', 'message'], 'string'],
                ['mismatch', 'checkbox']
            ])
        };
    }
};
module.exports.init(module);