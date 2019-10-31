'use strict';

import { Roulette } from './roulette';
import BaseModule from 'lisk-framework/src/modules/base_module';
import { migrations } from "./migrations";

export class RouletteModule extends BaseModule {

    protected roulette;
    public readonly options;

    constructor(options) {
        super(options);
        this.roulette = null;
    }

    static get alias() {
        return 'roulette';
    }

    static get info() {
        return {
            author: 'Moosty',
            version: '0.0.1',
            name: 'lisk-roulette',
        };
    }

    static get migrations() {
        return migrations;
    }

    static get defaults() {
        return {};
    }

    get events() {
        return [
            'update:balance',
            'update:stats_all',
            'update:topList',
        ];
    }

    get actions() {
        return {};
    }

    async load(channel) {
        this.roulette = new Roulette(this.options);

        channel.once('app:ready', async () => {
            await this.roulette.bootstrap(channel);
        });
    }

    async unload() {
        return this.roulette ? this.roulette.cleanup(0) : true;
    }
}
