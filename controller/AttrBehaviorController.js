/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./AttrRuleController');

module.exports = class AttrBehaviorController extends Base {
    
    getModelClass () {
        return this.getClass('model/AttrBehavior');
    }
};
module.exports.init(module);