/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

Jam.AttrList = class AttrList extends Jam.AttrList {

    getCommandMethod (name) {
        switch (name) {
            case 'selectAndClone': return this.onSelectAndClone;
        }
        return super.getCommandMethod(name);
    }

    prepareItemByDecorateInherited () {
    }

    onSelectAndClone (event) {
        this.selectToClone(event, this.cloneSelected);
    }

    selectToClone (event, handler) {
        const $target = $(event.currentTarget);
        this.childFrame.load($target.data('select')).done(() => {
            this.childFrame.one('afterClose', (event, data) => {
                if (data?.result) {
                    handler.call(this, data.result, $target);
                }
            });
        });
    }

    cloneSelected (sample, $target) {
        const clone = $target.data('clone');
        this.childFrame.load(clone, {sample}).done(() => {
            this.childFrame.one('afterClose', (event, data) => {
                if (data?.result) {
                    this.linkObjects(data.result);
                }
            });
        });
    }
};