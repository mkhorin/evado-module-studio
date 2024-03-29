/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class Class extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_class',
            ATTRS: [
                'abstract',
                'activeDescendants',
                'description',
                'disableTreeView',
                'forbiddenView',
                'grouping',
                'header',
                'key',
                'label',
                'modelConfig',
                'name',
                'options',
                'order',
                'parent',
                'templateRoot',
                'version'
            ],
            INDEXES: [[{name: 1}, {unique: true}]],
            RULES: [
                ['name', 'required'],
                [['forbiddenView', 'key', 'parent', 'version'], 'id'],
                ['name', {
                    Class: CodeNameValidator,
                    validFilename: true
                }],
                ['name', 'unique'],
                [['label', 'description', 'templateRoot'], 'string'],
                [['header', 'order', 'grouping', 'options'], 'json'],
                ['modelConfig', 'spawn', {BaseClass: Model}],
                [['abstract', 'disableTreeView'], 'checkbox'],
                [[
                    'activeDescendants',
                    'behaviors',
                    'indexes',
                    'rules',
                    'states',
                    'transitions',
                    'treeViewLevels',
                    'views'], 'relation'],
                [[
                    'groups',
                    'attrs'], 'relation', {filter: this.filterInheritedChanges.bind(this)}]
            ],
            BEHAVIORS: {
                'clone': {
                    Class: CloneBehavior,
                    relations: [
                        'attrs',
                        'behaviors',
                        'groups',
                        'indexes',
                        'rules',
                        'states',
                        'transitions',
                        'views'
                    ]
                }
            },
            DELETE_ON_UNLINK: [
                'attrs',
                'behaviors',
                'children',
                'groups',
                'indexes',
                'nodes',
                'rules',
                'states',
                'transitions',
                'views'
            ],
            UNLINK_ON_DELETE: [
                'activeAncestors'
            ],
            ATTR_LABELS: {
                abstract: 'Abstract class',
                header: 'Header template',
                key: 'Primary key',
                modelConfig: 'Model configuration',
                name: 'Code name',
                order: 'Sort order',
                version: 'New version'
            },
            COMMAND_VALUE_LABELS: {
                create: 'Create',
                edit: 'Edit',
                delete: 'Delete'
            }
        };
    }

    static filterInheritedChanges (changes) {
        changes.deletes = changes.deletes.filter(model => !model.hasOriginal());
    }

    hasParent () {
        return !!this.get('parent');
    }

    getTitle () {
        return this.getFullTitle();
    }

    async getAncestors (classId) {
        const model = await this.findById(classId).one();
        const solver = this.spawn('misc/HierarchySolver', {model});
        return solver.getAncestors(model);
    }

    async getViewMapByName () {
        const viewMap = await this.relViews().index('name').all();
        this.set('viewMapByName', viewMap);
    }

    async setAttrMapByName () {
        const attrMap = await this.relAttrs().index('name').all();
        this.set('attrMapByName', attrMap);
    }

    async findDescendants () {
        const solver = this.spawn('misc/HierarchySolver', {model: this});
        return solver.getDescendantAndParentQuery(...arguments);
    }

    // CLONE

    async afterClone (sample) {
        await this.relinkAttrs(sample);
        await this.relinkGroups(sample);
        await this.relinkViews(sample);
    }

    async relinkAttrs (sample) {
        const attr = this.spawn('model/ClassAttr');
        const data = await attr.getRelinkMap(sample.getId(), this.getId());
        const names = [
            'attrs',
            'behaviors',
            'indexes',
            'rules',
            'views'
        ];
        await this.handleEachRelatedModel(names, model => {
            return model.relinkClassAttrs(data);
        });
    }

    async relinkGroups (sample) {
        const group = this.spawn('model/ClassGroup');
        const data = await group.getRelinkMap(sample.getId(), this.getId());
        const names = ['attrs', 'groups', 'views'];
        await this.handleEachRelatedModel(names, model => {
            return model.relinkClassGroups(data);
        });
    }

    async relinkViews (sample) {
        const view = this.spawn('model/View');
        const data = await view.getRelinkMap(sample.getId(), this.getId());
        const models = await this.resolveRelation('views');
        for (const model of models) {
            await model.relinkViews(data);
        }
        await this.relinkForbiddenView(data);
    }

    relinkForbiddenView (data) {
        const value = this.get('forbiddenView');
        return value
            ? this.directUpdate({forbiddenView: data[value]})
            : null;
    }

    // INHERIT

    async createInheritedItems () {
        await PromiseHelper.setImmediate();
        const parent = this.rel('parent');
        const relations = ['attrs', 'groups', 'views'];
        const [attrs, groups, views] = await parent.resolveRelations(relations);
        for (const model of groups) {
            await model.inherit(this.getId());
        }
        for (const model of attrs) {
            await model.inherit(this.getId());
        }
        for (const model of views) {
            await model.inherit(this.getId());
        }
        return this.relinkGroups(parent);
    }

    // EVENTS

    async afterInsert () {
        const parent = await this.resolveRelation('parent');
        if (parent && this.scenario !== 'clone') {
            await this.createInheritedItems();
        }
        return super.afterInsert();
    }

    // RELATIONS

    relActiveAncestors () {
        const Class = this.getClass('model/Class');
        return this.hasMany(Class, 'activeDescendants', this.PK).viaArray();
    }

    relActiveDescendants () {
        const Class = this.getClass('model/Class');
        return this.hasMany(Class, Class.PK, 'activeDescendants').viaArray().and({abstract: false});
    }

    relAttrMap () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, 'class', this.PK).index('name');
    }

    relAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, 'class', this.PK).order({orderNumber: 1});
    }

    relBehaviors () {
        const Class = this.getClass('model/ClassBehavior');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1});
    }

    relChildren () {
        const Class = this.getClass('model/Class');
        return this.hasMany(Class, 'parent', this.PK);
    }

    relForbiddenView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'forbiddenView');
    }

    relGroups () {
        const Class = this.getClass('model/ClassGroup');
        return this.hasMany(Class, 'class', this.PK).order({orderNumber: 1}).with('parent');
    }

    relIndexes () {
        const Class = this.getClass('model/ClassIndex');
        return this.hasMany(Class, 'class', this.PK);
    }

    relKey () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'key');
    }

    relNodes () {
        const Class = this.getClass('model/Node');
        return this.hasMany(Class, 'class', this.PK);
    }

    relParent () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'parent');
    }

    relRules () {
        const Class = this.getClass('model/ClassRule');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1}).with('attrs');
    }

    relStateMap () {
        const Class = this.getClass('model/State');
        return this.hasMany(Class, 'class', this.PK).index(Class.PK);
    }

    relStates () {
        const Class = this.getClass('model/State');
        return this.hasMany(Class, 'class', this.PK);
    }

    relTransitions () {
        const Class = this.getClass('model/Transition');
        return this.hasMany(Class, 'class', this.PK).order({orderNumber: 1});
    }

    relTreeViewLevels () {
        const Class = this.getClass('model/TreeViewLevel');
        return this.hasMany(Class, 'owner', this.PK).order({[Class.PK]: 1}).with('refAttr');
    }

    relVersion () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'version');
    }

    relViewAttrs () {
        const ViewAttr = this.getClass('model/ViewAttr');
        const View = this.getClass('model/View');
        return this.hasMany(ViewAttr, 'view', View.PK).via('views');
    }

    relViewMap () {
        const Class = this.getClass('model/View');
        return this.hasMany(Class, 'class', this.PK).index('name');
    }

    relViews () {
        const Class = this.getClass('model/View');
        return this.hasMany(Class, 'class', this.PK);
    }
};

const CloneBehavior = require('evado/component/behavior/CloneBehavior');
const CodeNameValidator = require('../component/validator/CodeNameValidator');
const Model = require('evado-meta-base/model/Model');
const PromiseHelper = require('areto/helper/PromiseHelper');

module.exports.init(module);