/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseRuleParam');

module.exports = class ExpressionParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'expression'
            ],
            RULES: [
                ...super.RULES,
                ['expression', 'json']
            ]
        };
    }
};
module.exports.init(module);