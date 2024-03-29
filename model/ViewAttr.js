/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class ViewAttr extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_viewAttr',
            ATTRS: [
                'label',
                'classAttr',
                'commands',
                'createOnRead',
                'defaultValue',
                'eagerDepth',
                'eagerLoading',
                'eagerView',
                'escape',
                'expression',
                'extHint',
                'group',
                'actionBinder',
                'header',
                'hidden',
                'hideEmpty',
                'hint',
                'history',
                'listView',
                'options',
                'orderNumber',
                'sortable',
                'overriddenState',
                'readOnly',
                'required',
                'selectListView',
                'unique',
                'view',
                'viewType'
            ],
            RULES: [
                [['classAttr', 'view'], 'required'],
                [['classAttr', 'view', 'group', 'eagerView', 'listView', 'selectListView'], 'id'],
                [['label', 'hint', 'extHint'], 'string'],
                [['eagerDepth', 'orderNumber'], 'integer'],
                [['overriddenState', 'viewType'], 'safe'],
                [['createOnRead', 'eagerLoading', 'escape', 'hidden', 'hideEmpty', 'history', 'readOnly', 'required', 'sortable', 'unique'], 'checkbox'],
                [['defaultValue', 'expression', 'header', 'options'], 'json'],
                ['commands', 'filter', {method: 'split'}],
                ['classAttr', 'unique', {filter: 'view'}],
                [['actionBinder', 'behaviors', 'rules'], 'relation']
            ],
            BEHAVIORS: {
                'sortOrder': {
                    Class: SortOrderBehavior,
                    filter: 'view',
                    overriddenBehavior: 'overridden'
                },
                'overridden': {
                    Class: OverriddenValueBehavior,
                    originalAttr: 'classAttr',
                    attrs: [
                        'commands',
                        'createOnRead',
                        'defaultValue',
                        'eagerDepth',
                        'eagerLoading',
                        'eagerView',
                        'escape',
                        'expression',
                        'extHint',
                        'group',
                        'header',
                        'hidden',
                        'hideEmpty',
                        'hint',
                        'history',
                        'label',
                        'listView',
                        'sortable',
                        'options',
                        'readOnly',
                        'required',
                        'selectListView',
                        'unique',
                        'viewType'
                    ]
                }
            },
            DELETE_ON_UNLINK: [
                'actionBinder',
                'behaviors',
                'rules'
            ],
            ATTR_LABELS: {
                actionBinder: 'Action binders',
                classAttr: 'Class attribute',
                expression: 'Calculated expression',
                extHint: 'Extended hint',
                header: 'Header template',
                readOnly: 'Read-only'
            }
        };
    }

    static filterInherited (attrs, groupId) {
        return attrs.filter(attr => {
            const overridden = attr.getBehavior('overridden');
            const classGroupId = overridden.get('classGroup');
            return CommonHelper.isEqual(groupId, classGroupId);
        });
    }

    getTitle () {
        return this.getFullTitle();
    }

    getFullTitle () {
        const name = this.get('classAttr.name') || this.getId();
        const label = this.get('label');
        return label ? `${label} (${name})` : name;
    }

    async createByClassAttrs (attrs, view) {
        const query = this.find({view: view.getId()}).raw().index('classAttr');
        const usedMap = await query.all();
        const models = [];
        for (const attr of attrs) {
            if (!usedMap[attr.getId()]) {
                const model = await this.createByClassAttr(attr, view);
                models.push(model);
            }
        }
        return models;
    }

    async createByClassAttr (attr, view) {
        const model = this.spawnSelf();
        model.setAttrs(attr, this.PK);
        model.set('view', view.getId());
        model.set('classAttr', attr.getId());
        model.unset('overriddenState');
        await model.forceSave();
        return model;
    }

    findByViewAndGroup (view, classGroup, classAttr) {
        return this.find({view})
            .and(['or', {classGroup}, {classAttr}])
            .with('classAttr');
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('view', owner.getId());
        return model.forceSave();
    }

    relinkClassAttrs (data) {
        if (this.relinkAttr('classAttr', data)) {
            return this.forceSave();
        }
    }

    relinkClassGroups (data) {
        if (this.relinkAttr('group', data)) {
            return this.forceSave();
        }
    }

    // RELATIONS

    relActionBinder () {
        const Class = this.getClass('model/ActionBinder');
        return this.hasOne(Class, Class.PK, 'actionBinder');
    }

    relBehaviors () {
        const Class = this.getClass('model/ViewAttrBehavior');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1});
    }

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class').via('classAttr');
    }

    relClassAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'classAttr');
    }

    relEagerView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'eagerView');
    }

    relGroup () {
        const Class = this.getClass('model/ClassGroup');
        return this.hasOne(Class, Class.PK, 'group');
    }

    relListView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'listView');
    }

    relRules () {
        const Class = this.getClass('model/ViewAttrRule');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1});
    }

    relSelectListView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'selectListView');
    }

    relView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'view');
    }
};

const CommonHelper = require('areto/helper/CommonHelper');
const OverriddenValueBehavior = require('evado/component/behavior/OverriddenValueBehavior');
const SortOrderBehavior = require('areto/behavior/SortOrderBehavior');

module.exports.init(module);