/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class View extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_view',
            ATTRS: [
                'name',
                'label',
                'description',
                'class',
                'creationView',
                'disableGroups',
                'editView',
                'header',
                'filter',
                'order',
                'original',
                'grouping',
                'readOnly',
                'templateRoot',
                'disableTreeView',
                'options'
            ],
            RULES: [
                [['name', 'class'], 'required'],
                [['class', 'creationView', 'editView', 'original'], 'id'],
                ['name', {
                    Class: require('../component/validator/CodeNameValidator'),
                    validFilename: true
                }],
                ['name', 'unique', {filter: 'class'}],
                [['label', 'description', 'templateRoot'], 'string'],
                [['disableGroups', 'disableTreeView', 'readOnly'], 'checkbox'],
                [['filter', 'header', 'order', 'grouping', 'options'], 'json'],
                ['filter', 'validateFilter'],
                [['attrs', 'behaviors', 'groups', 'rules', 'treeViewLevels'], 'relation']
            ],
            BEHAVIORS: {
                'ancestor': {
                    Class: require('../component/behavior/AncestorBehavior'),
                    relations: [{
                        name: 'descendants',
                        unchangeableAttrs: ['name', 'label']
                    }],
                    withOriginalOnly: true
                },
                'clone': {
                    Class: require('evado/component/behavior/CloneBehavior'),
                    relations: ['attrs', 'behaviors', 'groups', 'rules']
                },
                'overridden': {
                    Class: require('evado/component/behavior/OverriddenValueBehavior'),
                    attrs: []
                }
            },
            DELETE_ON_UNLINK: [
                'attrs',
                'behaviors',
                'descendants',
                'groups',
                'rules',
                'treeViewLevels'
            ],
            UNLINK_ON_DELETE: [
                'eagerViewAttrs',
                'eagerViewClassAttrs',
                'forbiddenViewClasses',
                'listViewAttrs',
                'listViewClassAttrs',
                'selectListViewAttrs',
                'selectListViewClassAttrs'
            ],
            ATTR_LABELS: {
                classAttrs: 'Class attributes',
                header: 'Header template',
                name: 'Code name',
                order: 'Sort order'
            }
        };
    }

    getTitle () {
        return this.getFullTitle();
    }

    findForSelect (id) {
        return super.findForSelect(['ID', 'class', id]);
    }

    async findParents (classId) {
        const models = await this.spawn('model/Class').getAncestors(classId);
        return this.find({
            'class': models.map(model => model.getId()),
            'original': null
        });
    }

    validateFilter (attr) {
        const value = this.get(attr);
        if (value.Class) {
            const Class = require('areto/validator/SpawnValidator');
            return this.module.spawn(Class, {
                BaseClass: require('evado-meta-base/base/ViewFilter')
            }).validateAttr(this, attr);
        }
    }

    // CLONE

    async afterClone (sample) {
        await this.relinkAttrs(sample);
    }

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.getBehavior('clone').setOriginal(this);
        model.set('class', owner.getId());
        return model.forceSave();
    }

    getRelinkMap (key, value) {
        return super.getRelinkMap(this.find({class: key}), this.find({class: value}), 'name');
    }

    getRelinkMapByClass (name, sample) {
        const oid = sample.get('class');
        const cid = this.get('class');
        return CommonHelper.isEqual(oid, cid) ? null : this.spawn(name).getRelinkMap(oid, cid);
    }

    async relinkAttrs (sample) {
        const data = await this.getRelinkMapByClass('model/ClassAttr', sample);
        if (data) {
            await this.relinkClassAttrs(data);
            await this.relinkClassGroups(data);
        }
    }

    relinkClassAttrs (data) {
        return this.handleEachRelatedModel(['attrs', 'behaviors', 'rules'], model => model.relinkClassAttrs(data));
    }

    relinkClassGroups (data) {
        return this.handleEachRelatedModel(['attrs', 'groups'], model => model.relinkClassGroups(data));
    }

    async relinkClass (sampleClass, targetClass) {
        this.set('class', targetClass);
        const data = await this.getRelinkMap(sampleClass, targetClass);
        return this.relinkViews(data);
    }

    relinkViews (data) {
        return this.directUpdate({
            creationView: data[this.get('creationView')],
            editView: data[this.get('editView')]
        });
    }

    // INHERIT

    hasOriginal () {
        return !!this.get('original');
    }

    async inherit (classId) {
        const model = this.spawnSelf();
        model.setAttrs(this, [this.PK, 'overriddenState']);
        model.set('class', classId);
        model.set('original', this.get('original') || this.getId());
        return model.save();
    }

    // RELATIONS

    relAttrs () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasMany(Class, 'view', this.PK).order({orderNumber: 1}).with('classAttr');
    }

    relBehaviors () {
        const Class = this.getClass('model/ViewBehavior');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1});
    }

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class');
    }

    relClassAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, Class.PK, 'classAttr').via('attrs');
    }

    relCreationView () {
        const Class = this.constructor;
        return this.hasOne(Class, Class.PK, 'creationView');
    }

    relEditView () {
        const Class = this.constructor;
        return this.hasOne(Class, Class.PK, 'editView');
    }

    relEagerViewAttrs () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasMany(Class, 'eagerView', this.PK);
    }

    relEagerViewClassAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, 'eagerView', this.PK);
    }

    relForbiddenViewClasses () {
        const Class = this.getClass('model/Class');
        return this.hasMany(Class, 'forbiddenView', this.PK);
    }

    relGroups () {
        const Class = this.getClass('model/ViewGroup');
        return this.hasMany(Class, 'view', this.PK).with('classGroup');
    }

    relListViewAttrs () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasMany(Class, 'listView', this.PK);
    }

    relListViewClassAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, 'listView', this.PK);
    }

    relDescendants () {
        const Class = this.getClass('model/View');
        return this.hasMany(Class, 'original', this.PK);
    }

    relOriginal () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'original');
    }

    relRules () {
        const Class = this.getClass('model/ViewRule');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1}).with('attrs');
    }

    relSelectListViewAttrs () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasMany(Class, 'selectListView', this.PK);
    }

    relSelectListViewClassAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, 'selectListView', this.PK);
    }

    relTreeViewLevels () {
        const Class = this.getClass('model/TreeViewLevel');
        return this.hasMany(Class, 'owner', this.PK).with('refAttr', 'view');
    }
};
module.exports.init(module);

const CommonHelper = require('areto/helper/CommonHelper');