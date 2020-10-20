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
                'active',
                'class',
                'hint',
                'name',
                'label',
                'description',
                'orderNumber',
                'original',
                'parent',
                'readOnly',
                'required',
                'type',
                'actionBinder',
                'options',
                'overriddenState'
            ],
            RULES: [
                ['name', 'required'],
                ['type', 'range', {range: ['tabs', 'columns']}],
                ['name', require('../component/validator/CodeNameValidator')],
                ['name', 'unique', {filter: 'class'}],
                [['hint', 'label', 'description'], 'string'],
                ['parent', 'id'],
                [['active', 'readOnly', 'required'], 'checkbox'],
                ['orderNumber', 'number', {integerOnly: true}],
                ['orderNumber', 'default', {
                    value: (attr, model) => model.getBehavior('sortOrder').getNextNumber()
                }],
                ['overriddenState', 'safe'],
                ['options', 'json'],
                [['children', 'actionBinder', 'classAttrs'], 'relation']
            ],
            BEHAVIORS: {
                'ancestor': {
                    Class: require('../component/behavior/AncestorBehavior'),
                    relations: [{
                        name: 'descendants',
                        unchangeableAttrs: ['name']
                    }, {
                        name: 'viewGroups'
                    }]
                },
                'clone': {
                    Class: require('evado/component/behavior/CloneBehavior')
                },
                'overridden': {
                    Class: require('evado/component/behavior/OverriddenValueBehavior'),
                    originalValueMethodMap: {
                        'parent': this.getParentOriginalValue.bind(this)
                    },
                    attrs: [
                        'active',
                        'hint',
                        'label',
                        'description',
                        'options',
                        'orderNumber',
                        'parent',
                        'type'
                    ]
                },
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
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
        return ['NOT IN', 'type', ['tabs', 'columns']];
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
        return super.findForSelect(['ID', 'class', id]);
    }

    getRelinkMap (key, value) {
        return super.getRelinkMap(this.find({class: key}), this.find({class: value}), 'name');
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
        const solver = this.spawn('other/HierarchySolver', {model: this});
        return solver.getParentQuery({class: this.get('class')});
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
module.exports.init(module);