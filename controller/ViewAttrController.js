/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ViewAttrController extends Base {

    getModelClass () {
        return this.getClass('model/ViewAttr');
    }
    
    async actionCreateByClassAttrs () {
        const viewModel = await this.getModel({Class: this.getClass('model/View')});
        const classModel = await viewModel.resolveRelation('class');
        const model = this.spawn('model/ClassAttr');
        if (this.isGet()) {
            return this.render('createByClassAttrs', {model, viewModel, classModel});
        }
        const ids = RequestHelper.getNotEmptyArrayParam(this.getPostParam('ids'));
        if (!ids) {
            throw new BadRequest('Invalid IDs');
        }
        let models = await model.findById(ids).all();
        models = await this.createModel().createByClassAttrs(models, viewModel);
        return this.send(models.map(model => model.getId()).join());
    }

    actionList () {
        return super.actionList(this.createModel().find().with('classAttr', 'class', 'view'));
    }
};
module.exports.init(module);

const BadRequest = require('areto/error/http/BadRequest');
const RequestHelper = require('evado/component/helper/RequestHelper');