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
        const model = await this.createClonedModel();
        return this.actionCreate({
            scenario: 'clone',
            model
        });
    }

    async actionLinkToParent () {
        const model = await this.createClonedModel(true);
        return this.actionCreate({
            scenario: 'clone',
            template: 'link',
            model
        });
    }

    actionClone () {
        return super.actionClone({
            excepts: ['original']
        });
    }

    actionUpdate () {
        return super.actionUpdate({
            getParamsByModel: model => ({
                template: model.hasOriginal() ? 'inherited' : 'update'
            })
        });
    }

    actionList () {
        const query = this.createModel().createQuery().with('class');
        return super.actionList(query);
    }

    actionListSelect () {
        const {pid} = this.getPostParams();
        const query = this.createModel().findForSelect(pid);
        return this.sendSelectList(query);
    }

    async actionListFromParent () {
        const {id} = this.getQueryParams();
        const query = await this.createModel().findParents(id);
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
            case 'attrs': {
                return ['group', 'classAttr.group'];
            }
            case 'groups': {
                return ['parent', 'classGroup.parent'];
            }
            case 'rules': {
                return 'attrs';
            }
            case 'treeViewLevels': {
                return [
                    'refAttr.refClass',
                    'refAttr.original.refClass'
                ];
            }
        }
    }
};
module.exports.init(module);