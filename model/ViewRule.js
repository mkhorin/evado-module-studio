/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ClassRule');

module.exports = class ViewRule extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_viewRule'
        };
    }

    relOwner () {
        const View = this.getClass('model/View');
        return this.hasOne(View, View.PK, 'owner');
    }
};
module.exports.init(module);