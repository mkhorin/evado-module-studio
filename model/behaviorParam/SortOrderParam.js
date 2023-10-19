/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class SortOrderParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'start',
                'step'
            ],
            RULES: [
                [['start', 'step'], 'integer'],
                [['start', 'step'], 'default', {value: 10}]
            ],
            ATTR_LABELS: {
                start: 'Start value',
                step: 'Change step'
            }
        };
    }

    async beforeValidate () {
        await this.validateAttr();
        return super.beforeValidate();
    }

    async validateAttr () {
        const attr = await this.paramContainer.resolveRelation('owner');
        if (!attr) {
            const owner = this.get('owner');
            return this.addError('attribute', `${owner} not found`);
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