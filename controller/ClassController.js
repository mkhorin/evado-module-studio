/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ClassController extends Base {

    static getConstants () {
        return {
            ACTIONS: {
                'sort-related': {
                    Class: require('evado/component/action/SortRelatedAction'),
                    with: {groups: 'parent'}
                }
            }
        };
    }

    getModelClass () {
        return this.getClass('model/Class');
    }

    async actionInherit () {
        const parent = await this.getModel();
        const model = this.createModel();
        model.set('parent', parent.getId());
        return super.actionCreate({model});
    }

    actionList () {
        return super.actionList(this.createModel().find().with('parent'));
    }

    actionListRelated (params = {}) {
        let relations;
        switch (this.getQueryParam('rel')) {
            case 'attrs': relations = 'group'; break;
            case 'groups': relations = 'parent'; break;
            case 'indexes': relations = 'attrs'; break;
            case 'rules': relations = 'attrs'; break;
            case 'states': relations = 'view'; break;
            case 'transitions': relations = ['startStates', 'finalState']; break;
            case 'treeViewLevels': relations = ['refAttr.refClass', 'refAttr.original.refClass']; break;
        }
        params.with = relations;
        return super.actionListRelated(params);
    }

    async actionListRealDescendants () {
        const model = await this.getModel({Class: this.getClass('model/Class')});
        return super.actionList(await model.findDescendants({abstract: false}));
    }
};
module.exports.init(module);