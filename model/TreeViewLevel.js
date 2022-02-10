/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('../component/base/BaseActiveRecord');

module.exports = class TreeViewLevel extends Base {

    static getConstants () {
        return {
            TABLE: 'studio_treeViewLevel',
            ATTRS: [
                'owner', // class or view                
                'refAttr',
                'view',
                'recursive',
                'options'
            ],
            RULES: [
                ['refAttr', 'required'],
                [['refAttr', 'view'], 'id'],
                ['refAttr', 'validateRefAttr'],
                ['recursive', 'checkbox'],
                ['options', 'json']
            ],
            DELETE_ON_UNLINK: [
                'nextLevels'
            ],            
            ATTR_LABELS: {
                refAttr: 'Reference attribute',
                refClass: 'Reference class'
            }      
        };
    }
    
    findByOwner (id) {
        return this.find(['id', 'owner', id]);
    }

    async findSourceClass () {
        if (!this.isNew()) {
            const attr = await this.resolveRelation('refAttr');
            return await attr.resolveRelation('class');
        }
        const level = await this.resolveRelation('lastLevel');
        return level
            ? (level.rel('refAttr.refClass') || level.rel('refAttr.original.refClass'))
            : (this.rel('owner.class') || this.rel('owner'));
    }

    async validateRefAttr (attr) {
        const refAttr = await this.resolveRelation('refAttr');
        if (!refAttr) {
            return this.addError(attr, 'Attribute not found');
        }
        if (!refAttr.rel) {
            return this.addError(attr, 'Not reference attribute');
        }
    }

    // RELATIONS

    relLastLevel () {
        return this.hasOne(TreeViewLevel, 'owner', 'owner')
            .order({[this.PK]: -1})
            .with('refAttr.refClass', 'refAttr.original.refClass');
    }

    relNextLevels () {
        return this.hasMany(TreeViewLevel, 'owner', 'owner').and(['>', this.PK, this.getId()]);
    }

    relRefAttr () {
        const Class = this.getClass('model/ClassAttr');
        return this.hasOne(Class, Class.PK, 'refAttr');
    }

    relRefClass () {
        const Class = this.getClass('model/Class');
        return this.hasOne(Class, Class.PK, 'refClass').via('refAttr');
    }

    relView () {
        const Class = this.getClass('model/View');
        return this.hasOne(Class, Class.PK, 'view');
    }
};
module.exports.init(module);