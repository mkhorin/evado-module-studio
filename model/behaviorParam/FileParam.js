/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class FileParam extends Base {

    static getConstants () {
        return {
            ATTRS: [
                ...super.ATTRS,
                'imageOnly',
                'minSize',
                'maxSize',
                'extensions',
                'types',
                'nameAttr',
                'accept',
                'hashing',
                'rawClass'
            ],
            RULES: [
                ['nameAttr', 'id'],
                [['hashing', 'imageOnly'], 'checkbox'],
                [['minSize', 'maxSize'], 'integer', {min: 1}],
                [['extensions', 'types', 'accept', 'rawClass'], 'string']
            ],
            ATTR_LABELS: {
                maxSize: 'Maximum size',
                minSize: 'Minimum size',
                types: 'Media types',
                nameAttr: 'Filename attribute',
                rawClass: 'Raw file class'
            }
        };
    }

    prepareData () {
        return this.resolveRelations(['nameAttr']);
    }

    stringify () {
        this.set('nameAttr', this.get('nameAttr.name'));
        return super.stringify();
    }

    relinkClassAttrs (data) {
        if (this.relinkAttr('nameAttr', data)) {
            return this.forceSave();
        }
    }

    relNameAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'nameAttr').select('name').raw();
    }
};
module.exports.init(module);