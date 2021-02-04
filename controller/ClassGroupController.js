/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ClassGroupController extends Base {

    static getConstants () {
        return {
            ACTIONS: {
                'sortRelated': {
                    Class: require('evado/component/action/SortRelatedAction'),
                    with: {
                        children: 'parent'
                    }
                }
            }
        };
    }

    getModelClass () {
        return this.getClass('model/ClassGroup');
    }

    async actionCreate () {
        const owner = await this.getModel({
            Class: this.getClass('model/Class'),
            id: this.getQueryParam('pid')
        });
        const model = this.createModel();
        model.set('class', owner.getId());
        return super.actionCreate({model});
    }

    actionUpdate () {
        return super.actionUpdate({
            getParamsByModel: model => ({template: model.hasOriginal() ? 'inherited' : 'update'})
        });
    }

    async actionCreateByGroup () {
        const group = await this.getModel();
        const model = this.createModel();
        model.set('class', group.get('class'));
        if (this.isGetRequest()) {
            model.set('parent', group.getId());
        }
        return super.actionCreate({model});
    }

    actionList () {
        return super.actionList(this.createModel().createQuery().with('class', 'parent'));
    }

    actionListSetSelect () {
        const model = this.createModel();
        const query = model.findByClass(this.getQueryParam('id'));
        return this.sendSelectList(query.and(model.constructor.getOnlySetCondition()));
    }

    async actionListUnusedByView () {
        const view = await this.getModel({
            Class: this.getClass('model/View'),
            with: 'class'
        });
        const ClassGroup = this.getClass('model/ClassGroup');
        const ids = await this.spawn('model/ViewGroup')
            .find({view: view.getId()})
            .column('classGroup');
        const query = this.spawn(ClassGroup)
            .find({class: view.get('class')})
            .and(['NOT IN', ClassGroup.PK, ids]);
        return super.actionList(query.with('parent'));
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'viewAttrs':
                return ['classAttr', 'view'];
            case 'viewGroups':
                return ['parent', 'view'];
        }
    }
};
module.exports.init(module);