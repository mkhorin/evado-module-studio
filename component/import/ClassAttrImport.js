/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportBase');

module.exports = class ClassAttrImport extends Base {

    process () {
        const ClassAttr = this.getClass('model/ClassAttr');
        this.model = this.spawn(ClassAttr, {scenario: 'create'});
        return this.processAfter();
    }

    async processAfter () {
        const model = this.model;
        this.Helper.assignAttrs(this.data, model);
        model.set('class', this.classModel.getId());
        model.isRelation() && model.get('refClass')
            ? model.set('refClass', this.classModel.getId()) // to pass require validation
            : model.unset('refClass');
        model.unset('eagerView', 'group', 'linkAttr', 'listView', 'refAttr', 'selectListView');
        model.detachBehavior('ancestor');
        this.attrMap[this.data.name] = model;
        this._models = [];
        this.setRelatedAttr('group', this.groupMap);
        if (!this.hasError()) {
            await this.createActionBinder();
        }
        if (!this.hasError()) {
            await this.save();
        }
        if (this.hasError()) {
            await this.clear();
        }
        return PromiseHelper.setImmediate();
    }

    // DEFERRED BINDING

    async processDeferredBinding () {
        if (!this.hasError()) {
            await this.createBehaviors();
        }
        if (!this.hasError()) {
            await this.createEnums();
        }
        if (!this.hasError()) {
            await this.setRelation();
        }
        if (!this.hasError()) {
            await this.createRules();
        }
        if (!this.hasError()) {
            await this.createVia();
        }
        if (this.needSave && !this.hasError()) {
            await this.model.forceSave();
        }
        return PromiseHelper.setImmediate();
    }

    // RELATION

    async setRelation () {
        const refClass = await this.resolveRefClass();
        if (!refClass) {
            return true;
        }
        this.model.set('refClass', refClass.getId());
        this.setRelatedAttr('linkAttr', this.attrMap);
        this.setRelatedAttr('refAttr', refClass.rel('attrMap'));
        const viewMap = refClass.rel('viewMap');
        if (viewMap) {
            this.setRelatedAttr('eagerView', viewMap);
            this.setRelatedAttr('listView', viewMap);
            this.setRelatedAttr('selectListView', viewMap);
        }
        this.needSave = true;
    }

    resolveRefClass () {
        const name = this.data.refClass;
        if (name) {
            const refClass = this.meta.getClassByName(name);
            return refClass || this.assignError(`Unknown refClass: ${name}`);
        }
    }

    // BEHAVIORS

    createBehaviors () {
        return PromiseHelper.each(this.data.behaviors, this.createBehavior, this);
    }

    async createBehavior (data) {
        const model = this.spawn('model/AttrBehavior');
        data.owner = this.model.getId();
        await this.Helper.importParamContainer(model, data, this.meta);
        this.assignError(this.Helper.getError(model, model.constructor.name));
    }

    // ENUMS

    createEnums () {
        return PromiseHelper.each(this.data.enums, data => {
            return this.spawn('import/EnumImport', {owner: this, data}).process();
        }, this);
    }

    // RULES

    createRules () {
        return PromiseHelper.each(this.data.rules, this.createRule, this);
    }

    async createRule (data) {
        const model = this.spawn('model/AttrRule', {scenario: 'create'});
        data.owner = this.model.getId();
        await this.Helper.importParamContainer(model, data, this.meta);
        this.assignError(this.Helper.getError(model, 'Rules'));
    }

    // VIA

    async createVia () {
        const data = this.data.via;
        return data ? this.spawn('import/ViaImport', {owner: this, data}).process() : null;
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');