/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ReportController extends Base {

    getModelClass () {
        return this.getClass('model/Report');
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'attrs': return 'group';
            case 'indexes': return 'attrs';
        }
    }
};
module.exports.init(module);