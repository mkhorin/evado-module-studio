/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ReportIndexes extends Base {

    prepareModels (models) {
        for (const model of models) {
            model.setViewAttr('attrs', model.get('attrs.attr.name').join('<br>'));
        }
    }
};