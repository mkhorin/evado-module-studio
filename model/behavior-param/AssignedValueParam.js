/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class AssignedValueParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'expression',
                'onCreate',
                'onUpdate'
            ]),
            RULES: [
                ['expression', 'required'],
                ['expression', 'json'],
                [['onCreate', 'onUpdate'], 'checkbox'],
                ['onCreate', 'default', {value: true}]
            ]
        };
    }
};
module.exports.init(module);