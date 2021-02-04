/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ViewController extends Base {

    static getConstants () {
        return {
            ACTIONS: {
                'sortRelated': {
                    Class: require('evado/component/action/SortRelatedAction'),
                    with: {
                        attrs: 'group'
                    }
                }
            }
        };
    }

    getModelClass () {
        return this.getClass('model/View');
    }

    async actionCreateByClass () {
        const owner = await this.getModel({
            Class: this.getClass('model/Class')
        });
        const model = this.createModel();
        model.set('class', owner.getId());
        return super.actionCreate({model});
    }

    async actionSelectFromParent () {
        const classModel = await this.getModel({
            Class: this.getClass('model/Class')
        });
        return super.actionSelect({
            template: 'selectFromParent',
            templateData: {classModel}
        });
    }

    async actionCloneFromParent () {
        return this.actionCreate({
            scenario: 'clone',
            model: await this.createClonedModel()
        });
    }

    async actionLinkToParent () {
        return this.actionCreate({
            scenario: 'clone',
            model: await this.createClonedModel(true),
            template: 'link'
        });
    }

    actionClone () {
        return super.actionClone({
            excepts: ['original']
        });
    }

    actionUpdate () {
        return super.actionUpdate({
            getParamsByModel: model => ({template: model.hasOriginal() ? 'inherited' : 'update'})
        });
    }

    actionList () {
        return super.actionList(this.createModel().createQuery().with('class'));
    }

    actionListSelect () {
        const query = this.createModel().findForSelect(this.getPostParam('pid'));
        return this.sendSelectList(query);
    }

    async actionListFromParent () {
        const query = await this.createModel().findParents(this.getQueryParam('id'));
        return this.sendGridList(query.with('class'), {viewModel: 'list'});
    }

    async createClonedModel (withOriginal) {
        const classModel = await this.getModel({
            Class: this.getClass('model/Class')
        });
        const sample = await this.getModel({
            Class: this.getClass('model/View'),
            id: this.getQueryParam('sample')
        });
        const model = this.createModel();
        model.getBehavior('clone').setOriginal(sample);
        await model.relinkClass(sample.get('class'), classModel.getId());
        if (withOriginal) {
            model.set('original', sample.getId());
        }
        return model;
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'attrs':
                return ['group', 'classAttr.group'];
            case 'groups':
                return ['parent', 'classGroup.parent'];
            case 'rules':
                return 'attrs';
            case 'treeViewLevels':
                return ['refAttr.refClass', 'refAttr.original.refClass'];
        }
    }
};
module.exports.init(module);