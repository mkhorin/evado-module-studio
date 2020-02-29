/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ReportController extends Base {

    getModelClass () {
        return this.getClass('model/Report');
    }

    actionListRelated (params = {}) {
        let relations;
        switch (this.getQueryParam('rel')) {
            case 'attrs': relations = 'group'; break;
            case 'indexes': relations = 'attrs'; break;
        }
        params.with = relations;
        return super.actionListRelated(params);
    }
};
module.exports.init(module);