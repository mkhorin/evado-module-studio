/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/param/ParamContainer');

module.exports = class ViewBehavior extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_viewBehavior',
            BEHAVIORS: {
                'sortOrder': {...super.BEHAVIORS.sortOrder, start: 100}
            },
            PARAM_MAP: {
                'custom': require('./behavior-param/CustomParam')
            },
            ATTR_VALUE_LABELS: {
                'type': {
                    custom: 'Custom behavior'
                }
            }
        };
    }

    relOwner () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'owner').with('attrs');
    }
};
module.exports.init(module);