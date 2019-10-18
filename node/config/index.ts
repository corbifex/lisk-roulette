import _ from 'lodash';
import { testnetConfig, testnetGenesisBlock } from './testnet';
export { CONSTANTS } from './constants';

const config = {
    testnet: testnetConfig,
};

const genesisBlock = {
    testnet: testnetGenesisBlock,
};

let argv = process.argv[2];
if (!_.hasIn(config, argv)) {
    argv = 'testnet';
}
const chainType = argv || 'testnet';
const Config = config[chainType];
const GenesisBlock = genesisBlock[chainType];

export {
    Config,
    GenesisBlock
}
