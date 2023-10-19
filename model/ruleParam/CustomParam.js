/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseRuleParam');
const Validator = require('evado-meta-base/validator/Validator');

module.exports = class CustomParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'config'
            ],
            RULES: [
                ...super.RULES,
                ['config', 'required'],
                ['config', 'spawn', {BaseClass: Validator}],

            ],
            ATTR_LABELS: {
                config: 'Spawn configuration'
            }
        };
    }
};
module.exports.init(module);