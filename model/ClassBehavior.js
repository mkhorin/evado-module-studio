/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/param/ParamContainer');

module.exports = class ClassBehavior extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_classBehavior',
            PARAM_MAP: {
                'custom': require('./behaviorParam/CustomParam'),
                'file': require('./behaviorParam/FileParam')
            },
            ATTR_VALUE_LABELS: {
                'type': {
                    custom: 'Custom behavior',
                    file: 'File'
                }
            }
        };
    }

    relOwner () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'owner').with('attrs');
    }
};
module.exports.init(module);