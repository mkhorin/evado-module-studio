/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewGroups extends Base {

    prepareModels (models) {
        const ClassGroup = this.getClass('model/ClassGroup');
        const typeMap = ClassGroup.getAttrValueLabels('type');
        for (const model of models) {
            model.setRelatedViewAttr('parent');
            const group = model.rel('classGroup');
            if (!group) {
                continue;
            }
            const states = model.getBehavior('overridden').getStates();
            if (states.label !== true) {
                model.setViewAttr('label', this.format(group.get('label'), 'inherited'));
            }
            if (states.type !== true) {
                const type = group.getAttrValueLabel('type', typeMap);
                model.setViewAttr('type', this.format(type, 'inherited', {translate: ''}));
            }
            if (states.orderNumber !== true) {
                model.setViewAttr('orderNumber', this.format(group.get('orderNumber'), 'inherited'));
            }
            if (states.parent !== true) {
                model.setViewAttr('parent', this.format(group.getRelatedTitle('parent'), 'inherited'));
            }
        }
    }
};