/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./AttrBehavior');

module.exports = class ViewAttrBehavior extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_viewAttrBehavior',
            BEHAVIORS: {
                'sortOrder': {...super.BEHAVIORS.sortOrder, start: 100}
            }
        };
    }

    relOwner () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasOne(Class, Class.PK, 'owner');
    }
};
module.exports.init(module);