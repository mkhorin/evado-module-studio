/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewAttrSort extends Base {

    resolveTemplateData () {
        for (const model of this.data.models) {
            model.setViewAttr('classAttr', model.get('classAttr.name'));
        }
        return this.data;
    }
};