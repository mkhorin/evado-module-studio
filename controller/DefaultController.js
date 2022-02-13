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
                'dropAll': 'post',
                'reload': 'post'
            }
        };
    }

    actionIndex () {
        return this.render('index');
    }

    async actionDropAll () {
        this.checkCsrfToken();
        await this.module.dropAll();
        this.send('Metadata deleted');
    }

    async actionReload () {
        this.checkCsrfToken();
        const meta = this.module.getMetaHub();
        await meta.reload();
        await this.render('reload', {
            message: this.translate('Metadata reloaded'),
            errors: meta.logger.errors
        });
    }
};
module.exports.init(module);