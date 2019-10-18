import { Application } from 'lisk-sdk';
import { RouletteModule } from "./modules/roulette";
import { BetRouletteTransaction, FaucetTransaction } from "./transactions";
import { Config, GenesisBlock, CONSTANTS } from './config';

try {
    const app = new Application(GenesisBlock, Config);
    app.registerModule(RouletteModule);
    app.registerTransaction(FaucetTransaction);
    app.registerTransaction(BetRouletteTransaction);

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
