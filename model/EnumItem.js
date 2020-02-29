/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class EnumItem extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_enumItem',
            ATTRS: [
                'enum',
                'value',
                'text',
                'hint',
                'orderNumber'
            ],
            RULES: [
                ['value', 'required'],
                [['text', 'hint'], 'string'],
                ['value', require('../component/validator/CodeNameValidator')],
                ['value', 'unique', {filter: 'enum'}],
                ['orderNumber', 'number', {integerOnly: true}],
                ['orderNumber', 'default', {
                    value: (attr, model) => model.getBehavior('sortOrder').getNextNumber()
                }],
            ],
            BEHAVIORS: {
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
                    filter: 'enum'
                }
            },
        };
    }

    getTitle () {
        return this.get('text') || this.get('value') || this.getId();
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('enum', owner.getId());
        return model.forceSave();
    }

    // RELATIONS

    relEnum () {
        const Class = this.getClass('model/Enum');
        return this.hasOne(Class, this.PK, 'enum');
    }
};
module.exports.init(module);