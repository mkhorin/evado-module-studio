/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassGroups extends Base {

    prepareModels (models) {
        const ClassGroup = this.getClass('model/ClassGroup');
        const typeMap = ClassGroup.getAttrValueLabels('type');
        for (const model of models) {

            model.setRelatedViewAttr('parent');
            model.setAttrValueLabel('type', typeMap);
            model.setViewAttr('active', this.format(model.get('active'), 'boolean'));

            if (!model.hasOriginal()) {
                model.setViewAttr('inherited', '');
                continue;
            }
            const states = model.getBehavior('overridden').getStates();
            if (states.label !== true) {
                model.setViewAttr('label', this.format(model.get('label'), 'inherited'));
            }
            if (states.type !== true) {
                model.setViewAttr('type', this.format(model.getViewAttr('type'), 'inherited'));
            }
            if (states.active !== true) {
                model.setViewAttr('active', this.format(model.getViewAttr('active'), 'inherited'));
            }
            if (states.orderNumber !== true) {
                model.setViewAttr('orderNumber', this.format(model.get('orderNumber'), 'inherited'));
            }
            if (states.parent !== true) {
                model.setViewAttr('parent', this.format(model.getViewAttr('parent'), 'inherited'));
            }
            model.setViewAttr('inherited', 'Yes');
        }
    }
};