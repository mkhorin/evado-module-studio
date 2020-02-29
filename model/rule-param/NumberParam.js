/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class NumberParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'integerOnly',
                'max',
                'min'
            ]),
            RULES: [
                ['integerOnly', 'checkbox'],
                [['max', 'min'], 'number']
            ],
            ATTR_LABELS: {
                'max': 'Maximum value',
                'min': 'Minimum value'
            }
        };
    }
};
module.exports.init(module);