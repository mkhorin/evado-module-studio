/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class AutoIncrementParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'start',
                'step',
                'method'
            ],
            RULES: [
                [['start', 'step'], 'integer'],
                [['start', 'step'], 'default', {value: 1}]
            ],
            ATTR_LABELS: {
                start: 'Start value',
                step: 'Change step'
            }
        };
    }
};
module.exports.init(module);