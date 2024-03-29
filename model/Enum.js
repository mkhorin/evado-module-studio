/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class Enum extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_enum',
            ATTRS: [
                'attr',
                'class',
                'condition',
                'owner',
                'queryFilter',
                'view'
            ],
            RULES: [
                [['owner', 'attr', 'class', 'view'], 'id'],
                [['condition', 'queryFilter'], 'json'],
                ['items', 'relation']
            ],
            DELETE_ON_UNLINK: [
                'items'
            ],
            ATTR_LABELS: {
                attr: 'Value attribute',
                condition: 'Activation condition'
            }
        };
    }

    // CLONE

    async cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('owner', owner.getId());
        await model.forceSave();
        const items = await this.resolveRelation('items');
        for (const item of items) {
            await item.cloneFor(model);
        }
    }

    // RELATIONS

    relAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'attr');
    }

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, this.PK, 'class');
    }

    relItems () {
        const Class = this.getClass('model/EnumItem');
        return this.hasMany(Class, 'enum', this.PK).order({orderNumber: 1});
    }

    relOwner () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'owner');
    }

    relView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, this.PK, 'view');
    }
};
module.exports.init(module);