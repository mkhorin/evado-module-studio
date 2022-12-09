/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ViewGroupController extends Base {

    getModelClass () {
        return this.getClass('model/ViewGroup');
    }

    actionList () {
        const model = this.createModel();
        const query = model.createQuery().with('classGroup', 'parent', 'view');
        return super.actionList(query);
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
        let {ids} = this.getPostParams();
        ids = RequestHelper.getNotEmptyArrayParam(ids);
        if (!ids) {
            throw new BadRequest('Invalid identifiers');
        }
        const query = model.find(['id', ClassGroup.PK, ids]);
        ids = await query.column(ClassGroup.PK);
        const models = await this.createModel().createByGroups(ids, view);
        ids = models.map(model => model.getId());
        return this.send(ids.join());
    }

    async actionListAttrs () {
        const {pid} = this.getQueryParams();
        const viewGroup = await this.getModel({
            id: pid,
            with: 'view'
        });
        const ClassAttr = this.getClass('model/ClassAttr');
        const ViewAttr = this.getClass('model/ViewAttr');
        const classAttr = this.spawn('model/ClassAttr');
        const viewAttr = this.spawn('model/ViewAttr');
        const groupId = viewGroup.get('classGroup');
        const classId = viewGroup.get('view.class');
        const classAttrQuery = classAttr.findByClassAndGroup(classId, groupId);
        const classAttrIds = await classAttrQuery.column(ClassAttr.PK);
        const viewId = viewGroup.get('view');
        const viewAttrQuery = viewAttr.findByViewAndGroup(viewId, groupId, classAttrIds);
        const attrs = await viewAttrQuery.all();
        const viewAttrIds = ViewAttr.filterInherited(attrs, groupId).map(attr => attr.getId());
        const query = viewAttr.findById(viewAttrIds).with('classAttr');
        return this.sendGridList(query, {viewModel: 'list/attrs'});
    }
};
module.exports.init(module);

const BadRequest = require('areto/error/http/BadRequest');
const RequestHelper = require('evado/component/helper/RequestHelper');