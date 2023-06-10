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
                'active',
                'label',
                'classGroup',
                'description',
                'hidden',
                'hint',
                'loadable',
                'options',
                'orderNumber',
                'overriddenState',
                'parent',
                'readOnly',
                'required',
                'type',
                'view',
                'actionBinder'
            ],
            RULES: [
                [['view', 'classGroup'], 'required'],
                [['view', 'classGroup', 'parent'], 'id'],
                [['hint', 'label', 'description', 'type'], 'string'],
                ['orderNumber', 'integer'],
                [['active', 'hidden', 'loadable', 'readOnly', 'required'], 'checkbox'],
                ['options', 'json'],
                ['actionBinder', 'relation'],
                ['overriddenState', 'safe']
            ],
            BEHAVIORS: {
                'sortOrder': {
                    Class: SortOrderBehavior,
                    filter: 'view',
                    overriddenBehavior: 'overridden'
                },
                'overridden': {
                    Class: OverriddenValueBehavior,
                    originalAttr: 'classGroup',
                    attrs: [
                        'active',
                        'description',
                        'hidden',
                        'hint',
                        'label',
                        'loadable',
                        'options',
                        'orderNumber',
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
                actionBinder: 'Action binders',
                attrs: 'Attributes',
                readOnly: 'Read-only'
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

    getFullTitle () {
        const name = this.get('classGroup.name') || this.getId();
        const label = this.get('label');
        return label ? `${label} (${name})` : name;
    }

    async createByGroups (ids, view) {
        const viewId = view.getId();
        const groupIds = await this.find({view: viewId}).column('classGroup');
        ids = MongoHelper.exclude(groupIds, ids);
        const result = [];
        for (const id of ids) {
            const model = this.spawnSelf();
            model.set('view', viewId);
            model.set('classGroup', id);
            result.push(model);
            await model.forceSave();
        }
        return result;
    }

    findForSelect (id) {
        return super.findForSelect(['id', 'view', id]);
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('view', owner.getId());
        return model.forceSave();
    }

    relinkClassGroups (data) {
        const id = this.get('classGroup');
        if (Object.hasOwn(data, id)) {
            this.set('classGroup', data[id]);
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

const MongoHelper = require('areto/helper/MongoHelper');
const OverriddenValueBehavior = require('evado/component/behavior/OverriddenValueBehavior');
const SortOrderBehavior = require('areto/behavior/SortOrderBehavior');

module.exports.init(module);