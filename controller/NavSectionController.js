/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class NavSectionController extends Base {

    getModelClass () {
        return this.getClass('model/NavSection');
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'nodes':
                return ['class', 'view', 'report'];
        }
    }
};
module.exports.init(module);