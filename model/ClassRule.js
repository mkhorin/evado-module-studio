/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseRule');

module.exports = class ClassRule extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_classRule',
            ATTRS: super.ATTRS.concat([
                'attrs'
            ]),
            RULES: super.RULES.concat([
                ['attrs', 'relation']
            ])
        };
    }

    async relinkClassAttrs (data) {
        this.set('attrs', this.get('attrs').map(id => data.hasOwnProperty(id) ? data[id] : id));
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