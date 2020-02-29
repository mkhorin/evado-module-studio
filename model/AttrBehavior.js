/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/param/ParamContainer');

module.exports = class AttrBehavior extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_attrBehavior',
            PARAM_MAP: {
                'assignedValue': require('./behavior-param/AssignedValueParam'),
                'autoIncrement': require('./behavior-param/AutoIncrementParam'),
                'guid': require('./behavior-param/GuidParam'),
                'sortOrder': require('./behavior-param/SortOrderParam'),
                'custom': require('./behavior-param/CustomParam'),
            },
            ATTR_VALUE_LABELS: {
                'type': {
                    assignedValue: 'Assigned value',
                    autoIncrement: 'Auto increment',
                    guid: 'GUID',
                    sortOrder: 'Sort order',
                    custom: 'Custom behavior'
                }
            }
        };
    }

    relOwner () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'owner');
    }
};
module.exports.init(module);