/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseActiveRecord');

module.exports = class BaseActiveRecord extends Base {

    /**
     * Map to replace one ID to another linked by linkAttr: {key: value}
     */
    async getRelinkMap (keyQuery, valueQuery, linkAttr) {
        const keys = await keyQuery.select(linkAttr).raw().all();
        const values = await valueQuery.select(linkAttr).raw().index(linkAttr).all();
        const map = {};
        for (const key of keys) {
            if (values.hasOwnProperty(key[linkAttr])) {
                map[key[this.PK]] = values[key[linkAttr]][this.PK];
            }
        }
        return map;
    }

    findByClass (id) {
        return this.find(['ID', 'class', id]);
    }

    relinkAttr (name, data) {
        const key = this.get(name);
        if (data.hasOwnProperty(key)) {
            this.set(name, data[key]);
            return true;
        }
    }
};