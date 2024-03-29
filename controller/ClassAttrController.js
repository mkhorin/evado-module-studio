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
        const {pid} = this.getQueryParams();
        const owner = await this.getModel({
            Class: this.getClass('model/Class'),
            id: pid
        });
        const model = this.createModel();
        model.set('class', owner.getId());
        return super.actionCreate({model});
    }

    async actionCreateByGroup () {
        const Class = this.getClass('model/ClassGroup');
        const {id} = this.getQueryParams();
        const group = await this.getModel({Class, id});
        const model = this.createModel();
        model.set('class', group.get('class'));
        model.set('group', group.getId());
        model.populateRelation('group', group);
        return super.actionCreate({model});
    }

    actionClone () {
        return super.actionClone({
            excepts: ['original']
        });
    }

    async actionCloneFromClass () {
        const classModel = await this.getModel({
            Class: this.getClass('model/Class')
        });
        const {sample: id} = this.getQueryParams();
        const sample = await this.getModelByClassName({id});
        const model = this.createModel();
        model.getBehavior('clone').setOriginal(sample);
        model.set('class', classModel.getId());
        return super.actionCreate({
            model,
            scenario: 'clone',
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

    async actionDelete () {
        const model = await this.getModel();
        if (model.hasOriginal()) {
            throw new BadRequest(this.translate('Unable to delete inherited attribute'));
        }
        await model.delete();
        this.sendText(model.getId());
    }

    actionSelectWithClass () {
        return this.actionSelect({
            template: 'selectWithClass'
        });
    }

    actionList () {
        const model = this.createModel();
        const query = model.createQuery().with('class', 'original', 'group');
        return super.actionList(query);
    }

    actionListByClass () {
        const {pid} = this.getQueryParams();
        const query = this.createModel().findByClass(pid);
        return super.actionList(query);
    }

    async actionListByView () {
        const view = await this.getModel({
            Class: this.getClass('model/View'),
            with: 'attrs'
        });
        const classAttr = view.get('attrs.classAttr');
        const query = this.createModel().findById(classAttr);
        return super.actionList(query);
    }

    actionListSelect () {
        const {pid} = this.getPostParams();
        const query = this.createModel().findByClass(pid);
        return this.sendSelectList(query);
    }

    actionListSelectAll () {
        const query = this.createModel().createQuery();
        return this.sendSelectList(query);
    }

    async actionListUnusedByView () {
        const view = await this.getModel({
            Class: this.getClass('model/View'),
            with: 'class'
        });
        const usedClassAttrs = await view.relAttrs().column('classAttr');
        const ClassAttr = this.getModelClass();
        const query = view.rel('class').relAttrs();
        query.withOnly().andNotIn(ClassAttr.PK, usedClassAttrs);
        return super.actionList(query);
    }

    getListRelatedWith (relation) {
        switch (relation) {
            case 'enums': {
                return ['class', 'items'];
            }
            case 'via': {
                return ['linkAttr', 'refClass', 'refAttr'];
            }
        }
    }
};
module.exports.init(module);

const BadRequest = require('areto/error/http/BadRequest');