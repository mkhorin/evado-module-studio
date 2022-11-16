/**
 * @copyright Copyright (c) 2020 Maxim Khorin <maksimovichu@gmail.com>
 */
'use strict';

const Base = require('./BaseExport');

module.exports = class SectionExport extends Base {

    async execute () {
        await PromiseHelper.setImmediate();
        if (!this.nodeMap) {
            const node = this.spawn('model/Node');
            this.nodeMap = await node.getMap();
        }
        const data = await this.getData();
        return this.saveJson(this.getSectionFile(), data);
    }

    getSectionFile () {
        const name = this.model.get('name');
        return this.getNavigationPath(`${name}.json`);
    }

    async getData () {
        let id = this.model.getId();
        let nodes = this.nodeMap.bySection[id] || [];
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
        const nodeExport = this.spawn('export/NodeExport', {
            nodeMap: this.nodeMap,
            model
        });
        return nodeExport.execute();
    }
};

const ObjectHelper = require('areto/helper/ObjectHelper');
const PromiseHelper = require('areto/helper/PromiseHelper');