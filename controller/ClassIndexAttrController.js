/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ClassIndexAttrController extends Base {

    getModelClass () {
        return this.getClass('model/ClassIndexAttr');
    }

    actionCreate () {
        const model = this.createModel();
        const {pid} = this.getQueryParams();
        model.set('index', model.getDb().normalizeId(pid));
        return super.actionCreate({model});
    }
};
module.exports.init(module);