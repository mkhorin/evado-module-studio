/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class UniqueParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'filter',
                'ignoreCase'
            ]),
            RULES: [
                ['filter', 'json'],
                ['ignoreCase', 'checkbox']
            ]
        };
    }
};
module.exports.init(module);