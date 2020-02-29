/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./AttrRuleController');

module.exports = class ViewAttrBehaviorController extends Base {

    getModelClass () {
        return this.getClass('model/ViewAttrBehavior');
    }
};
module.exports.init(module);