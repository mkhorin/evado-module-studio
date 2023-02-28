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
                ['orderNumber', 'integer'],
                ['name', AttrNameValidator],
                ['name', 'unique', {filter: 'report'}],
                ['type', 'default', {value: 'string'}],
                ['indexing', 'integer'],
                ['indexing', 'range', {values: [-1, 1]}],
                ['sortable', 'checkbox'],
                ['options', 'json'],
                ['viewType', 'safe']
            ],
            BEHAVIORS: {
                'clone': {
                    Class: CloneBehavior,
                    relations: []
                },
                'sortOrder': {
                    Class: SortOrderBehavior,
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
        switch (type) {
            case 'backref':
            case 'file': {
                return false;
            }
            case 'ref': {
                return !this.get('multiple');
            }
        }
        return true;
    }

    getTitle () {
        return this.getFullTitle();
    }

    findByReport (id) {
        return this.find(['id', 'report', id]);
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

const AttrNameValidator = require('../component/validator/AttrNameValidator');
const CloneBehavior = require('evado/component/behavior/CloneBehavior');
const SortOrderBehavior = require('areto/behavior/SortOrderBehavior');

module.exports.init(module);