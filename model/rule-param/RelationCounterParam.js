/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class RelationCounterParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'max',
                'min'
            ]),
            RULES: [
                [['max', 'min'], 'number', {min: 1}]
            ],
            ATTR_LABELS: {
                'max': 'Maximum objects',
                'min': 'Minimum objects'
            }
        };
    }
};
module.exports.init(module);