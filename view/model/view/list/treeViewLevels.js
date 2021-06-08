/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewTreeViewLevels extends Base {

    prepareModels (models) {
        for (const model of models) {
            const attr = model.rel('refAttr');
            if (attr) {
                model.setViewAttr('refAttr', attr.get('name'));
                model.setViewAttr('refClass', this.getRefClassValue(attr));
            }
        }
    }

    getRefClassValue (attr) {
        const refClass = attr.rel('refClass') || attr.rel('original.refClass');
        if (refClass) {
            const url = this.controller.createUrl(['class/update', {id: refClass.getId()}]);
            return this.controller.format(url, 'frameLink', {text: refClass.getTitle()});
        }
    }
};