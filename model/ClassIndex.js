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
                ['name', CodeNameValidator],
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
        const attrs = await this.resolveRelation('attrs');
        for (const attr of attrs) {
            await attr.cloneFor(model);
        }
    }

    async relinkClassAttrs (data) {
        const models = await this.resolveRelation('attrs');
        for (const model of models) {
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

const CodeNameValidator = require('../component/validator/CodeNameValidator');

module.exports.init(module);