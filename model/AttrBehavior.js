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
                'assignedValue': require('./behaviorParam/AssignedValueParam'),
                'autoIncrement': require('./behaviorParam/AutoIncrementParam'),
                'guid': require('./behaviorParam/GuidParam'),
                'sortOrder': require('./behaviorParam/SortOrderParam'),
                'custom': require('./behaviorParam/CustomParam'),
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