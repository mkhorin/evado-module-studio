/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class Section extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_section',
            ATTRS: [
                'name',
                'label',
                'description'
            ],
            RULES: [
                ['name', 'required'],
                ['name', {
                    Class: require('../component/validator/CodeNameValidator'),
                    validFilename: true
                }],
                ['name', 'unique'],
                [['label', 'description'], 'string'],
                ['nodes', 'relation']
            ],
            BEHAVIORS: {
                'clone': {
                    Class: require('evado/component/behavior/CloneBehavior'),
                    relations: ['nodes']
                }
            },
            DELETE_ON_UNLINK: [
                'nodes'
            ],
            ATTR_LABELS: {
                name: 'Code name'
            }
        };
    }

    getTitle () {
        return this.getFullTitle();
    }

    // CLONE

    cloneFor () {
        const model = this.spawnSelf();
        model.getBehavior('clone').setOriginal(this);
        return model.forceSave();
    }

    // RELATIONS

    relNodes () {
        const Class = this.getClass('model/Node');
        return this.hasMany(Class, 'section', this.PK).and({parent: null}).order({orderNumber: 1});
    }
};
module.exports.init(module);
