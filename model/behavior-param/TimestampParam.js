/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class TimestampParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'createdAttr',
                'updatedAttr'
            ]),
            RULES: [
                [['createdAttr', 'updatedAttr'], 'id']
            ],
            ATTR_LABELS: {
                'createdAttr': 'Create timestamp',
                'updatedAttr': 'Update timestamp'
            }

        };
    }

    prepareData () {
        return this.resolveRelations(['createdAttr', 'updatedAttr']);
    }

    stringify () {
        this.set('createdAttr', this.get('createdAttr.name'));
        this.set('updatedAttr', this.get('updatedAttr.name'));
        return super.stringify();
    }

    relinkClassAttrs (data) {
        if (data.hasOwnProperty(this.get('createdAttr'))) {
            this.set('createdAttr', data[this.get('createdAttr')]);
        }
        if (data.hasOwnProperty(this.get('updatedAttr'))) {
            this.set('updatedAttr', data[this.get('updatedAttr')]);
        }
        return this.forceSave();
    }

    relCreatedAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'createdAttr').select('name').raw();
    }

    relUpdatedAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'updatedAttr').select('name').raw();
    }
};
module.exports.init(module);