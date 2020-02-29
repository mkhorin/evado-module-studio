/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseController');

module.exports = class DefaultController extends Base {

    static getConstants () {
        return {
            ACTIONS: {                
                'widget': require('evado/component/action/WidgetAction')
            },
            METHODS: {
                'drop-all': 'post',
                'reload': 'post'
            }
        };
    }

    actionIndex () {
        return this.render('index');
    }

    async actionDropAll () {
        await this.module.dropAll();
        this.send('Metadata deleted');
    }

    async actionReload () {
        await this.module.getMetaHub().reload();
        this.send('Application metadata reloaded');
    }
};
module.exports.init(module);