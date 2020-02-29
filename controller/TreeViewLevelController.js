/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class TreeViewLevelController extends Base {

    getModelClass () {
        return this.getClass('model/TreeViewLevel');
    }

    async actionCreateByClass () {
        const owner = await this.getModel({
            Class: this.getClass('model/Class'),
            id: this.getQueryParam('pid')
        });
        const model = this.createModel();
        model.set('owner', owner.getId());
        model.populateRelation('owner', owner);
        return super.actionCreate({model});
    }

    async actionCreateByView () {
        const owner = await this.getModel({
            Class: this.getClass('model/View'),
            id: this.getQueryParam('pid'),
            with: 'class'
        });
        const model = this.createModel();
        model.set('owner', owner.getId());
        model.populateRelation('owner', owner);
        return super.actionCreate({model});
    }

    async actionListSelectView () {
        const model = await this.getModel({
            Class: this.getClass('model/ClassAttr')
        });
        const query = this.spawn('model/View').find({class: model.get('refClass')});
        return this.sendSelectList(query);
    }
};
module.exports.init(module);