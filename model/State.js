/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class State extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_state',
            ATTRS: [
                'name',
                'label',
                'defaults',
                'description',
                'class',
                'view',
                'readOnly',
                'options'
            ],
            RULES: [
                [['name', 'class'], 'required'],
                [['class', 'view'], 'id'],
                [['label', 'description'], 'string'],
                ['name', require('../component/validator/CodeNameValidator')],
                [['name', 'label'], 'unique', {filter: 'class'}],
                [['defaults', 'readOnly'], 'checkbox'],
                ['options', 'json'],
                ['defaults', 'unique', {
                    when: (model, attr) => model.get(attr), // true value
                    filter: 'class'
                }]
            ],
            UNLINK_ON_DELETE: [
                'startingTransitions'
            ],
            ATTR_LABELS: {
                name: 'Code name',
                readOnly: 'Read-only mode'
            }
        };
    }

    getTitle () {
        return this.getFullTitle();
    }

    findForSelect (id) {
        return super.findForSelect(['id', 'class', id]);
    }

    // CLONE

    async cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('class', owner.getId());
        const id = this.get('view');
        if (id) {
            const name = await this.relView().scalar('name');
            model.set('view', await owner.relViews().and({name}).id());
        }
        return model.forceSave();
    }

    // RELATIONS

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class');
    }

    relFinishingTransitions () {
        const Class = this.getClass('model/Transition');
        return this.hasMany(Class, 'finalState', this.PK);
    }

    relStartingTransitions () {
        const Class = this.getClass('model/Transition');
        return this.hasMany(Class, 'startStates', this.PK).viaArray();
    }

    relView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'view');
    }
};
module.exports.init(module);