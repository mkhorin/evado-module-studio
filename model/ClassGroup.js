/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class ClassGroup extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_classGroup',
            ATTRS: [
                'name',
                'label',
                'active',
                'class',
                'description',
                'hidden',
                'hint',
                'loadable',
                'options',
                'orderNumber',
                'original',
                'overriddenState',
                'parent',
                'readOnly',
                'required',
                'type',
                'actionBinder'
            ],
            RULES: [
                ['name', 'required'],
                ['name', CodeNameValidator],
                ['name', 'unique', {filter: 'class'}],
                [['hint', 'label', 'description', 'type'], 'string'],
                ['parent', 'id'],
                [['active', 'hidden', 'loadable', 'readOnly', 'required'], 'checkbox'],
                ['orderNumber', 'integer'],
                ['orderNumber', 'default', {
                    value: (attr, model) => model.getBehavior('sortOrder').getNextNumber()
                }],
                ['overriddenState', 'safe'],
                ['options', 'json'],
                [['children', 'actionBinder', 'classAttrs'], 'relation']
            ],
            BEHAVIORS: {
                'ancestor': {
                    Class: AncestorBehavior,
                    relations: [{
                        name: 'descendants',
                        unchangeableAttrs: ['name']
                    }, {
                        name: 'viewGroups'
                    }]
                },
                'clone': {
                    Class: CloneBehavior
                },
                'overridden': {
                    Class: OverriddenValueBehavior,
                    originalValueMethodMap: {
                        'parent': this.getParentOriginalValue.bind(this)
                    },
                    attrs: [
                        'active',
                        'hidden',
                        'hint',
                        'label',
                        'loadable',
                        'description',
                        'options',
                        'orderNumber',
                        'parent',
                        'readOnly',
                        'required',
                        'type'
                    ]
                },
                'sortOrder': {
                    Class: SortOrderBehavior,
                    start: 1000,
                    filter: 'class',
                    overriddenBehavior: 'overridden'
                }
            },
            DELETE_ON_UNLINK: [
                'actionBinder',
                'descendants',
                'viewGroups'
            ],
            UNLINK_ON_DELETE: [
                'children',
                'classAttrs',
                'viewAttrs',
                'viewGroupParents'
            ],
            ATTR_LABELS: {
                actionBinder: 'Action binders',
                name: 'Code name',
                parent: 'Parent group',
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

    static getOnlySetCondition () {
        return ['notIn', 'type', ['tabs', 'columns']];
    }

    static async getParentOriginalValue (original, behavior) {
        // find group among current class groups by name from ancestor class group
        const value = original.get('parent');
        const name = await original.findById(value).scalar('name');
        const id = behavior.owner.get('class');
        return original.find({name}).and({class: id}).id();
    }

    getTitle () {
        return this.getFullTitle();
    }

    findForSelect (id) {
        return super.findForSelect(['id', 'class', id]);
    }

    getRelinkMap (key, value) {
        const keyQuery = this.find({class: key});
        const valueQuery = this.find({class: value});
        return super.getRelinkMap(keyQuery, valueQuery, 'name');
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf({scenario: 'clone'});
        model.getBehavior('clone').setOriginal(this);
        model.set('class', owner.getId());
        model.detachBehavior('ancestor');
        return model.forceSave();
    }

    relinkClassGroups (data) {
        this.set('parent', data[this.get('parent')]);
        this.detachBehavior('ancestor');
        return this.forceSave();
    }

    // INHERIT

    hasOriginal () {
        return !!this.get('original');
    }

    getParentQuery () {
        const solver = this.spawn('misc/HierarchySolver', {
            model: this
        });
        return solver.getParentQuery({
            class: this.get('class')
        });
    }

    inherit (classId) {
        const model = this.spawnSelf();
        model.setAttrs(this, [this.PK, 'overriddenState']);
        model.set('class', classId);
        model.set('original', this.getId());
        return model.forceSave();
    }

    // RELATIONS

    relActionBinder () {
        const Class = this.getClass('model/ActionBinder');
        return this.hasOne(Class, Class.PK, 'actionBinder');
    }

    relChildren () {
        const Class = this.getClass('model/ClassGroup');
        return this.hasMany(Class, 'parent', this.PK);
    }

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class');
    }

    relClassAttrs () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasMany(Class, 'group', this.PK);
    }

    relDescendants () {
        const Class = this.getClass('model/ClassGroup');
        return this.hasMany(Class, 'original', this.PK);
    }

    relOriginal () {
        const Class = this.getClass('model/ClassGroup');
        return this.hasOne(Class, Class.PK, 'original');
    }

    relParent () {
        const Class = this.getClass('model/ClassGroup');
        return this.hasOne(Class, Class.PK, 'parent');
    }

    relViewAttrs () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasMany(Class, 'group', this.PK);
    }

    relViewGroupParents () {
        const Class = this.getClass('model/ViewGroup');
        return this.hasMany(Class, 'parent', this.PK);
    }

    relViewGroups () {
        const Class = this.getClass('model/ViewGroup');
        return this.hasMany(Class, 'classGroup', this.PK);
    }
};

const AncestorBehavior = require('../component/behavior/AncestorBehavior');
const CloneBehavior = require('evado/component/behavior/CloneBehavior');
const CodeNameValidator = require('../component/validator/CodeNameValidator');
const OverriddenValueBehavior = require('evado/component/behavior/OverriddenValueBehavior');
const SortOrderBehavior = require('areto/behavior/SortOrderBehavior');

module.exports.init(module);