/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewGroups extends Base {

    prepareModels (models) {
        const ClassGroup = this.getClass('model/ClassGroup');
        const typeMap = ClassGroup.getAttrValueLabels('type');
        const translate = {translate: ''};
        for (const model of models) {
            model.setRelatedViewAttr('parent');
            const classGroup = model.rel('classGroup');
            if (!classGroup) {
                continue;
            }
            model.setViewAttr('classGroup', classGroup.get('name'));
            const states = model.getBehavior('overridden').getStates();
            if (states.label !== true) {
                const value = classGroup.get('label');
                model.setViewAttr('label', this.formatInherited(value));
            }
            if (states.type !== true) {
                const value = classGroup.getAttrValueLabel('type', typeMap);
                model.setViewAttr('type', this.formatInherited(value, translate));
            }
            if (states.orderNumber !== true) {
                const value = classGroup.get('orderNumber');
                model.setViewAttr('orderNumber', this.formatInherited(value));
            }
            if (states.parent !== true) {
                const value = classGroup.getRelatedTitle('parent');
                model.setViewAttr('parent', this.formatInherited(value));
            }
        }
    }

    formatInherited (value, ...params) {
        return this.format(value, 'inherited', ...params);
    }
};