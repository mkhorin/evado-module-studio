/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class Transition extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_transition',
            ATTRS: [
                'name',
                'label',
                'description',
                'hint',
                'class',
                'nullStartState',
                'startStates',
                'finalState',
                'condition',
                'options',
                'orderNumber',
                'config'
            ],
            RULES: [
                [['name', 'class'], 'required'],
                [['class', 'finalState'], 'id'],
                [['label', 'description', 'hint'], 'string'],
                ['name', require('../component/validator/CodeNameValidator')],
                ['name', 'unique', {filter: 'class'}],
                [['condition', 'options'], 'json'],
                ['config', 'spawn', {BaseClass: require('evado-meta-base/workflow/Transit')}],
                ['orderNumber', 'integer'],
                ['orderNumber', 'default', {
                    value: (attr, model) => model.getBehavior('sortOrder').getNextNumber()
                }],
                ['nullStartState', 'checkbox'],
                ['startStates', 'relation'],

            ],
            BEHAVIORS: {
                'sortOrder': {
                    Class: require('areto/behavior/SortOrderBehavior'),
                    filter: 'class'
                }
            },
            ATTR_LABELS: {
                config: 'Transit configuration',
                name: 'Code name'
            }
        };
    }

    getTitle () {
        return this.getFullTitle();
    }

    // CLONE

    async cloneFor (owner) {
        const model = this.spawnSelf();
        model.setAttrs(this, this.PK);
        model.set('class', owner.getId());

        const stateMap = await owner.relStates().index('name').all();
        const name = await this.relFinalState().scalar('name');
        const value = name ? stateMap[name].getId() : null;
        model.set('finalState', value);

        const names = await this.relStartStates().column('name');
        const links = names.map(name => stateMap[name].getId());
        model.set('startStates', {links});
        return model.forceSave();
    }

    // RELATIONS

    relClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'class');
    }

    relFinalState () {
        const Class = this.getClass('model/State');
        return this.hasOne(Class, Class.PK, 'finalState');
    }

    relStartStates () {
        const Class = this.getClass('model/State');
        return this.hasMany(Class, Class.PK, 'startStates').viaArray();
    }
};
module.exports.init(module);