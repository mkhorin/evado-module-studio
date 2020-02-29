/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class StringParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'length',
                'max',
                'min'
            ]),
            RULES: [
                [['length', 'max', 'min'], 'number', {integerOnly: true, min: 1}]
            ],
            ATTR_LABELS: {
                'max': 'Maximum length',
                'min': 'Minimum length'
            }
        };
    }
};
module.exports.init(module);