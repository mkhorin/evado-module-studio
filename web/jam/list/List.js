/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.AttrList = class AttrList extends Jam.AttrList {
   
    getCommandMethod (name) {
        switch (name) {
            case 'cloneFromParent': return this.onCloneFromParent;
        }
        return super.getCommandMethod(name);
    }

    prepareRowByDecorateInherited () {
    }

    onCloneFromParent (event) {
        this.selectFromParent(event, this.cloneFromParent);
    }

    selectFromParent (event, handler) {
        const $target = $(event.currentTarget);
        this.childModal.load($target.data('select')).done(() => {
            this.childModal.one('afterClose', (event, data) => {
                if (data && data.result) {
                    handler.call(this, data.result, $target);
                }
            });
        });
    }

    cloneFromParent (sample, $target) {
        this.childModal.load($target.data('clone'), {sample}).done(() => {
            this.childModal.one('afterClose', (event, data) => {
                if (data && data.result) {
                    this.linkObjects(data.result);
                }
            });
        });
    }
};