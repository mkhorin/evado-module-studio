/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ClassController extends Base {

    static getConstants () {
        return {
            ACTIONS: {
                'sortRelated': {
                    Class: require('evado/component/action/SortRelatedAction'),
                    with: {
                        groups: 'parent'
                    }
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
        const query = this.createModel().createQuery().with('parent');
        return super.actionList(query);
    }

    async actionListRealDescendants () {
        const model = await this.getModel({
            Class: this.getClass('model/Class')
        });
        const query = await model.findDescendants({abstract: false});
        return super.actionList(query);
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'attrs': {
                return 'group';
            }
            case 'groups': {
                return 'parent';
            }
            case 'indexes': {
                return 'attrs';
            }
            case 'rules': {
                return 'attrs';
            }
            case 'transitions': {
                return [
                    'startStates',
                    'finalState'
                ];
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