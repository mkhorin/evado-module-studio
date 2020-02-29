/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./AttrRuleController');

module.exports = class ClassRuleController extends Base {

    getModelClass () {
        return this.getClass('model/ClassRule');
    }
};
module.exports.init(module);