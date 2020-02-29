/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseRule');

module.exports = class ViewAttrRule extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_viewAttrRule'
        };
    }

    relOwner () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasOne(Class, Class.PK, 'owner');
    }
};
module.exports.init(module);