/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../../component/param/Param');

module.exports = class FileParam extends Base {

    static getConstants () {
        return {
            ATTRS: super.ATTRS.concat([
                'imageOnly',
                'minSize',
                'maxSize',
                'extensions',
                'mimeTypes',
                'nameAttr',
                'accept'
            ]),
            RULES: [
                ['imageOnly', 'checkbox'],
                ['nameAttr', 'id'],
                [['minSize', 'maxSize'], 'integer', {min: 1}],
                [['extensions', 'mimeTypes', 'accept'], 'string']
            ],
            ATTR_LABELS: {
                maxSize: 'Maximum size',
                minSize: 'Minimum size',
                mimeTypes: 'MIME types',
                nameAttr: 'Filename attribute'
            }
        };
    }

    prepareData () {
        return this.resolveRelations(['nameAttr']);
    }

    relinkClassAttrs (data) {
        if (data.hasOwnProperty(this.get('nameAttr'))) {
            this.set('nameAttr', data[this.get('nameAttr')]);
            return this.forceSave();
        }
    }

    relNameAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'nameAttr').select('name').raw();
    }
};
module.exports.init(module);