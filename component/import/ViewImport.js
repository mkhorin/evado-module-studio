/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportModel');

module.exports = class ViewImport extends Base {

    static getConstants () {
        return {
            RULES: [
                ...super.RULES,
                ['source', 'default', {value: (attr, {classModel}) => {
                    return `app/base/view/${classModel.get('name')}/_viewName_`;
                }}]
            ]
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
    }

    async validateView () {
        this.model = this.spawn('model/View', {
            scenario: 'create'
        });
        this.data.name = this.baseName;
        this.Helper.assignAttrs(this.data, this.model);
        this.model.set('class', this.classModel.getId());
        this.model.unset('creationView', 'editView');
        if (this.classModel.hasParent()) {
            await this.deleteInheritedView();
        }
        return this.save();
    }

    async deleteInheritedView () {
        const query = this.model.find({
            class: this.model.get('class'),
            name: this.model.get('name')
        });
        const model = await query.one();
        if (model) {
            await model.delete();
        }
    }

    async processDeferredBinding () {
        if (!this.hasError()) {
            await this.meta.resolveClassMap();
        }
        if (!this.hasError()) {
            await this.createRules();
        }
        if (!this.hasError()) {
            await this.createBehaviors();
        }
        if (!this.hasError()) {
            this.bindView('creationView');
            this.bindView('editView');
        }
        if (!this.hasError()) {
            await this.createTreeView();
        }
        await PromiseHelper.each(this.attrImports, model => {
            return this.hasError() ? null : model.processDeferredBinding();
        });
        if (this.needSave && !this.hasError()) {
            await this.model.forceSave();
        }
        await this.deleteOnError();
        await PromiseHelper.setImmediate();
    }

    bindView (attr) {
        const classId = this.model.get('class');
        const classModel = this.meta.classMap[classId];
        const viewMap = classModel.rel('viewMap');
        const name = this.data[attr];
        if (!name) {
            return null;
        }
        if (!Object.hasOwn(viewMap, name)) {
            return this.assignError(`${attr}: Not found: ${name}`);
        }
        this.model.set(attr, viewMap[name].getId());
        this.needSave = true;
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
        const instance = this.spawn('import/ViewAttrImport', {
            owner: this,
            meta: this.meta,
            classModel: this.classModel,
            classAttr: this.getClassAttrByName(data.name),
            viewModel: this.model,
            groupMap: this.classImport.groupMap,
            data
        });
        this.attrImports.push(instance);
        return instance.process();
    }

    // GROUPS

    getClassGroupByName (name) {
        return this.classImport.getGroupByName(name);
    }

    createGroups () {
        if (!Array.isArray(this.data.groups)) {
            this.data.groups = [];
        }
        return PromiseHelper.each(this.data.groups, this.createGroup, this);
    }

    createGroup (data) {
        const instance = this.spawn('import/ViewGroupImport', {
            owner: this,
            groupModel: this.getClassGroupByName(data.name),
            viewModel: this.model,
            data
        });
        return instance.process();
    }

    // BEHAVIORS

    createBehaviors () {
        return PromiseHelper.each(this.data.behaviors, this.createBehavior, this);
    }

    async createBehavior (data) {
        data.owner = this.model.getId();
        const model = this.spawn('model/ViewBehavior', {scenario: 'create'});
        model.populateRelation('owner', this.model);
        await this.Helper.importParamContainer(model, data, this.meta);
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
        const links = data.attrs.map(this.getClassAttrByName, this);
        data.attrs = {links};
        const model = this.spawn('model/ViewRule', {scenario: 'create'});
        model.populateRelation('owner', this.model);
        await this.Helper.importParamContainer(model, data, this.meta);
        const error = this.Helper.getError(model, 'rules');
        this.assignError(error);
    }

    // TREE VIEW

    createTreeView () {
        const instance = this.spawn('import/TreeViewImport', {
            owner: this,
            data: this.data.treeView,
            sourceClass: this.classModel
        });
        return instance.process();
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');