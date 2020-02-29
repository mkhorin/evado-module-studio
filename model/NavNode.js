/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class NavNode extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_navNode',
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
                'options'
            ],
            RULES: [
                ['name', 'required'],
                [['section', 'parent', 'class', 'view', 'report'], 'id'],
                [['label', 'description', 'url'], 'string'],
                ['name', require('../component/validator/CodeNameValidator')],
                ['name', 'unique', {filter: 'section'}],
                ['orderNumber', 'number', {integerOnly: true}],
                ['orderNumber', 'default', {
                    value: (attr, model) => model.getBehavior('sortOrder').getNextNumber()
                }],
                ['parent', 'default', {value: null}],
                ['children', 'relation'],
                ['options', 'json']
            ],
            BEHAVIORS: {
                'clone': {
                    Class: require('evado/component/behavior/CloneBehavior'),
                    relations: ['children']
                },
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
                    filter: (query, model) => model.setParentFilter(query)
                }
            },
            UNLINK_ON_DELETE: [
                'children'
            ],
            ATTR_LABELS: {
                'name': 'Code name',
                'parent': 'Parent node',
                'url': 'URL'
            }

        };
    }

    async getMap () {
        const models = await this.find().with('class', 'view', 'report').all();
        return {
            byId: IndexHelper.indexModels(models, this.PK),
            bySection: IndexHelper.indexModelArrays(models, 'section')
        };
    }

    getParentQuery () {
        return this.spawn('other/HierarchySolver', {model: this})
            .getParentQuery({section: this.get('section')});
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
        if (owner instanceof this.getClass('model/NavSection')) {
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
        this.set('parent', this.getDb().normalizeId(this.get('parent')));
        const model = await this.resolveRelation('parent');
        if (model) {
            this.set('section', model.get('section'));
        }
    }

    // RELATIONS

    relChildren () {
        const Class = this.getClass('model/NavNode');
        return this.hasMany(Class, 'parent', this.PK).deleteOnUnlink();
    }

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class');
    }

    relParent () {
        const Class = this.getClass('model/NavNode');
        return this.hasOne(Class, Class.PK, 'parent');
    }

    relReport () {
        const Class = this.getClass('model/Report');
        return this.hasOne(Class, Class.PK, 'report');
    }

    relSection () {
        const Class = this.getClass('model/NavSection');
        return this.hasOne(Class, Class.PK, 'section');
    }

    relView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'view');
    }
};
module.exports.init(module);

const IndexHelper = require('areto/helper/IndexHelper');