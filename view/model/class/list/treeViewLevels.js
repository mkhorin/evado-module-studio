/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassTreeViewLevels extends Base {

    prepareModels (models) {
        for (const model of models) {
            const attr = model.rel('refAttr');
            if (attr) {
                //model.setViewAttr('refAttr', attr.get('name'));
                model.setViewAttr('refClass', this.getRefClassValue(attr));
            }
        }
    }

    getRefClassValue (attr) {
        const refClass = attr.rel('refClass') || attr.rel('original.refClass');
        if (refClass) {
            const id = refClass.getId();
            const url = this.controller.createUrl(['class/update', {id}]);
            const text = refClass.getTitle();
            return this.controller.format(url, 'frameLink', {text});
        }
    }
};