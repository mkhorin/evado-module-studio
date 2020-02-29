/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class RegexParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'pattern',
                'flags',
                'mismatch',
                'message'
            ]),
            RULES: [
                ['pattern', 'required'],
                [['pattern', 'flags', 'message'], 'string'],
                ['mismatch', 'checkbox']
            ],
            ATTR_LABELS: {
                'message': 'Error message'
            }
        };
    }
};
module.exports.init(module);