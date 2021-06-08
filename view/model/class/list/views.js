/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassViews extends Base {

    prepareModels (models) {
        const model = this.data.model;
        for (const model of models) {
            model.setViewAttr('inherited', model.hasOriginal() ? 'Yes' : '');
        }
    }
};