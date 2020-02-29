/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class CustomParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'config'
            ]),
            RULES: [
                ['config', 'required'],
                ['config', 'spawn', {
                    BaseClass: require('evado-meta-document/behavior/Behavior')
                }]
            ],
            ATTR_LABELS: {
                'config': 'Spawn configuration'
            }
        };
    }
};
module.exports.init(module);