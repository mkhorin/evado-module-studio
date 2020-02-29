/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./AttrRuleController');

module.exports = class ViewBehaviorController extends Base {

    getModelClass () {
        return this.getClass('model/ViewBehavior');
    }
};
module.exports.init(module);