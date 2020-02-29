/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./AttrRuleController');

module.exports = class ClassBehaviorController extends Base {

    getModelClass () {
        return this.getClass('model/ClassBehavior');
    }
};
module.exports.init(module);