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
        const viewModel = await this.getModel({
            Class: this.getClass('model/View')
        });
        const classModel = await viewModel.resolveRelation('class');
        const model = this.spawn('model/ClassAttr');
        if (this.isGetRequest()) {
            return this.render('createByClassAttrs', {model, viewModel, classModel});
        }
        let {ids} = this.getPostParams();
        ids = RequestHelper.getNotEmptyArrayParam(ids);
        if (!ids) {
            throw new BadRequest('Invalid identifiers');
        }
        let models = await model.findById(ids).all();
        models = await this.createModel().createByClassAttrs(models, viewModel);
        ids = models.map(model => model.getId());
        return this.send(ids.join());
    }

    actionList () {
        const model = this.createModel();
        const query = model.createQuery().with('classAttr', 'class', 'view');
        return super.actionList(query);
    }
};
module.exports.init(module);

const BadRequest = require('areto/error/http/BadRequest');
const RequestHelper = require('evado/component/helper/RequestHelper');