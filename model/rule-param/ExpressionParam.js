/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseRuleParam');

module.exports = class ExpressionParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'expression'
            ]),
            RULES: super.RULES.concat([
                ['expression', 'json']
            ]),
            ATTR_LABELS: {
                'expression': 'Calculated expression'
            }
        };
    }
};
module.exports.init(module);