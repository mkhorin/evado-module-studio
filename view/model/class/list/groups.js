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
            if (states.type !== true) {
                const value = model.getViewAttr('type');
                model.setViewAttr('type', this.formatInherited(value));
            }
            if (states.active !== true) {
                const value = model.getViewAttr('active');
                model.setViewAttr('active', this.formatInherited(value));
            }
            if (states.orderNumber !== true) {
                const value = model.get('orderNumber');
                model.setViewAttr('orderNumber', this.formatInherited(value));
            }
            if (states.parent !== true) {
                const value = model.getViewAttr('parent');
                model.setViewAttr('parent', this.formatInherited(value));
            }
            model.setViewAttr('inherited', 'Yes');
        }
    }

    formatInherited (value, ...params) {
        return this.format(value, 'inherited', ...params);
    }
};