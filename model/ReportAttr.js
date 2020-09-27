/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class ReportAttr extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_reportAttr',
            ATTRS: [
                'label',
                'report',
                'description',
                'indexing',
                'name',
                'options',
                'orderNumber',
                'sortable',
                'type',
                'viewType'
            ],
            RULES: [
                [['name', 'type'], 'required'],
                ['report', 'id', {on: 'create'}],
                [['label', 'description'], 'string'],
                ['orderNumber', 'number', {integerOnly: true}],
                ['name', require('../component/validator/AttrNameValidator')],
                ['name', 'unique', {filter: 'report'}],
                ['type', 'default', {value: 'string'}],
                ['indexing', 'number'],
                ['indexing', 'range', {range:[-1, 1]}],
                ['sortable', 'checkbox'],
                ['options', 'json'],
                ['viewType', 'safe']
            ],
            BEHAVIORS: {
                'clone': {
                    Class: require('evado/component/behavior/CloneBehavior'),
                    relations: []
                },
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
                    filter: 'class'
                }
            },
            UNLINK_ON_DELETE: [
            ],
            ATTR_LABELS: {
                name: 'Code name'
            },
            ATTR_VALUE_LABELS: {
                'type': {
                    boolean: 'Boolean',
                    calc: 'Calc',
                    date: 'Date',
                    float: 'Float',
                    id: 'ID',
                    integer: 'Integer',
                    string: 'String',                    
                    user: 'User'
                }
            }
        };
    }

    isFile () {
        return this.get('type') === 'file';
    }

    canIndexing () {
        const type = this.get('type');
        return !(type === 'backref' || type === 'file' || (type === 'ref' && this.get('multiple')));
    }

    getTitle () {
        return this.getFullTitle();
    }

    findByReport (id) {
        return this.find(['ID', 'report', id]);
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf({scenario: 'create'});
        model.getBehavior('clone').setOriginal(this);
        model.set('report', owner.getId());
        return model.forceSave();
    }

    // RELATIONS

    relReport () {
        const Class = this.getClass('model/Report');
        return this.hasOne(Class, Class.PK, 'report');
    }
};
module.exports.init(module);