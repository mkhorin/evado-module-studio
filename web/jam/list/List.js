/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.AttrList = class AttrList extends Jam.AttrList {
   
    getCommandMethod (name) {
        switch (name) {
            case 'cloneFromParent': return this.onSelectFromParent;
        }
        return super.getCommandMethod(name);
    }

    prepareRowByDecorateInherited () {
    }

    onSelectFromParent (event) {
        const $btn = $(event.currentTarget);
        this.childModal.load($btn.data('select')).done(() => {
            this.childModal.one('afterClose', (event, data) => {
                if (data && data.result) {
                    this.cloneFromParent(data.result, $btn);
                }
            });
        });
    }

    cloneFromParent (sample, $btn) {
        this.childModal.load($btn.data('clone'), {sample}).done(() => {
            this.childModal.one('afterClose', (event, data) => {
                if (data && data.result) {
                    this.linkObjects(data.result);
                }
            });
        });
    }
};