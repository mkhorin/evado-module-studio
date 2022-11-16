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
                    const value = model.get('group.name');
                    model.setViewAttr('group', this.formatInherited(value));
                }
                if (states.viewType !== true) {
                    const value = viewTypeMap[model.get('viewType')];
                    model.setViewAttr('viewType', this.formatInherited(value, {translate: ''}));
                } else {
                    model.setAttrValueLabel('viewType', viewTypeMap);
                }
                if (states.orderNumber !== true) {
                    const value = model.get('orderNumber');
                    model.setViewAttr('orderNumber', this.formatInherited(value));
                }
                model.setViewAttr('inherited', 'Yes');
            } else {
                model.setRelatedViewAttr('group');
                model.setViewAttr('inherited', '');
                model.setAttrValueLabel('viewType', viewTypeMap);
            }
        }
    }

    formatInherited (value, ...params) {
        return this.format(value, 'inherited', ...params);
    }
};