/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassIndexAttrForm extends Base {

    async resolveTemplateData () {
        const model = this.data.model;
        const index = await model.resolveRelation('index');
        const classId = index.get('class');
        let attrs = await this.spawn('model/ClassAttr').findByClass(classId).with('relation').all();
        attrs = attrs.filter(attr => attr.canIndexing());
        attrs = SelectHelper.getModelLabelItems(attrs);
        return {index, attrs};
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');