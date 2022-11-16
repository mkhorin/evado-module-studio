/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class EnumItemController extends Base {

    getModelClass () {
        return this.getClass('model/EnumItem');
    }

    async actionCreate () {
        const model = this.createModel();
        const {pid: id} = this.getQueryParams();
        if (id) {
            const Class = this.getClass('model/Enum');
            const owner = await this.getModel({Class, id});
            model.set('enum', owner.getId());
        }
        return super.actionCreate({model});
    }
};
module.exports.init(module);