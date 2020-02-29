/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class NavSectionExport extends Base {

    async execute () {
        await PromiseHelper.setImmediate();
        this.nodeMap = this.nodeMap || await this.spawn('model/NavNode').getMap();
        const data = await this.getData();
        return this.saveJson(this.getNavSectionFile(), data);
    }

    getNavSectionFile () {
        return this.getNavigationPath(`${this.model.get('name')}.json`);
    }

    async getData () {
        let nodes = this.nodeMap.bySection[this.model.getId()] || [];
        nodes = await PromiseHelper.map(nodes, this.getNodeData.bind(this));
        const data = {
            ...this.getAttrMap(),
            nodes: nodes.sort((a, b) => a.orderNumber - b.orderNumber)
        };
        ObjectHelper.deleteProperties([this.model.PK, 'name'], data);
        ObjectHelper.deleteEmptyProperties(data);
        return data;
    }

    getNodeData (model) {
        return this.spawn('export/NavNodeExport', {nodeMap: this.nodeMap, model}).execute();
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');