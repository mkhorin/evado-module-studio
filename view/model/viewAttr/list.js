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
            if (states.header !== true) {
                const value = attr.get('header');
                model.setViewAttr('header', this.formatInherited(value));
            }
            if (states.viewType === true) {
                model.setAttrValueLabel('viewType', viewTypeMap);
            } else {
                const value = attr.getAttrValueLabel('viewType');
                model.setViewAttr('viewType', this.formatInherited(value, translate));
            }
            if (states.group === true) {
                model.setRelatedViewAttr('group')
            } else {
                const value = attr.getRelatedTitle('group');
                model.setViewAttr('group', this.formatInherited(value));
            }
        }
    }

    formatInherited (value, ...params) {
        return this.format(value, 'inherited', ...params);
    }
};