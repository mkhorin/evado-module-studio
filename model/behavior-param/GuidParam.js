/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class GuidParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
            ]),
            RULES: [
            ]
        };
    }
};
module.exports.init(module);