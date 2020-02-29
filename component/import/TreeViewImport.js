/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ImportBase');

module.exports = class TreeViewImport extends Base {

    process () {
        return PromiseHelper.each(this.data, this.createTreeViewLevel, this);
    }

    async createTreeViewLevel (data) {
        if (this.hasError()) {
            return false;
        }
        const source = this.sourceClass;
        const errorPrefix = `Tree view source class: ${source.get('name')}`;
        const name = data.refAttr;
        const attr = await source.relAttrs().and({name}).one();
        if (!attr) {
            return this.assignError(`${errorPrefix}: Unknown attribute: ${name}`);
        }
        const refClass = await attr.resolveRelation('refClass');
        if (!refClass) {
            return this.assignError(`${errorPrefix}: Invalid refClass`);
        }
        const view = await refClass.relViews().and({name: data.view}).one();
        if (data.view && !view) {
            return this.assignError(`${errorPrefix}: Invalid view: ${data.view}`);
        }
        const level = this.spawn('model/TreeViewLevel', {scenario: 'create'});
        level.set('owner', this.owner.model.getId());
        level.set('refAttr', attr.getId());
        level.set('view', view ? view.getId() : null);
        await level.save();
        this.assignError(this.Helper.getError(level, 'treeView'));
        this.sourceClass = refClass;
    }

    assignError (message) {
        if (message) {
            this.owner.assignError(message);
        }
    }
};

const PromiseHelper = require('areto/helper/PromiseHelper');