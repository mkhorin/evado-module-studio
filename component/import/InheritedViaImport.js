/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./ViaImport');

module.exports = class InheritedViaImport extends Base {

    async process () {
        const data = this.data;
        if (!data) {
            return false;
        }
    }

    createVia () {
        if (!this.data.via) {
            return false;
        }
        const instance = this.spawn('import/InheritedViaImport', {
            owner: this.owner,
            parent: this.model,
            meta: this.owner.meta,
            data: this.data.via
        });
        return instance.process();
    }
};