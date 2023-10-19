/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class AssignedValueParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'expression',
                'onCreate',
                'onUpdate'
            ],
            RULES: [
                ['expression', 'required'],
                ['expression', 'json'],
                [['onCreate', 'onUpdate'], 'checkbox'],
                ['onCreate', 'default', {value: true}]
            ],
            ATTR_LABELS: {
                expression: 'Calculated expression'
            }
        };
    }
};
module.exports.init(module);