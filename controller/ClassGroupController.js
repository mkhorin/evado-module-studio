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
        const {pid} = this.getQueryParams();
        const owner = await this.getModel({
            Class: this.getClass('model/Class'),
            id: pid
        });
        const model = this.createModel();
        model.set('class', owner.getId());
        return super.actionCreate({model});
    }

    actionUpdate () {
        return super.actionUpdate({
            getParamsByModel: model => ({
                template: model.hasOriginal() ? 'inherited' : 'update'
            })
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
        const model = this.createModel();
        const query = model.createQuery().with('class', 'parent');
        return super.actionList(query);
    }

    actionListSetSelect () {
        const model = this.createModel();
        const {id} = this.getQueryParams();
        const condition = model.constructor.getOnlySetCondition();
        const query = model.findByClass(id).and(condition);
        return this.sendSelectList(query);
    }

    async actionListUnusedByView () {
        const view = await this.getModel({
            Class: this.getClass('model/View'),
            with: 'class'
        });
        const viewGroupQuery = this.spawn('model/ViewGroup')
            .find({view: view.getId()});
        const ids = await viewGroupQuery.column('classGroup');
        const Class = this.getModelClass();
        const query = this.spawn(Class)
            .find({class: view.get('class')})
            .and(['notIn', Class.PK, ids])
            .with('parent');
        return super.actionList(query);
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'viewAttrs': return ['classAttr', 'view'];
            case 'viewGroups': return ['parent', 'view'];
        }
    }
};
module.exports.init(module);