/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ViewGroupMainGroup extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        const view = await model.resolveRelation('view');
        const classGroup = await model.resolveRelation('classGroup');
        const overridden = await model.getBehavior('overridden').getAttrMap();
        return {view, classGroup, overridden};
    }
};