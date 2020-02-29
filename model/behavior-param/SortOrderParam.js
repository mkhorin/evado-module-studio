/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class SortOrderParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'start',
                'step'
            ]),
            RULES: [
                [['start', 'step'], 'number', {integerOnly: true}],
                [['start', 'step'], 'default', {value: 10}]
            ]
        };
    }

    async beforeValidate () {
        await this.validateAttr();
        return super.beforeValidate();
    }

    async validateAttr () {
        const attr = await this.paramContainer.resolveRelation('owner');
        if (!attr) {
            return this.addError('attribute', `${this.get('owner')} not found`);
        }
        if (!attr.get('sortable')) {
            this.addError('attribute', `Is not sortable`);
        }
        if (!attr.isInteger()) {
            this.addError('attribute', `Is not integer`);
        }
    }

    relOwner () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'owner');
    }
};
module.exports.init(module);