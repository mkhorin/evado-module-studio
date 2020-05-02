/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportModel');

module.exports = class ViewImport extends Base {

    static getConstants () {
        return {
            RULES: super.RULES.concat([
                ['source', 'default', {value: (attr, model) => {
                    return `app/base/view/${model.classModel.get('name')}/_viewName_`;
                }}]
            ])
        };
    }

    async validateData () {
        await this.validateView();
        if (!this.hasError()) {
            await this.createAttrs();
        }
        if (!this.hasError()) {
            await this.createGroups();
        }
        if (!this.hasError()) {
            await this.createBehaviors();
        }
        if (!this.hasError()) {
            await this.createRules();
        }
    }

    validateView () {
        this.model = this.spawn('model/View', {scenario: 'create'});
        this.data.name = this.baseName;
        this.Helper.assignAttrs(this.data, this.model);
        this.model.set('class', this.classModel.getId());
        return this.save();
    }

    async processDeferredBinding () {
        if (!this.hasError()) {
            await this.meta.resolveClassMap();
        }
        if (!this.hasError()) {
            await this.createTreeView();
        }
        await PromiseHelper.each(this.attrImports, model => {
            return this.hasError() ? null : model.processDeferredBinding();
        });
        await this.deleteOnError();
        await PromiseHelper.setImmediate();
    }

    // ATTRIBUTES

    getClassAttrByName (name) {
        return this.classImport.getAttrByName(name);
    }

    createAttrs () {
        this.attrImports = [];
        return PromiseHelper.each(this.data.attrs, this.createAttr, this);
    }

    createAttr (data) {
        const attr = this.spawn('import/ViewAttrImport', {
            owner: this,
            meta: this.meta,
            classModel: this.classModel,
            classAttr: this.getClassAttrByName(data.name),
            viewModel: this.model,
            groupMap: this.classImport.groupMap,
            data
        });
        this.attrImports.push(attr);
        return attr.process();
    }

    // GROUPS

    getClassGroupByName (name) {
        return this.classImport.getGroupByName(name);
    }

    createGroups () {
        this.data.groups = Array.isArray(this.data.groups) ? this.data.groups : [];
        return PromiseHelper.each(this.data.groups, this.createGroup, this);
    }

    createGroup (data) {
        return this.spawn('import/ViewGroupImport', {
            owner: this,
            groupModel: this.getClassGroupByName(data.name),
            viewModel: this.model,
            data
        }).process();
    }

    // BEHAVIORS

    createBehaviors () {
        return PromiseHelper.each(this.data.behaviors, this.createBehavior, this);
    }

    async createBehavior (data) {
        data.owner = this.model.getId();
        const model = this.spawn('model/ViewBehavior', {scenario: 'create'});
        model.populateRelation('owner', this.model);
        await this.Helper.importParamContainer(model, data);
        this.assignError(this.Helper.getError(model, 'behaviors'));
    }

    // RULES

    createRules () {
        return PromiseHelper.each(this.data.rules, this.createRule, this);
    }

    async createRule (data) {
        data.owner = this.model.getId();
        if (!Array.isArray(data.attrs)) {
            data.attrs = [];
        }
        data.attrs = data.attrs.map(name => {
            const model = this.getClassAttrByName(name);
            return model ? model : null;
        });
        data.attrs = {links: data.attrs};
        const model = this.spawn('model/ViewRule', {scenario: 'create'});
        model.populateRelation('owner', this.model);
        await this.Helper.importParamContainer(model, data);
        this.assignError(this.Helper.getError(model, 'rules'));
    }

    // TREE VIEW

    createTreeView () {
        return this.spawn('import/TreeViewImport', {
            owner: this,
            data: this.data.treeView,
            sourceClass: this.classModel
        }).process();
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');