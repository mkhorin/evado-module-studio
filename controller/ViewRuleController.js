/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./AttrRuleController');

module.exports = class ViewRuleController extends Base {

    getModelClass () {
        return this.getClass('model/ViewRule');
    }
};
module.exports.init(module);