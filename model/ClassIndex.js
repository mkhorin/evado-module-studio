/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class ClassIndex extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_classIndex',
            ATTRS: [
                'class',
                'name',
                'background',
                'options',
                'unique'
            ],
            RULES: [
                ['class', 'required'],
                ['class', 'id'],
                ['name', require('../component/validator/CodeNameValidator')],
                ['name', 'unique', {filter: 'class'}],
                [['unique', 'background'], 'checkbox'],
                ['options', 'json'],
                ['attrs', 'relation']
            ],
            DELETE_ON_UNLINK: [
                'attrs'
            ],
            ATTR_LABELS: {
                attrs: 'Attributes',
                background: 'Background build',
                unique: 'Unique key value'
            }
        };
    }

    // CLONE

    async cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('class', owner.getId());
        await model.forceSave();
        for (const attr of await this.resolveRelation('attrs')) {
            await attr.cloneFor(model);
        }
    }

    async relinkClassAttrs (data) {
        for (const model of await this.resolveRelation('attrs')) {
            await model.relinkClassAttrs(data);
        }
    }

    // RELATIONS

    relAttrs () {
        const Class = this.getClass('model/ClassIndexAttr');
        return this.hasMany(Class, 'index', this.PK).with('attr');
    }

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class').with('attrs');
    }
};
module.exports.init(module);