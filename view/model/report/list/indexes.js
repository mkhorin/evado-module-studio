/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ReportIndexes extends Base {

    prepareModels (models) {
        for (const model of models) {
            const names = model.get('attrs.attr.name');
            model.setViewAttr('attrs', names.join('<br>'));
        }
    }
};