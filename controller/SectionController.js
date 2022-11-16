/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class SectionController extends Base {

    getModelClass () {
        return this.getClass('model/Section');
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'nodes': {
                return ['class', 'view', 'report'];
            }
        }
    }
};
module.exports.init(module);