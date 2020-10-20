/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class EnumController extends Base {

    getModelClass () {
        return this.getClass('model/Enum');
    }

    actionUpdate () {
        return super.actionUpdate({
            with: ['attr', 'class', 'owner', 'view']
        });
    }
};
module.exports.init(module);