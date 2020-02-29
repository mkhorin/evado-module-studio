/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class ClassIndexAttr extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_classIndexAttr',
            ATTRS: [
                'index',
                'attr',
                'direction'
            ],
            RULES: [
                [['index', 'attr', 'direction'], 'required'],
                [['index', 'attr'], 'id'],
                ['attr', 'unique', {filter: 'index'}],
                ['direction', 'number'],
                ['direction', 'range', {range: [-1, 1]}]
            ],
            ATTR_LABELS: {
                'attr': 'Attribute'
            }
        };
    }

    // CLONE

    cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('index', owner.getId());
        return model.forceSave();
    }

    relinkClassAttrs (data) {
        this.set('attr', data[this.get('attr')]);
        return this.forceSave();
    }

    // RELATIONS

    relAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'attr');
    }

    relIndex () {
        const Class = this.getClass('model/ClassIndex');
        return this.hasOne(Class, Class.PK, 'index');
    }
};
module.exports.init(module);