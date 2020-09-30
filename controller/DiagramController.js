/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseController');

module.exports = class DiagramController extends Base {

    async actionClasses () {
        const classes = await this.spawn('model/Class').find().raw().all();
        return this.render('classes', {classes});
    }
};
module.exports.init(module);