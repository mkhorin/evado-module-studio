/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class ReportGroup extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_reportGroup',
            ATTRS: [
                'name',
                'label',
                'parent',
                'report',
                'orderNumber',
                'options'
            ],
            RULES: [
                ['name', 'required'],
                ['name', require('../component/validator/CodeNameValidator')],
                ['name', 'unique', {filter: 'report'}],
                ['label', 'string'],
                ['parent', 'id'],
                ['orderNumber', 'integer'],
                ['options', 'json'],
                ['children', 'relation']
            ],
            BEHAVIORS: {
                'clone': {
                    Class: require('evado/component/behavior/CloneBehavior')
                },
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
                    start: 1000,
                    filter: 'report'
                }
            },
            UNLINK_ON_DELETE: [
                'children',
                'reportAttrs'
            ],
            ATTR_LABELS: {
                name: 'Code name'
            }
        };
    }

    getTitle () {
        return this.getFullTitle();
    }

    findForSelect (id) {
        return super.findForSelect(['id', 'report', id]);
    }

    getRelinkMap (key, value) {
        return super.getRelinkMap(this.find({report: key}), this.find({report: value}), 'name');
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf({scenario: 'create'});
        model.getBehavior('clone').setOriginal(this);
        model.set('report', owner.getId());
        return model.forceSave();
    }

    relinkReportGroups (data) {
        this.set('parent', data[this.get('parent')]);
        return this.forceSave();
    }

    // INHERIT

    getParentQuery () {
        return this.spawn('misc/HierarchySolver', {model: this})
            .getParentQuery({report: this.get('report')});
    }

    // RELATIONS

    relChildren () {
        const Class = this.getClass('model/ReportGroup');
        return this.hasMany(Class, 'parent', this.PK);
    }

    relParent () {
        const Class = this.getClass('model/ReportGroup');
        return this.hasOne(Class, Class.PK, 'parent');
    }

    relReport () {
        const Class = this.getClass('model/Report');
        return this.hasOne(Class, Class.PK, 'report');
    }

    relReportAttrs () {
        const Class = this.getClass('model/ReportAttr');
        return this.hasMany(Class, 'group', this.PK);
    }
};
module.exports.init(module);