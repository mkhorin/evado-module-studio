/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class ExpressionParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'expression'
            ]),
            RULES: [
                ['expression', 'json']
            ]
        };
    }
};
module.exports.init(module);