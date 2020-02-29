/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class NavSectionController extends Base {

    getModelClass () {
        return this.getClass('model/NavSection');
    }

    actionListRelated (params = {}) {
        switch (this.getQueryParam('rel')) {
            case 'nodes': params.with = ['class', 'view', 'report']; break;
        }
        return super.actionListRelated(params);
    }
};
module.exports.init(module);