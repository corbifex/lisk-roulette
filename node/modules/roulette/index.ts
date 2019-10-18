/*
 * Copyright © 2019 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

'use strict';

import { Roulette } from './roulette';
import BaseModule from 'lisk-framework/src/modules/base_module';

export class RouletteModule extends BaseModule {

    protected roulette;
    public readonly options;

    constructor(options) {
        super(options);
        this.roulette = null;
    }

    static get alias() {
        return 'Roulette';
    }

    static get info() {
        return {
            author: 'Moosty',
            version: '0.0.1',
            name: 'lisk-roulette',
        };
    }

    static get defaults() {
        return {};
    }

    get events() {
        return [];
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
