/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class Node extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_node',
            ATTRS: [
                'section',
                'parent',
                'name',
                'label',
                'description',
                'orderNumber',
                'class',
                'view',
                'report',
                'url',
                'options',
                'type'
            ],
            RULES: [
                ['name', 'required'],
                [['section', 'parent', 'class', 'view', 'report'], 'id'],
                [['label', 'description', 'type', 'url'], 'string'],
                ['name', CodeNameValidator],
                ['name', 'unique', {filter: 'section'}],
                ['type', 'default', {value: ''}],
                ['orderNumber', 'integer'],
                ['orderNumber', 'default', {
                    value: (attr, model) => model.getBehavior('sortOrder').getNextNumber()
                }],
                ['parent', 'default', {value: null}],
                ['children', 'relation'],
                ['options', 'json']
            ],
            BEHAVIORS: {
                'clone': {
                    Class: CloneBehavior,
                    relations: ['children']
                },
                'sortOrder': {
                    Class: SortOrderBehavior,
                    filter: (query, model) => model.setParentFilter(query)
                }
            },
            DELETE_ON_UNLINK: [
                'children'
            ],
            ATTR_LABELS: {
                name: 'Code name',
                parent: 'Parent node',
                url: 'URL'
            },
            ATTR_VALUE_LABELS: {
                'type': {
                    '': 'Node',
                    'container': 'Container',
                    'divider': 'Divider',
                    'header': 'Header'
                }
            }
        };
    }

    getTitle () {
        return this.getFullTitle();
    }

    async getMap () {
        const models = await this.createQuery().with('class', 'view', 'report').all();
        const byId = IndexHelper.indexModels(models, this.PK);
        const bySection = IndexHelper.indexModelArrays(models, 'section');
        return {byId, bySection};
    }

    getParentQuery () {
        const solver = this.spawn('misc/HierarchySolver', {model: this});
        const section = this.get('section');
        return solver.getParentQuery({section});
    }

    setParentFilter (query) {
        return query.and({
            section: this.get('section'),
            parent: this.get('parent')
        });
    }

    async setSectionByParent () {
        const parent = await this.resolveRelation('parent');
        if (parent) {
            this.set('section', parent.get('section'));
        }
    }

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.getBehavior('clone').setOriginal(this);
        if (owner instanceof this.getClass('model/Section')) {
            model.set('section', owner.getId());
        } else {
            model.set('section', owner.get('section'));
            model.set('parent', owner.getId());
        }
        return model.forceSave();
    }

    // EVENTS

    async beforeValidate () {
        await super.beforeValidate();
        const parent = this.get('parent');
        this.set('parent', this.getDb().normalizeId(parent));
        const model = await this.resolveRelation('parent');
        if (model) {
            this.set('section', model.get('section'));
        }
    }

    // RELATIONS

    relChildren () {
        const Class = this.getClass('model/Node');
        return this.hasMany(Class, 'parent', this.PK);
    }

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class');
    }

    relParent () {
        const Class = this.getClass('model/Node');
        return this.hasOne(Class, Class.PK, 'parent');
    }

    relReport () {
        const Class = this.getClass('model/Report');
        return this.hasOne(Class, Class.PK, 'report');
    }

    relSection () {
        const Class = this.getClass('model/Section');
        return this.hasOne(Class, Class.PK, 'section');
    }

    relView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'view');
    }
};

const CodeNameValidator = require('../component/validator/CodeNameValidator');
const CloneBehavior = require('evado/component/behavior/CloneBehavior');
const IndexHelper = require('areto/helper/IndexHelper');
const SortOrderBehavior = require('areto/behavior/SortOrderBehavior');

module.exports.init(module);