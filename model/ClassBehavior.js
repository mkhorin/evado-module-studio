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
                'file': require('./behaviorParam/FileParam'),
                'signature': require('./behaviorParam/SignatureParam'),
                's3': require('./behaviorParam/S3Param')
            },
            ATTR_VALUE_LABELS: {
                'type': {
                    custom: 'Custom behavior',
                    file: 'File',
                    signature: 'Digital signature',
                    s3: 'Cloud storage (S3)'
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