/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class ViewGroup extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_viewGroup',
            ATTRS: [
                'classGroup',
                'label',
                'type',
                'active',
                'description',
                'hint',
                'orderNumber',
                'parent',
                'readOnly',
                'required',
                'view',
                'actionBinder',
                'options',
                'overriddenState'
            ],
            RULES: [
                [['view', 'classGroup'], 'required'],
                [['view', 'classGroup', 'parent'], 'id'],
                ['type', 'range', {range: ['tabs']}],
                [['hint', 'label', 'description'], 'string'],
                ['orderNumber', 'number', {integerOnly: true}],
                [['active', 'readOnly', 'required'], 'checkbox'],
                ['options', 'json'],
                ['actionBinder', 'relation'],
                ['overriddenState', 'safe']
            ],
            BEHAVIORS: {
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
                    filter: 'view',
                    overriddenBehavior: 'overridden'
                },
                'overridden': {
                    Class: require('evado/component/behavior/OverriddenValueBehavior'),
                    originalAttr: 'classGroup',
                    attrs: [
                        'active',
                        'hint',
                        'label',
                        'description',
                        'orderNumber',
                        'options',
                        'parent',
                        'readOnly',
                        'required',
                        'type'
                    ]
                }
            },
            DELETE_ON_UNLINK: [
                'actionBinder'
            ],
            ATTR_LABELS: {
                'attrs': 'Attributes'
            },
            ATTR_VALUE_LABELS: {
                'type': {
                    tabs: 'Tab container',
                    columns: 'Column container'
                }
            }
        };
    }

    getTitle () {
        return this.getFullTitle();
    }

    async createByGroups (ids, view) {
        const result = [];
        const groupIds = await this.find({view: view.getId()}).column('classGroup');
        ids = MongoHelper.exclude(groupIds, ids);
        for (const id of ids) {
            const model = this.spawnSelf();
            model.set('view', view.getId());
            model.set('classGroup', id);
            result.push(model);
            await model.forceSave();
        }
        return result;
    }

    findForSelect (id) {
        return super.findForSelect(['ID', 'view', id]);
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('view', owner.getId());
        return model.forceSave();
    }

    relinkClassGroups (data) {
        if (data.hasOwnProperty(this.get('classGroup'))) {
            this.set('classGroup', data[this.get('classGroup')]);
            return this.forceSave();
        }
    }

    // RELATIONS

    relActionBinder () {
        const Class = this.getClass('model/ActionBinder');
        return this.hasOne(Class, Class.PK, 'actionBinder');
    }

    relAttrs () {
        const ViewAttr = this.getClass('model/ViewAttr');
        return this.hasMany(ViewAttr, 'group', 'classGroup');
    }

    relClassGroup () {
        const ClassGroup = this.getClass('model/ClassGroup');
        return this.hasOne(ClassGroup, ClassGroup.PK, 'classGroup');
    }

    relParent () {
        const ClassGroup = this.getClass('model/ClassGroup');
        return this.hasOne(ClassGroup, ClassGroup.PK, 'parent');
    }

    relView () {
        const View = this.getClass('model/View');
        return this.hasOne(View, View.PK, 'view');
    }
};
module.exports.init(module);

const MongoHelper = require('areto/helper/MongoHelper');