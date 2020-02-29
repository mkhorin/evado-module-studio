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
                'disableGroups',
                'header',
                'filter',
                'order',
                'grouping',
                'templateRoot',
                'disableTreeView',
                'options'
            ],
            RULES: [
                [['name', 'class'], 'required'],
                ['class', 'id'],
                ['name', {
                    Class: require('../component/validator/CodeNameValidator'),
                    validFilename: true
                }],
                [['name', 'label'], 'unique', {filter: 'class'}],
                [['label', 'description', 'templateRoot'], 'string'],
                [['disableGroups', 'disableTreeView'], 'checkbox'],
                [['filter', 'header', 'order', 'grouping', 'options'], 'json'],
                ['filter', 'validateFilter'],
                [['attrs', 'behaviors', 'groups', 'rules', 'treeViewLevels'], 'relation']
            ],
            BEHAVIORS: {
                'clone': {
                    Class: require('evado/component/behavior/CloneBehavior'),
                    relations: ['attrs', 'behaviors', 'groups', 'rules']
                }
            },
            UNLINK_ON_DELETE: [
                'attrs',
                'behaviors',
                'eagerViewAttrs',
                'eagerViewClassAttrs',
                'groups',
                'listViewAttrs',
                'listViewClassAttrs',
                'rules',
                'selectListViewAttrs',
                'selectListViewClassAttrs',
                'treeViewLevels'
            ],
            ATTR_LABELS: {
                'classAttrs': 'Class attributes',
                'header': 'Header template',
                'name': 'Code name',
                'order': 'Sort order'
            }
        };
    }

    findForSelect (id) {
        return super.findForSelect(['ID', 'class', id]);
    }

    async findParents (classId) {
        const models = await this.spawn('model/Class').getAncestors(classId);
        return this.find({'class': models.map(model => model.getId())});
    }

    validateFilter (attr) {
        const value = this.get(attr);
        if (value.Class) {
            const Class = require('areto/validator/SpawnValidator');
            return this.module.spawn(Class, {
                BaseClass: require('evado-meta-document/base/ViewFilter')
            }).validateAttr(this, attr);
        }
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.getBehavior('clone').setOriginal(this);
        model.set('class', owner.getId());
        return model.forceSave();
    }

    relinkClassAttrs (data) {
        return this.handleEachRelatedModel(['attrs', 'behaviors', 'rules'], model => model.relinkClassAttrs(data));
    }

    relinkClassGroups (data) {
        return this.handleEachRelatedModel(['attrs', 'groups'], model => model.relinkClassGroups(data));
    }

    // RELATIONS

    relAttrs () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasMany(Class, 'view', this.PK).order({orderNumber: 1}).with('classAttr')
            .deleteOnUnlink();
    }

    relBehaviors () {
        const Class = this.getClass('model/ViewBehavior');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1}).deleteOnUnlink();
    }

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class');
    }

    relClassAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, Class.PK, 'classAttr').via('attrs');
    }

    relEagerViewAttrs () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasMany(Class, 'eagerView', this.PK);
    }

    relEagerViewClassAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, 'eagerView', this.PK);
    }

    relGroups () {
        const Class = this.getClass('model/ViewGroup');
        return this.hasMany(Class, 'view', this.PK).with('classGroup').deleteOnUnlink();
    }

    relListViewAttrs () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasMany(Class, 'listView', this.PK);
    }

    relListViewClassAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, 'listView', this.PK);
    }

    relRules () {
        const Class = this.getClass('model/ViewRule');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1}).with('attrs').deleteOnUnlink();
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
        return this.hasMany(Class, 'owner', this.PK).with('refAttr', 'view').deleteOnUnlink();
    }
};
module.exports.init(module);

