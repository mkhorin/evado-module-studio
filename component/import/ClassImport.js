/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportModel');

module.exports = class ClassImport extends Base {

    static getConstants () {
        return {
            RULES: [
                ...super.RULES,
                ['source', 'default', {value: 'app/base/class/_className_'}]
            ]
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
        this.model.unset('forbiddenView', 'key', 'version'); // to pass validation
        this.groupImports = [];
        this.groupMap = {};
        if (this.data.parent) {
            await this.setParentClass();
        }
        return this.save();
    }

    async setParentClass () {
        const name = this.data.parent;
        const query = this.spawn('model/Class').find({name});
        this.parent = await query.one();
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
        await this.processDeferredBindingModels(this.attrImports);
        await this.processDeferredBindingModels(this.viewImports);

        if (!this.hasError()) {
            await this.createTreeView();
        }
        if (!this.hasError()) {
            await this.resolveActiveDescendants();
        }
        if (!this.hasError()) {
            await this.setForbiddenView();
        }
        if (!this.hasError()) {
            await this.setVersionClass();
        }
        await this.deleteOnError();
        await PromiseHelper.setImmediate();
    }

    async setVersionClass () {
        const version = this.meta.getClassByName(this.data.version);
        if (version) {
            this.model.set('version', version.getId());
            this.model.forceSave();
        }
    }

    // GROUPS

    getGroupByName (name) {
        return ObjectHelper.getValue(name, this.groupMap);
    }

    async createGroups () {
        if (Array.isArray(this.data.groups)) {
            const items = this.Helper.orderItemHierarchy(this.data.groups);
            for (const item of items) {
                await this.createGroup(item);
            }
        }
    }

    async extendGroups () {
        const group = this.spawn('model/ClassGroup');
        const query = group.find({class: this.model.getId()}).index('name');
        this.groupMap = await query.all();
        this.groupImports = [];
        if (Array.isArray(this.data.groups)) {
            for (const item of this.data.groups) {
                const model = this.getGroupByName(item.name);
                await this.createGroup(item, model);
            }
        }
    }

    createGroup (data, model) {
        const constructor = model
            ? 'InheritedClassGroupImport'
            : 'ClassGroupImport';
        const instance = this.spawn(`import/${constructor}`, {
            owner: this,
            meta: this.meta,
            classModel: this.model,
            groupMap: this.groupMap,
            data, model
        });
        this.groupImports.push(instance);
        return instance.process();
    }

    // ATTRIBUTES

    getAttrByName (name) {
        return ObjectHelper.getValue(name, this.attrMap);
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
        const query = attr.find({class: this.model.getId()});
        this.attrMap = await query.index('name').all();
        this.attrImports = [];
        if (Array.isArray(this.data.attrs)) {
            for (const item of this.data.attrs) {
                const model = this.getAttrByName(item.name);
                await this.createAttr(item, model);
            }
        }
    }

    createAttr (data, model) {
        const constructor = model
            ? 'InheritedClassAttrImport'
            : 'ClassAttrImport';
        const instance = this.spawn(`import/${constructor}`, {
            owner: this,
            meta: this.meta,
            classModel: this.model,
            attrMap: this.attrMap,
            groupMap: this.groupMap,
            data, model
        });
        this.attrImports.push(instance);
        return instance.process();
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
        const jsonFiles = FileHelper.filterJsonFiles(files);
        this.viewImports = [];
        this.viewImportMap = {};
        for (const file of jsonFiles) {
            await this.createView(path.join(dir, file));
        }
    }

    async createView (file) {
        const instance = this.spawn('import/ViewImport', {
            meta: this.meta,
            classImport: this,
            classModel: this.model,
            viewMap: this.viewMap,
            groupMap: this.groupMap,
            file
        });
        instance.set('source', file);
        this.viewImports.push(instance);
        await instance.process();
        this.viewImportMap[instance.data.name] = instance;
        const name = path.basename(file);
        const error = this.Helper.getError(instance, `View: ${name}`);
        this.assignError(error);
    }

    setForbiddenView () {
        const view = this.data.forbiddenView;
        if (Object.hasOwn(this.viewImportMap, view)) {
            const id = this.viewImportMap[view].model.getId();
            this.model.set('forbiddenView', id);
            this.model.forceSave();
        }
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
        await this.Helper.importParamContainer(model, data, this.meta);
        this.assignError(this.Helper.getError(model, 'rules'));
    }

    async resolveRuleAttrs (data) {
        if (Array.isArray(data.attrs) && data.attrs.length) {
            const links = await PromiseHelper.map(data.attrs, this.resolveRuleAttr, this);
            data.attrs = {links};
        }
        return PromiseHelper.setImmediate();
    }

    async resolveRuleAttr (name) {
        const query = this.model.relAttrs().and({name});
        const attr = await query.one();
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
        await this.Helper.importParamContainer(model, data, this.meta);
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
            if (!Object.hasOwn(this.viewImportMap, data.view)) {
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
        names = names.filter(this.filterTransitionStates.bind(this, model));
        const links = names.map(name => this.stateMap[name].getId());
        model.set('startStates', {links});
    }

    filterTransitionStates (model, name) {
        if (Object.hasOwn(this.stateMap, name)) {
            return true;
        }
        this.assignError(`Transition: ${model.get('name')}: Invalid state: ${name}`);
        return false;
    }

    setTransitionFinalState (name, model) {
        if (Object.hasOwn(this.stateMap, name)) {
            model.set('finalState', this.stateMap[name].getId());
        } else if (name) {
            this.assignError(`Transition: ${model.get('name')}: Invalid state: ${name}`);
        }
    }

    // TREE VIEW

    createTreeView () {
        const instance = this.spawn('import/TreeViewImport', {
            owner: this,
            data: this.data.treeView,
            sourceClass: this.model
        });
        return instance.process();
    }

    // ACTIVE DESCENDANTS

    resolveActiveDescendants () {
        const names = this.data.activeDescendants;
        if (names?.length) {
            const data = this.meta.classMapByName;
            const activeDescendants = names
                .map(name => data[name]?.getId?.())
                .filter(v => v);
            return this.model.directUpdate({activeDescendants});
        }
    }
};
module.exports.init(module);

const FileHelper = require('areto/helper/FileHelper');
const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');
const path = require('path');