/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/base/Behavior');

module.exports = class AncestorBehavior extends Base {

    constructor (config) {
        super({
            childrenRelation: 'children',
            overriddenBehavior: 'overridden',
            withOriginalOnly: false,
            ...config
        });
        this.setHandler(ActiveRecord.EVENT_AFTER_INSERT, this.afterInsert);
        this.setHandler(ActiveRecord.EVENT_AFTER_UPDATE, this.afterUpdate);
    }

    async afterInsert () {
        const children = await this.resolveChildren();
        if (children === null) {
            return this.owner.delete();
        }
        const query = this.owner.find({
            class: children,
            name: this.owner.get('name')
        });
        this.addNotEmptyOriginal(query);
        await this.owner.constructor.delete(await query.all());
        for (const id of children) {
            await this.owner.inherit(id);
        }
        await this.changeRelations();
    }

    async afterUpdate () {
        const children = await this.resolveChildren();
        if (children === null) {
            return this.owner.delete();
        }
        await this.changeRelations();
        // delete children with this name and other parent from descendant classes
        const query = this.owner.find({
            class: children,
            name: this.owner.get('name')
        });
        query.and(['!=', 'original', this.owner.getId()]);
        this.addNotEmptyOriginal(query);
        await this.owner.constructor.delete(await query.all());
    }

    addNotEmptyOriginal (query) {
        if (this.withOriginalOnly) {
            query.and(['notEmpty', 'original']);
        }
    }

    async changeRelations () {
        for (const relation of this.relations) {
            await this.setInheritedValues(relation);
        }
    }

    async setInheritedValues (data) {
        const models = await this.owner.resolveRelation(data.name);
        for (const model of models) {
            if (data.unchangeableAttrs) {
                for (const name of data.unchangeableAttrs) {
                    model.set(name, this.owner.get(name));
                }
            }
            await model.getBehavior(this.overriddenBehavior).setInheritedValues(this.owner);
            await model.forceSave();
        }
    }

    async resolveChildren () {
        await PromiseHelper.setImmediate();
        const model = await this.owner.resolveRelation('class');
        return model ? model.getRelation(this.childrenRelation).ids() : false;
    }
};

const PromiseHelper = require('areto/helper/PromiseHelper');
const ActiveRecord = require('areto/db/ActiveRecord');