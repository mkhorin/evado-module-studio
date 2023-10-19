/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseRuleParam');

module.exports = class UniqueParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'filter',
                'ignoreCase'
            ],
            RULES: [
                ...super.RULES,
                ['filter', 'json'],
                ['ignoreCase', 'checkbox']
            ]
        };
    }
};
module.exports.init(module);