/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class Workflow extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_workflow',
            ATTRS: [
                'name',
                'label',
                'description'
            ],
            RULES: [
                ['name', 'required'],
                ['name', require('../component/validator/CodeNameValidator')],
                [['label', 'description'], 'string'],
                [['name', 'label'], 'unique'],
                [['states', 'transitions'], 'relation'],
            ],
            DELETE_ON_UNLINK: [
                'states',
                'transitions'
            ]
        };
    }

    // RELATIONS

    relStates () {
        const Class = this.getClass('model/State');
        return this.hasMany(Class, 'workflow', this.PK);
    }

    relTransitions () {
        const Class = this.getClass('model/Transition');
        return this.hasMany(Class, 'workflow', this.PK).order({orderNumber: 1});
    }
};
module.exports.init(module);