/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('evado/component/base/BaseActiveRecord');

module.exports = class BaseActiveRecord extends Base {

    /**
     * Map to replace one ID to another linked by attr: {key: value}
     */
    async getRelinkMap (keyQuery, valueQuery, attr) {
        const keys = await keyQuery.select(attr).raw().all();
        const valueMap = await valueQuery.select(attr).raw().index(attr).all();
        const map = {};
        for (const key of keys) {
            if (valueMap.hasOwnProperty(key[attr])) {
                map[key[this.PK]] = valueMap[key[attr]][this.PK];
            }
        }
        return map;
    }

    findByClass (id) {
        return this.find(['id', 'class', id]);
    }

    relinkAttr (name, data) {
        const key = this.get(name);
        if (Object.hasOwn(data, key)) {
            this.set(name, data[key]);
            return true;
        }
    }
};