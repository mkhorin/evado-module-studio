/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportModel');

module.exports = class ClassImport extends Base {

    static getConstants () {
        return {
            RULES: super.RULES.concat([
                ['source', 'default', {value: 'app/document/class/_className_'}]
            ])
        };
    }

    async validateData () {
        await this.validateClass();
        if (!this.hasError()) {
            this.data.parent
                ? await this.extendGroups()
                : await this.createGroups();
        }
        if (!this.hasError()) {
            this.data.parent
                ? await this.extendAttrs()
                : await this.createAttrs();
        }
        if (!this.hasError()) {
            await this.createViews();
        }
        if (!this.hasError()) {
            await this.createIndexes();
        }
        if (!this.hasError()) {
            await this.createStates();
        }
        if (!this.hasError()) {
            await this.createTransitions();
        }
        return PromiseHelper.setImmediate();
    }

    async validateClass () {
        this.model = this.spawn('model/Class', {scenario: 'create'});
        this.data.name = this.baseName;
        this.Helper.assignAttrs(this.data, this.model);
        this.model.unset('key');
        this.groupImports = [];
        this.groupMap = {};
        if (this.data.parent) {
            await this.setParentClass();
        }
        return this.save();
    }

    async setParentClass () {
        const name = this.data.parent;
        this.parent = await this.spawn('model/Class').find({name}).one();
        if (!this.parent) {
            return this.assignError(`Invalid parent: ${name}`);
        }
        this.model.set('type', this.parent.get('type'));
        this.model.set('parent', this.parent.getId());
        this.model.populateRelation('parent', this.parent);
    }

    // DEFERRED BINDING

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
        for (const item of this.attrImports) {
            if (!this.hasError()) {
                await item.processDeferredBinding();
            }
        }
        for (const item of this.viewImports) {
            if (!this.hasError()) {
                await item.processDeferredBinding();
            }
        }
        if (!this.hasError()) {
            await this.createTreeView();
        }
        if (!this.hasError()) {
            await this.resolveActiveDescendants();
        }
        await this.deleteOnError();
        await PromiseHelper.setImmediate();
    }

    // GROUPS

    getGroupByName (name) {
        return this.groupMap.hasOwnProperty(name) ? this.groupMap[name] : null;
    }

    async createGroups () {
        if (Array.isArray(this.data.groups)) {
            for (const item of this.Helper.orderItemHierarchy(this.data.groups)) {
                await this.createGroup(item);
            }
        }
    }

    async extendGroups () {
        const group = this.spawn('model/ClassGroup');
        this.groupImports = [];
        this.groupMap = await group.find({class: this.model.getId()}).index('name').all();
        if (Array.isArray(this.data.groups)) {
            for (const item of this.data.groups) {
                await this.createGroup(item, this.getGroupByName(item.name));
            }
        }
    }

    createGroup (data, model) {
        const constructor = model ? 'InheritedClassGroupImport' : 'ClassGroupImport';
        const group = this.spawn(`import/${constructor}`, {
            owner: this,
            meta: this.meta,
            classModel: this.model,
            groupMap: this.groupMap,
            data, model
        });
        this.groupImports.push(group);
        return group.process();
    }

    // ATTRIBUTES

    getAttrByName (name) {
        return this.attrMap.hasOwnProperty(name) ? this.attrMap[name] : null;
    }

    async createAttrs () {
        this.attrImports = [];
        this.attrMap = {};
        if (!Array.isArray(this.data.attrs)) {
            return false;
        }
        for (const item of this.data.attrs) {
            await this.createAttr(item);
        }
        if (!this.hasError()) {
            await this.createKey();
        }
    }

    async extendAttrs () {
        const attr = this.spawn('model/ClassAttr');
        this.attrImports = [];
        this.attrMap = await attr.find({class: this.model.getId()}).index('name').all();
        if (Array.isArray(this.data.attrs)) {
            for (const item of this.data.attrs) {
                await this.createAttr(item, this.getAttrByName(item.name));
            }
        }
    }

    createAttr (data, model) {
        const constructor = model ? 'InheritedClassAttrImport' : 'ClassAttrImport';
        const attr = this.spawn(`import/${constructor}`, {
            owner: this,
            meta: this.meta,
            classModel: this.model,
            attrMap: this.attrMap,
            groupMap: this.groupMap,
            data, model
        });
        this.attrImports.push(attr);
        return attr.process();
    }

    createKey () {
        if (!this.data.key) {
            return true;
        }
        const model = this.getAttrByName(this.data.key);
        if (!model) {
            return this.assignError(`Invalid key: ${this.data.key}`);
        }
        this.model.set('key', model.getId());
        return this.model.forceSave();
    }

    // INDEXES

    createIndexes () {
        return PromiseHelper.each(this.data.indexes, this.createIndex, this);
    }

    async createIndex ([attrs, options]) {
        const model = this.spawn('model/ClassIndex', {scenario: 'create'});
        this.Helper.assignAttrs(options, model);
        model.set('class', this.model.getId());
        if (await model.save()) {
            await this.createIndexAttrs(attrs, model);
        }
        this.assignError(this.Helper.getError(model, 'index'));
    }

    async createIndexAttrs (data, model) {
        const links = {};
        if (data) {
            for (const key of Object.keys(data)) {
                links[key] = await this.createIndexAttr(model, data[key], key);
            }
        }
        model.set('attrs', {links});
        return model.save();
    }

    async createIndexAttr (indexModel, direction, name) {
        const attr = this.getAttrByName(name);
        if (!attr) {
            return this.assignError(`Unknown index attribute: ${name}`);
        }
        const model = this.spawn('model/ClassIndexAttr', {scenario: 'create'});
        model.set('index', indexModel.getId());
        model.set('attr', attr.getId());
        model.set('direction', direction);
        await model.save();
        this.assignError(this.Helper.getError(model, 'indexAttr'));
    }

    // VIEWS

    async createViews () {
        const dir = path.join(this.file, `../../view`, this.baseName);
        const files = await FileHelper.readDirectory(dir);
        this.viewImports = [];
        this.viewImportMap = {};
        for (const file of FileHelper.filterJsonFiles(files)) {
            await this.createView(path.join(dir, file));
        }
    }

    async createView (file) {
        const model = this.spawn('import/ViewImport', {
            meta: this.meta,
            classImport: this,
            classModel: this.model,
            viewMap: this.viewMap,
            groupMap: this.groupMap,
            file
        });
        model.set('source', file);
        this.viewImports.push(model);
        await model.process();
        this.viewImportMap[model.data.name] = model;
        this.assignError(this.Helper.getError(model, `View: ${path.basename(file)}`));
    }

    // RULES

    createRules () {
        return PromiseHelper.each(this.data.rules, this.createRule, this);
    }

    async createRule (data) {
        const model = this.spawn('model/ClassRule', {scenario: 'create'});
        data.owner = this.model.getId();
        model.populateRelation('owner', this.model);
        await this.resolveRuleAttrs(data);
        await this.Helper.importParamContainer(model, data);
        this.assignError(this.Helper.getError(model, 'rules'));
    }

    async resolveRuleAttrs (data) {
        if (!Array.isArray(data.attrs) || !data.attrs.length) {
            return this.assignError('Invalid rule attributes');
        }
        data.attrs = {links: await PromiseHelper.map(data.attrs, this.resolveRuleAttr, this)};
        return PromiseHelper.setImmediate();
    }

    async resolveRuleAttr (name) {
        const attr = await this.model.relAttrs().and({name}).one();
        if (attr) {
            return attr.getId();
        }
        this.assignError(`Rule attribute not found: ${name}`);
        return null;
    }

    // BEHAVIORS

    createBehaviors () {
        return PromiseHelper.each(this.data.behaviors, this.createBehavior, this);
    }

    async createBehavior (data) {
        const model = this.spawn('model/ClassBehavior', {scenario: 'create'});
        data.owner = this.model.getId();
        model.populateRelation('owner', this.model);
        await this.Helper.importParamContainer(model, data);
        this.assignError(this.Helper.getError(model, 'behaviors'));
    }

    // STATES

    createStates () {
        this.stateMap = {};
        return PromiseHelper.each(this.data.states, this.createState, this);
    }

    async createState (data) {
        const model = this.spawn('model/State', {scenario: 'create'});
        this.Helper.assignAttrs(data, model);
        model.set('class', this.model.getId());
        if (data.view) {
            if (!this.viewImportMap.hasOwnProperty(data.view)) {
                return this.assignError(`State: ${data.name}: Invalid view: ${data.view}`);
            }
            model.set('view', this.viewImportMap[data.view].model.getId());
        }
        this.stateMap[data.name] = model;
        await model.save();
        this.assignError(this.Helper.getError(model, 'states'));
    }

    // TRANSITIONS

    createTransitions () {
        return PromiseHelper.each(this.data.transitions, this.createTransition, this);
    }

    async createTransition (data) {
        const model = this.spawn('model/Transition', {scenario: 'create'});
        this.Helper.assignAttrs(data, model);
        model.set('class', this.model.getId());
        this.setTransitionStartStates(data.startStates, model);
        this.setTransitionFinalState(data.finalState, model);
        if (!this.hasError()) {
            await model.save();
        }
        this.assignError(this.Helper.getError(model, 'transitions'));
    }

    setTransitionStartStates (names, model) {
        if (!Array.isArray(names)) {
            return false;
        }
        const links = names
            .filter(this.filterTransitionStates.bind(this, model))
            .map(name => this.stateMap[name].getId());
        model.set('startStates', {links});
    }

    filterTransitionStates (model, name) {
        if (this.stateMap.hasOwnProperty(name)) {
            return true;
        }
        this.assignError(`Transition: ${model.get('name')}: Invalid state: ${key}`);
        return false;
    }

    setTransitionFinalState (name, model) {
        if (name) {
            this.stateMap.hasOwnProperty(name)
                ? model.set('finalState', this.stateMap[name].getId())
                : this.assignError(`Transition: ${model.get('name')}: Invalid state: ${name}`);
        }
    }

    // TREE VIEW

    createTreeView () {
        return this.spawn('import/TreeViewImport', {
            owner: this,
            data: this.data.treeView,
            sourceClass: this.model
        }).process();
    }

    // ACTIVE DESCENDANTS

    resolveActiveDescendants () {
        const names = this.data.activeDescendants;
        if (Array.isArray(names) && names.length) {
            const map = this.meta.classMapByName;
            const ids = names.map(name => map.hasOwnProperty(name) ? map[name].getId() : null).filter(id => id);
            return this.model.directUpdate({activeDescendants: ids});
        }
    }
};
module.exports.init(module);

const path = require('path');
const FileHelper = require('areto/helper/FileHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');