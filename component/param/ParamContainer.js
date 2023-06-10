/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../base/BaseActiveRecord');

module.exports = class ParamContainer extends Base {

    static getConstants () {
        return {
            ATTRS: [
                'type',
                'owner',
                'orderNumber',
                'description'
            ],
            RULES: [
                ['type', 'required'],
                [['type', 'description'], 'string'],
                ['orderNumber', 'integer'],
                ['orderNumber', 'default', {
                    value: (attr, model) => model.getBehavior('sortOrder').getNextNumber()
                }]
            ],
            BEHAVIORS: {
                'paramContainer': require('evado/component/behavior/ParamContainerBehavior'),
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
                    filter: (query, model) => query.and({owner: model.get('owner')})
                },
                'unsetOwner': require('evado/component/behavior/UnsetChangedAttrBehavior')
            },
            DELETE_ON_UNLINK: [
                'param'
            ],
            ATTR_LABELS: {
                attrs: 'Attributes',
                param: 'Configuration'
            },
            PARAM_MAP: {}
        };
    }

    hasParam (key) {
        return Object.hasOwn(this.PARAM_MAP, key);
    }

    getParamModel () {
        return this.getBehavior('paramContainer').getParamModel();
    }

    getParamModelMap () {
        return this.getBehavior('paramContainer').getParamModelMap();
    }

    async cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('owner', owner.getId());
        model.detachRelationChangeBehavior();
        await model.forceSave();
        const param = await this.resolveRelation('param');
        if (param) {
            await param.cloneFor(model);
        }
    }

    async relinkClassAttrs (classAttrMap) {
        const param = await this.resolveRelation('param');
        return param?.relinkClassAttrs(classAttrMap);
    }

    // RELATIONS

    relParam () {
        const Class = this.getBehavior('paramContainer').getParamClass();
        return Class
            ? this.hasOne(Class, 'owner', this.PK)
            : false;
    }
};
module.exports.init();