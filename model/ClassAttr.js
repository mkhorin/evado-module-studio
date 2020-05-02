/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const DEFAULT_COMMANDS = ['add', 'remove', 'create', 'edit'];

const Base = require('../component/base/BaseActiveRecord');

module.exports = class ClassAttr extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_classAttr',
            ATTRS: [
                'label',
                'class',
                'commands',
                'commonSearchable',
                'defaultValue',
                'description',
                'extHint',
                'eagerLoading',
                'eagerView',
                'escape',
                'expression',
                'finder',
                'group',
                'header',
                'hidden',
                'hint',
                'history',
                'indexing',
                'linkAttr',
                'listView',
                'multiple',
                'eagerDepth',
                'name',
                'onDelete',
                'onUpdate',
                'options',
                'orderNumber',
                'original',
                'overriddenState',
                'actionBinder',
                'sortable',
                'sortableRelation',
                'refAttr',
                'refClass',
                'readOnly',
                'required',
                'searchDepth',
                'selectListView',
                'selectSearchable',
                'trim',
                'type',
                'unique',
                'viewType'
            ],
            RULES: [
                [['name', 'type'], 'required'],
                ['refClass', 'required', {when: model => model.isRelation()}],
                [['class', 'original'], 'id', {on: 'create'}],
                [['eagerView', 'group', 'linkAttr', 'listView', 'refAttr', 'refClass', 'selectListView'], 'id'],
                [['label', 'description', 'hint', 'extHint'], 'string'],
                [['orderNumber', 'eagerDepth', 'searchDepth'], 'number', {integerOnly: true}],
                ['name', require('../component/validator/AttrNameValidator')],
                [['name', 'label'], 'unique', {filter: 'class'}],
                ['name', 'validateSystemAttr'],
                ['commands', 'filter', {filter: 'split'}],
                ['commands', 'default', {value: DEFAULT_COMMANDS}],
                [['escape', 'trim'], 'default', {value: true}],
                ['type', 'default', {value: 'string'}],
                [['onDelete', 'onUpdate'], 'range', {range: ['cascade', 'null']}],
                ['orderNumber', 'default', {
                    value: (attr, model) => model.getBehavior('sortOrder').getNextNumber()
                }],
                ['finder', 'spawn', {BaseClass: require('evado-meta-base/attr/RelationFinder')}],
                [['viewType', 'overriddenState'], 'safe'],
                ['indexing', 'number'],
                ['indexing', 'range', {range:[-1, 1]}],
                [['commonSearchable', 'eagerLoading', 'escape', 'hidden', 'history', 'multiple', 'readOnly',
                    'required', 'selectSearchable', 'sortable', 'sortableRelation', 'trim', 'unique'], 'checkbox'],
                [['defaultValue', 'expression', 'header', 'options'], 'json'],
                [['actionBinder', 'behaviors', 'enums', 'rules', 'via'], 'relation']
            ],
            BEHAVIORS: {
                'ancestor': {
                    Class: require('../component/behavior/AncestorBehavior'),
                    relations: [{
                        name: 'descendants',
                        unchangeableAttrs: ['name', 'type']
                    }, {
                        name: 'viewAttrs'
                    }]
                },
                'clone': {
                    Class: require('evado/component/behavior/CloneBehavior'),
                    excludedAttrs: ['original'],
                    relations: [
                        'enums',
                        'rules',
                        'via'
                    ]
                },
                'overridden': {
                    Class: require('evado/component/behavior/OverriddenValueBehavior'),
                    originalValueMethodMap: {
                        'group': this.getGroupOriginalValue.bind(this)
                    },
                    attrs: [
                        'commands',
                        'commonSearchable',
                        'defaultValue',
                        'description',
                        'hint',
                        'extHint',
                        'eagerDepth',
                        'eagerLoading',
                        'eagerView',
                        'escape',
                        'expression',
                        'group',
                        'header',
                        'hidden',
                        'label',
                        'linkAttr',
                        'listView',
                        'multiple',
                        'onDelete',
                        'onUpdate',
                        'options',
                        'orderNumber',
                        'sortable',
                        'sortableRelation',
                        'readOnly',
                        'refAttr',
                        'refClass',
                        'required',
                        'searchDepth',
                        'selectListView',
                        'selectSearchable',
                        'trim',
                        'unique',
                        'viewType'
                    ]
                },
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
                    filter: 'class',
                    overriddenBehavior: 'overridden'
                }
            },
            UNLINK_ON_DELETE: [
                'actionBinder',
                'behaviors',
                'descendants',
                'enums',
                'indexAttr',
                'rules',
                'treeViewLevels',
                'via',
                'viewAttrs'
            ],
            ATTR_LABELS: {
                'expression': 'Calculated expression',
                'extHint': 'Extended hint',
                'header': 'Header template',
                'linkAttr': 'Link attribute',
                'name': 'Code name',
                'refAttr': 'Reference attribute',
                'refClass': 'Reference class',
                'via': 'Intermediate link'
            },
            ATTR_VALUE_LABELS: {
                'onDelete': {
                    cascade: 'Cascade',
                    null: 'Null'
                },
                'onUpdate': {
                    cascade: 'Cascade',
                    null: 'Null'
                },
                'type': {
                    string: 'String',
                    ref: 'Reference',
                    backref: 'Back reference',
                    integer: 'Integer',
                    boolean: 'Boolean',
                    date: 'Date',
                    calc: 'Calculated',
                    file: 'File',
                    float: 'Float',
                    id: 'Identifier',
                    text: 'Text',
                    user: 'User'
                },
                'viewType': {
                    date: 'Date',
                    datetime: 'Date and time',
                    localDate: 'Local date',
                    localDatetime: 'Local date and time',
                    relationSelect: 'Object select box',
                    class: 'Metaclass',
                    radioList: 'Radio list',
                    select: 'Select box',
                    state: 'Workflow state',
                    string: 'String',
                    time: 'Time',
                    thumbnail: 'Thumbnail'
                }
            },
            RELATED_ACTION_ENUMS: [{
                items: [['null', 'Null']],
                condition: {type: 'ref'}
            },{
                items: [['cascade', 'Cascade']],
                condition: {type: ['ref', 'backref']}
            }],
            TYPE_ENUMS: [{
                items: [
                    ['date', 'Date'],
                    ['datetime', 'Date and time'],
                    ['localDate', 'Local date'],
                    ['localDatetime', 'Local date and time'],
                    ['string', 'String']
                ],
                condition: {type: 'date'}
            },{
                items: [
                    ['radioList', 'Radio list'],
                    ['select', 'Select box'],
                    ['string', 'String']
                ],
                condition: {type: ['float', 'id', 'integer', 'string']}
            },{
                items: [
                    ['relationSelect', 'Object select box'],
                    ['string', 'String'],
                    ['thumbnail', 'Thumbnail']
                ],
                condition: {type: ['ref', 'backref']}
            },{
                items: [
                    ['state', 'Workflow state'],
                    ['class', 'Metaclass']
                ],
                condition: {type: ['string']}
            },{
                items: [['time', 'Time']],
                condition: {type: 'integer'}
            }],
            COMMAND_VALUE_LABELS: {
                add: 'Add',
                remove: 'Remove',
                create: 'Create',
                edit: 'Edit',
                delete: 'Delete'
            },
            DEFAULT_COMMANDS
        };
    }

    static async getGroupOriginalValue (original, behavior) {
        // find group among current class groups by name of ancestor class group
        const query = original.relGroup();
        const name = await query.scalar('name');
        const id = behavior.owner.get('class');
        return query.model.find({name}).and({class: id}).id();
    }

    isFile () {
        return this.get('type') === 'file';
    }

    isInteger () {
        return this.get('type') === 'integer';
    }

    isRelation () {
        return this.isRef() || this.isBackRef();
    }

    isRef () {
        return this.get('type') === 'ref';
    }

    isBackRef () {
        return this.get('type') === 'backref';
    }

    canIndexing () {
        const type = this.get('type');
        return !(type === 'backref' || type === 'file' || (type === 'ref' && this.get('multiple')));
    }

    findByClassAndGroup (classId, groupId) {
        return this.find({
            class: classId,
            group: groupId
        });
    }

    findForSelect (id) {
        return super.findForSelect(['ID', 'class', id]);
    }

    findForSelectByClassKeys (id) {
        return this.findForSelect(id).and({type: ['string', 'integer']});
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf({scenario: 'clone'});
        model.getBehavior('clone').setOriginal(this);
        model.set('class', owner.getId());
        model.detachBehavior('ancestor');
        return model.forceSave();
    }

    getRelinkMap (key, value) {
        return super.getRelinkMap(this.find({'class': key}), this.find({'class': value}), 'name');
    }

    relinkClassAttrs (data) {
        this.set('linkAttr', data[this.get('linkAttr')]);
        this.detachBehavior('ancestor');
        return this.forceSave();
    }

    relinkClassGroups (data) {
        this.set('group', data[this.get('group')]);
        this.detachBehavior('ancestor');
        return this.forceSave();
    }

    // INHERIT

    hasOriginal () {
        return !!this.get('original');
    }

    inherit (classId) {
        const model = this.spawnSelf();
        model.setAttrs(this, [this.PK, 'overriddenState']);
        model.set('class', classId);
        model.set('original', this.getId());
        return model.forceSave();
    }

    // VALIDATE

    validateSystemAttr (attr) {
        if (/^_/.test(this.get(attr)) && !this.get('readOnly')) {
            this.addError(attr, 'System attribute must be read only');
        }
    }

    // RELATIONS

    relActionBinder () {
        const Class = this.getClass('model/ActionBinder');
        return this.hasOne(Class, Class.PK, 'actionBinder').deleteOnUnlink();
    }

    relBehaviors () {
        const Class = this.getClass('model/AttrBehavior');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1}).deleteOnUnlink();
    }

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class');
    }

    relClassIndexAttr () {
        const Class = this.getClass('model/ClassIndexAttr');
        return this.hasMany(Class, 'attr', this.PK).deleteOnUnlink();
    }

    relDescendants () {
        return this.hasMany(this.constructor, 'original', this.PK).deleteOnUnlink();
    }

    relEagerView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'eagerView');
    }

    relEnums () {
        const Class = this.getClass('model/Enum');
        return this.hasMany(Class, 'owner', this.PK).with('attr', 'class', 'view').deleteOnUnlink();
    }

    relGroup () {
        const Class = this.getClass('model/ClassGroup');
        return this.hasOne(Class, Class.PK, 'group');
    }

    relLinkAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'linkAttr');
    }

    relListView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'listView');
    }

    relOriginal () {
        return this.hasOne(this.constructor, this.PK, 'original');
    }

    relRefAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'refAttr');
    }

    relRefClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'refClass');
    }

    relRules () {
        const Class = this.getClass('model/AttrRule');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1}).deleteOnUnlink();
    }

    relSelectListView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'selectListView');
    }

    relTreeViewLevels () {
        const Class = this.getClass('model/TreeViewLevel');
        return this.hasMany(Class, 'refAttr', this.PK).deleteOnUnlink();
    }

    relVia () {
        const Class = this.getClass('model/Via');
        return this.hasOne(Class, 'attr', this.PK).deleteOnUnlink();
    }

    relViewAttrs () {
        const Class = this.getClass('model/ViewAttr');
        return this.hasMany(Class, 'classAttr', this.PK).deleteOnUnlink();
    }

    relViews () {
        const Class = this.getClass('model/View');
        return this.hasMany(Class, Class.PK, 'view').via('viewAttrs');
    }
};
module.exports.init(module);