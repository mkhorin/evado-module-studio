/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class BaseRuleParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'message',
                'when'
            ]),
            RULES: [
                ['message', 'string'],
                ['when', 'json']
            ],
            ATTR_EXT_HINTS: {
                when: 'Expression or spawn configuration of validation condition'
            }
        };
    }
};
module.exports.init(module);