/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');
const Behavior = require('evado-meta-base/behavior/Behavior');

module.exports = class CustomParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'config'
            ],
            RULES: [
                ['config', 'required'],
                ['config', 'spawn', {BaseClass: Behavior}]
            ],
            ATTR_LABELS: {
                config: 'Spawn configuration'
            }
        };
    }
};
module.exports.init(module);