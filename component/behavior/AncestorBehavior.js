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
            ...config
        });
        this.setHandler(ActiveRecord.EVENT_AFTER_INSERT, this.afterInsert);
        this.setHandler(ActiveRecord.EVENT_AFTER_UPDATE, this.afterUpdate);
    }

    async afterInsert () {
        const children = await this.resolveChildren();
        if (children === false) {
            return this.owner.delete();
        }
        const models = await this.owner.find({
            class: children,
            name: this.owner.get('name')
        }).all();
        await this.owner.constructor.delete(models);
        for (const id of children) {
            await this.owner.inherit(id);
        }
        for (const {name, unchangeableAttrs} of this.relations) {
            await this.setInheritedValues(name, unchangeableAttrs);
        }
    }

    async afterUpdate () {
        const children = await this.resolveChildren();
        if (children === false) {
            return this.owner.delete();
        }
        for (const {name, unchangeableAttrs} of this.relations) {
            await this.setInheritedValues(name, unchangeableAttrs);
        }
        // delete children with this name and other parent from descendant classes
        const condition = {
            class: children,
            name: this.owner.get('name')
        };
        const query = this.owner.find(condition).and(['!=', 'original', this.owner.getId()]);
        return this.owner.constructor.delete(await query.all());
    }

    async setInheritedValues (name, unchangeableAttrs) {
        const models = await this.owner.resolveRelation(name);
        for (const model of models) {
            if (unchangeableAttrs) {
                for (const name of unchangeableAttrs) {
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