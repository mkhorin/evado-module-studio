/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class ActionBinder extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_actionBinder',
            ATTRS: [
                'description',
                'enable',
                'require',
                'show',
                'value'
            ],
            RULES: [
                ['description', 'string'],
                [['enable', 'require', 'show', 'value'], 'json']
            ]
        };
    }
};
module.exports.init(module);