/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ClassIndexController extends Base {

    getModelClass () {
        return this.getClass('model/ClassIndex');
    }

    actionCreate () {
        const model = this.createModel();
        const {pid} = this.getQueryParams();
        model.set('class', model.getDb().normalizeId(pid));
        return super.actionCreate({model});
    }

    actionListRelated () {
        return super.actionListRelated({
            with: 'attr'
        });
    }
};
module.exports.init(module);