/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class Via extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_via',
            ATTRS: [
                'attr',
                'parent',
                'refClass',
                'refAttr',
                'linkAttr'
            ],
            RULES: [
                [['refClass'], 'required'],
                [['attr', 'refClass', 'refAttr', 'linkAttr'], 'id'],
                ['via', 'relation']
            ],
            UNLINK_ON_DELETE: [
                'via'
            ],
            ATTR_LABELS: {
                'refClass': 'Reference class',
                'refAttr': 'Reference attribute',
                'linkAttr': 'Link attribute',
                'via': 'Intermediate link'
            }
        };
    }

    async getMap () {
        const models = await this.find().with({
            refClass: query => query.raw(),
            refAttr: query => query.raw(),
            linkAttr: query => query.raw()
        }).all();
        return {
            'byParent': IndexHelper.indexModels(models, 'parent'),
            'byAttr': IndexHelper.indexModels(models, 'attr')
        }; 
    }

    // CLONE

    async cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('attr', owner.getId());
        return this.saveCloned(model);
    }

    async cloneForParent (parent) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('parent', parent.getId());
        return this.saveCloned(model);
    }

    async saveCloned (model) {
        await model.forceSave();
        const via = await this.resolveRelation('via');
        return via ? via.cloneForParent(model) : null;
    }

    // RELATIONS

    relAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'attr');
    }

    relLinkAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'linkAttr');
    }

    relParent () {
        const Class = this.getClass('model/Via');
        return this.hasOne(Class, Class.PK, 'parent');
    }

    relRefAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'refAttr');
    }

    relRefClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'refClass');
    }

    relVia () {
        const Class = this.getClass('model/Via');
        return this.hasOne(Class, 'parent', this.PK).deleteOnUnlink();
    }
};
module.exports.init(module);

const IndexHelper = require('areto/helper/IndexHelper');