/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ViewController extends Base {

    static getConstants () {
        return {
            ACTIONS: {
                'sort-related': {
                    Class: require('evado/component/action/SortRelatedAction'),
                    with: {attrs: 'group'}
                }
            }
        };
    }

    getModelClass () {
        return this.getClass('model/View');
    }

    async actionCreateByClass () {
        const owner = await this.getModel({Class: this.getClass('model/Class')});
        const model = this.createModel();
        model.set('class', owner.getId());
        return super.actionCreate({model});
    }

    async actionSelectFromParent () {
        const classModel = await this.getModel({Class: this.getClass('model/Class')});
        return super.actionSelect({
            template: 'selectFromParent',
            templateData: {classModel}
        });
    }

    async actionCloneFromParent () {
        const classModel = await this.getModel({Class: this.getClass('model/Class')});
        const sample = await this.getModel({
            Class: this.getClass('model/View'),
            id: this.getQueryParam('sample')
        });
        const model = this.createModel();
        model.originalClassId = sample.get('class');
        sample.set('class', classModel.getId());
        model.getBehavior('clone').setOriginal(sample);
        return this.actionCreate({scenario: 'clone', model});
    }

    actionList () {
        return super.actionList(this.createModel().find().with('class'));
    }

    actionListSelect () {
        return this.sendSelectList(this.createModel().findForSelect(this.getPostParam('pid')));
    }

    actionListRelated (params = {}) {
        let relations;
        switch (this.getQueryParam('rel')) {
            case 'attrs': relations = ['group', 'classAttr.group']; break;
            case 'groups': relations = ['parent', 'classGroup.parent']; break;
            case 'rules': relations = 'attrs'; break;
            case 'treeViewLevels': relations = ['refAttr.refClass', 'refAttr.original.refClass']; break;
        }
        params.with = relations;
        return super.actionListRelated(params);
    }

    async actionListFromParent () {
        const query = await this.createModel().findParents(this.getQueryParam('id'));
        return this.sendGridList(query.with('class'), {viewModel: 'list'});
    }
};
module.exports.init(module);