/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewGroupMainGroup extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        return {
            view: await model.resolveRelation('view'),
            classGroup: await model.resolveRelation('classGroup'),
            overridden: await model.getBehavior('overridden').getAttrMap()
        };
    }
};