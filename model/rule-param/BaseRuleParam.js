/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class BaseRuleParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'message'
            ]),
            RULES: [
                ['message', 'string']
            ],
            ATTR_LABELS: {
                message: 'Error message'
            }
        };
    }
};
module.exports.init(module);