/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('areto/view/ViewModel');

module.exports = class ClassIndexAttrForm extends Base {

    async resolveTemplateData () {
        const {model} = this.data;
        const index = await model.resolveRelation('index');
        const classId = index.get('class');
        const query = this.spawn('model/ClassAttr').findByClass(classId).with('relation');
        let attrs = await query.all();
        attrs = attrs.filter(attr => attr.canIndexing());
        attrs = SelectHelper.getModelLabelItems(attrs);
        return {index, attrs};
    }
};

const SelectHelper = require('evado/component/helper/SelectHelper');