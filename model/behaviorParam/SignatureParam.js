/**
 * @copyright Copyright (c) 2021 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class SignatureParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'signature',
                'params'
            ],
            RULES: [
                ['signature', 'required'],
                ['signature', 'id'],
                ['params', 'json']
            ],
            ATTR_LABELS: {
                params: 'Parameters',
                signature: 'Signature class'
            }
        };
    }

    prepareData () {
        return this.resolveRelation(['signature']);
    }

    stringify () {
        this.set('signature', this.get('signature.name'));
        return super.stringify();
    }

    relSignature () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'signature').select('name').raw();
    }
};
module.exports.init(module);