/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewAttrList extends Base {

    prepareModels (models) {
        const ClassAttr = this.getClass('model/ClassAttr');
        const viewTypeMap = ClassAttr.getAttrValueLabels('viewType');
        const translate = {translate: ''};
        for (const model of models) {
            const attr = model.rel('classAttr');
            if (!attr) {
                continue;
            }
            const states = model.getBehavior('overridden').getStates();
            if (states.label !== true) {
                model.setViewAttr('label', this.format(attr.get('label'), 'inherited'));
            }
            if (states.header !== true) {
                model.setViewAttr('header', this.format(attr.get('header'), 'inherited'));
            }
            if (states.viewType === true) {
                model.setAttrValueLabel('viewType', viewTypeMap);
            } else {
                const value = attr.getAttrValueLabel('viewType');
                model.setViewAttr('viewType', this.format(value, 'inherited', translate));
            }
            states.group === true
                ? model.setRelatedViewAttr('group')
                : model.setViewAttr('group', this.format(attr.getRelatedTitle('group'), 'inherited'));
        }
    }
};