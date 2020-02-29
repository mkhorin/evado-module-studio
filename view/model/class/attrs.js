/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassAttrs extends Base {

    prepareModels (models) {
        const ClassAttr = this.getClass('model/ClassAttr');
        const viewTypeMap = ClassAttr.getAttrValueLabels('viewType');
        for (const model of models) {
            if (model.hasOriginal()) {
                const states = model.getBehavior('overridden').getStates();
                if (states.group !== true) {
                    model.setViewAttr('group', this.format(model.get('group.name'), 'inherited'));
                }
                if (states.label !== true) {
                    model.setViewAttr('label', this.format(model.get('label'), 'inherited'));
                }
                if (states.viewType !== true) {
                    const type = viewTypeMap[model.get('viewType')];
                    model.setViewAttr('viewType', this.format(type, 'inherited', {translate: ''}));
                } else {
                    model.setAttrValueLabel('viewType', viewTypeMap);
                }
                if (states.orderNumber !== true) {
                    model.setViewAttr('orderNumber', this.format(model.get('orderNumber'), 'inherited'));
                }
                model.setViewAttr('inherited', 'Yes');
            } else {
                model.setRelatedViewAttr('group');
                model.setViewAttr('inherited', '');
                model.setAttrValueLabel('viewType', viewTypeMap);
            }
        }
    }
};