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
                [['label'], 'unique', {filter: 'view'}],
                [['eagerDepth', 'orderNumber'], 'number', {integerOnly: true}],
                [['overriddenState', 'viewType'], 'safe'],
                [['eagerLoading', 'escape', 'hidden', 'history', 'readOnly', 'required',
                  'sortable', 'unique'], 'checkbox'],
                [['defaultValue', 'expression', 'header', 'options'], 'json'],
                ['commands', 'filter', {filter: 'split'}],
                ['classAttr', 'unique', {filter: 'view'}],
                [['actionBinder', 'behaviors', 'rules'], 'relation']
            ],
            BEHAVIORS: {
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
                    filter: 'view',
                    overriddenBehavior: 'overridden'
                },
                'overridden': {
                    Class: require('evado/component/behavior/OverriddenValueBehavior'),
                    originalAttr: 'classAttr',
                    attrs: [
                        'commands',
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
                'classAttr': 'Class attribute',
                'expression': 'Calculated expression',
                'extHint': 'Extended hint',
                'header': 'Header template'
            }
        };
    }

    static filterInherited (attrs, groupId) {
        return attrs.filter(attr => {
            return CommonHelper.isEqual(groupId, attr.getBehavior('overridden').get('classGroup'));
        });
    }

    async createByClassAttrs (attrs, view) {
        const usedMap = await this.find({view: view.getId()}).raw().index('classAttr').all();
        const models = [];
        for (const attr of attrs) {
            if (!usedMap[attr.getId()]) {
                models.push(await this.createByClassAttr(attr, view));
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
        return this.find({view}).and(['OR', {classGroup}, {classAttr}]).with('classAttr');
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('view', owner.getId());
        return model.forceSave();
    }

    relinkClassAttrs (data) {
        if (data.hasOwnProperty(this.get('classAttr'))) {
            this.set('classAttr', data[this.get('classAttr')]);
            return this.forceSave();
        }
    }

    relinkClassGroups (data) {
        if (data.hasOwnProperty(this.get('group'))) {
            this.set('group', data[this.get('group')]);
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
module.exports.init(module);

const CommonHelper = require('areto/helper/CommonHelper');