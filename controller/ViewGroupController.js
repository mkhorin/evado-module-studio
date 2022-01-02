/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ViewGroupController extends Base {

    getModelClass () {
        return this.getClass('model/ViewGroup');
    }

    async actionCreateByGroups () {
        const view = await this.getModel({
            Class: this.getClass('model/View')
        });
        const ClassGroup = this.getClass('model/ClassGroup');
        const model = this.spawn(ClassGroup);
        if (this.isGetRequest()) {
            return this.render('createByGroups', {model, view});
        }
        let ids = RequestHelper.getNotEmptyArrayParam(this.getPostParam('ids'));
        if (!ids) {
            throw new BadRequest('Invalid identifiers');
        }
        ids = await model.find(['id', ClassGroup.PK, ids]).column(ClassGroup.PK);
        const models = await this.createModel().createByGroups(ids, view);
        return this.send(models.map(model => model.getId()).join());
    }

    async actionListAttrs () {
        const viewGroup = await this.getModel({
            id: this.getQueryParam('pid'),
            with: 'view'
        });
        const ClassAttr = this.getClass('model/ClassAttr');
        const ViewAttr = this.getClass('model/ViewAttr');
        const classAttr = this.spawn('model/ClassAttr');
        const viewAttr = this.spawn('model/ViewAttr');
        const groupId = viewGroup.get('classGroup');
        let ids = await classAttr.findByClassAndGroup(viewGroup.get('view.class'), groupId).column(ClassAttr.PK);
        const attrs = await viewAttr.findByViewAndGroup(viewGroup.get('view'), groupId, ids).all();
        ids = ViewAttr.filterInherited(attrs, groupId).map(attr => attr.getId());
        const query = viewAttr.findById(ids).with('classAttr');
        return this.sendGridList(query, {viewModel: 'list/attrs'});
    }
};
module.exports.init(module);

const BadRequest = require('areto/error/http/BadRequest');
const RequestHelper = require('evado/component/helper/RequestHelper');