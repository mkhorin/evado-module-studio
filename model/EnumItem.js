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
                'hint',
                'orderNumber',
                'text',
                'value'
            ],
            RULES: [
                [['hint', 'text'], 'string'],
                ['value', CodeNameValidator],
                ['value', 'unique', {filter: 'enum'}],
                ['orderNumber', 'integer'],
                ['orderNumber', 'default', {
                    value: (attr, model) => model.getBehavior('sortOrder').getNextNumber()
                }],
            ],
            BEHAVIORS: {
                'sortOrder': {
                    Class: SortOrderBehavior,
                    filter: 'enum'
                }
            },
        };
    }

    getTitle () {
        return this.get('text')
            || this.get('value')
            || this.getId();
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

const CodeNameValidator = require('../component/validator/CodeNameValidator');
const SortOrderBehavior = require('areto/behavior/SortOrderBehavior');

module.exports.init(module);