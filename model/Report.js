/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class Report extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_report',
            ATTRS: [
                'name',
                'label',
                'description',
                'order',
                'minerConfig'
            ],
            RULES: [
                [['name', 'minerConfig'], 'required'],
                ['name', {
                    Class: require('../component/validator/CodeNameValidator'),
                    validFilename: true
                }],
                ['name', 'unique'],
                [['label', 'description'], 'string'],
                [['order', 'minerConfig'], 'json'],
                ['minerConfig', 'spawn', {BaseClass: 'evado-meta-report/base/BaseMiner'}],
                [['attrs', 'groups'], 'relation', {on: 'update'}],
            ],
            BEHAVIORS: {
                'clone': {
                    Class: require('evado/component/behavior/CloneBehavior'),
                    relations: ['attrs', 'groups']
                }
            },
            DELETE_ON_UNLINK: [
                'attrs',
                'behaviors',
                'groups',
                'indexes',
                'nodes'
            ],
            ATTR_LABELS: {
                minerConfig: 'Miner configuration',
                name: 'Code name',
                order: 'Sort order'
            }
        };
    }

    getTitle () {
        return this.getFullTitle();
    }

    static async filterInheritedChanges (changes, model, attr) {
        model = model.getRelation(attr).model;
        changes.deletes = await model.findById(changes.deletes).and({original: null}).column(model.PK);
        return PromiseHelper.setImmediate();
    }

    async setAttrMapByName () {
        this.set('attrMapByName', await this.relAttrs().index('name').all());
    }

    // CLONE

    afterClone (original) {
        return this.relinkAttrs(original);
    }

    async relinkAttrs (original) {
        const attr = this.spawn('model/ReportAttr');
        const data = await attr.getRelinkMap(original.getId(), this.getId());
        return this.handleEachRelatedModel([], model => model.relinkReportAttrs(data));
    }

    // RELATIONS

    relAttrMap () {
        const Class = this.getClass('model/ReportAttr');
        return this.hasMany(Class, 'report', this.PK).index('name');
    }

    relAttrs () {
        const Class = this.getClass('model/ReportAttr');
        return this.hasMany(Class, 'report', this.PK).order({orderNumber: 1});
    }

    relBehaviors () {
        const Class = this.getClass('model/ReportBehavior');
        return this.hasMany(Class, 'owner', this.PK).order({orderNumber: 1});
    }

    relGroups () {
        const Class = this.getClass('model/ReportGroup');
        return this.hasMany(Class, 'report', this.PK).order({orderNumber: 1}).with('parent');
    }

    relIndexes () {
        const Class = this.getClass('model/ReportIndex');
        return this.hasMany(Class, 'report', this.PK);
    }

    relNodes () {
        const Class = this.getClass('model/Node');
        return this.hasMany(Class, 'report', this.PK);
    }
};
module.exports.init(module);

const PromiseHelper = require('areto/helper/PromiseHelper');