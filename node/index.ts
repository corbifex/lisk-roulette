import { Application } from 'lisk-sdk';
import { RouletteModule } from "./modules/roulette";
import {FaucetTransaction} from "./transactions/101_faucet_transaction";
import {RouletteBetTransaction} from "./transactions/1001_bet_roulette_transaction";
import { Config, GenesisBlock, CONSTANTS } from './config';

try {
    const app = new Application(GenesisBlock, Config);
    app.registerModule(RouletteModule);
    app.registerTransaction(FaucetTransaction);
    app.registerTransaction(RouletteBetTransaction);

    app.constants = {
        ...app.constants,
        ...CONSTANTS
    };

    app
        .run()
        .then(() => app.logger.info('App started...'))
        .catch(error => {
            if (error instanceof Error) {
                app.logger.error('App stopped with error', error.message);
                app.logger.debug(error.stack);
            } else {
                app.logger.error('App stopped with error', error);
            }
            process.exit();
        });
} catch (e) {
    console.error('Application start error.', e);
    process.exit();
}
