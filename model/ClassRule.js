/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseRule');

module.exports = class ClassRule extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_classRule',
            ATTRS: [
                ...super.ATTRS,
                'attrs'
            ],
            RULES: [
                ...super.RULES,
                ['attrs', 'relation']
            ]
        };
    }

    async relinkClassAttrs (data) {
        const oldOnes = this.get('attrs');
        const newOnes = oldOnes.map(id => {
            return Object.hasOwn(data, id) ? data[id] : id;
        });
        this.set('attrs', newOnes);
        this.detachRelationChangeBehavior();
        await this.forceSave();
        await super.relinkClassAttrs(data);
    }

    // RELATIONS

    relAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, Class.PK, 'attrs').viaArray();
    }

    relOwner () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'owner');
    }
};
module.exports.init(module);