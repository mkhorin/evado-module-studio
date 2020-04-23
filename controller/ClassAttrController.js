/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/CrudController');

module.exports = class ClassAttrController extends Base {

    getModelClass () {
        return this.getClass('model/ClassAttr');
    }

    async actionCreate (params) {
        if (params) { // clone
            return super.actionCreate(params);
        }
        const owner = await this.getModel({
            Class: this.getClass('model/Class'),
            id: this.getQueryParam('pid')
        });
        const model = this.createModel();
        model.set('class', owner.getId());
        return super.actionCreate({model});
    }

    async actionCreateByGroup () {
        const group = await this.getModel({
            Class: this.getClass('model/ClassGroup'),
            id: this.getQueryParam('id')
        });
        const model = this.createModel();
        model.set('class', group.get('class'));
        model.set('group', group.getId());
        model.populateRelation('group', group);
        return super.actionCreate({model});
    }

    actionClone () {
        return super.actionClone({excepts: ['original']});
    }

    actionUpdate () {
        return super.actionUpdate({
            getParamsByModel: model => ({template: model.hasOriginal() ? 'inherited' : 'update'})
        });
    }

    async actionDelete () {
        const model = await this.getModel();
        if (model.hasOriginal()) {
            throw new BadRequest(this.translate('Unable to delete inherited attribute'));
        }
        await model.delete();
        this.sendText(model.getId());
    }

    actionList () {
        return super.actionList(this.createModel().find().with('class', 'original', 'group'));
    }

    actionListByClass () {
        return super.actionList(this.createModel().findByClass(this.getQueryParam('pid')));
    }

    async actionListByView () {
        const view = await this.getModel({
            Class: this.getClass('model/View'),
            with: 'attrs'
        });
        return super.actionList(this.createModel().findById(view.get('attrs.classAttr')));
    }

    actionListSelect () {
        return this.sendSelectList(this.createModel().findByClass(this.getPostParam('pid')));
    }

    actionListSelectAll () {
        return this.sendSelectList(this.createModel().find());
    }

    actionListRelated (params = {}) {
        let relation;
        switch (this.getQueryParam('rel')) {
            case 'enums': relation = ['class', 'items']; break;
            case 'via': relation = ['linkAttr', 'refClass', 'refAttr']; break;
        }
        params.with = relation;
        return super.actionListRelated(params);
    }

    async actionListUnusedByView () {
        const view = await this.getModel({
            Class: this.getClass('model/View'),
            with: 'class'
        });
        const usedClassAttrs = await view.relAttrs().column('classAttr');
        const ClassAttr = this.getModelClass();
        const query = view.rel('class').relAttrs().withOnly().andNotIn(ClassAttr.PK, usedClassAttrs);
        return super.actionList(query);
    }
};
module.exports.init(module);

const BadRequest = require('areto/error/BadRequestHttpException');