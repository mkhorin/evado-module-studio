/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseRule');

module.exports = class AttrRule extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_attrRule'
        };
    }

    relOwner () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'owner');
    }
};
module.exports.init(module);