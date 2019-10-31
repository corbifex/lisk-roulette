import { createLoggerComponent } from 'lisk-framework/src/components/logger';
import { createStorageComponent } from 'lisk-framework/src/components/storage';
import { Account } from 'lisk-framework/src/modules/chain/components/storage/entities';
import { BetsEntity, GlobalStatsEntity, UserBetsEntity } from './components/storage/entities';
import { StatsController } from "./controllers/stats";
import runRoulette from './actions/run_roulette';
import subscribeRequests from './actions/requests';
import subscribeEvents from './actions/events';
const io = require('socket.io')();

export class Roulette {

    public channel;
    public readonly options;
    public logger;
    public scope;

    constructor(options) {
        this.options = options;
        this.logger = null;
        this.scope = null;
    }

    async bootstrap(channel) {
        this.channel = channel;
        // Logger
        const loggerConfig = await this.channel.invoke(
            'app:getComponentConfig',
            'logger',
        );
        this.logger = createLoggerComponent({
            ...loggerConfig,
            module: 'roulette',
        });

        // Storage
        this.logger.debug('Initiating storage...');
        const storageConfig = await this.channel.invoke(
            'app:getComponentConfig',
            'storage',
        );
        const dbLogger =
            storageConfig.logFileName &&
            storageConfig.logFileName === loggerConfig.logFileName
                ? this.logger
                : createLoggerComponent({
                    ...loggerConfig,
                    logFileName: storageConfig.logFileName,
                    module: 'roulette:database',
                });
        const storage = createStorageComponent(storageConfig, dbLogger);
        storage.registerEntity('Account', Account, {
            replaceExisting: true,
        });
        storage.registerEntity('Bets', BetsEntity);
        storage.registerEntity('GlobalStats', GlobalStatsEntity);
        storage.registerEntity('UserStats', UserBetsEntity);
        const status = await storage.bootstrap();
        if (!status) {
            throw new Error('Cannot bootstrap the storage component');
        }

        const statsController = new StatsController(storage, this.channel);
        // StatController.chiSquareTest();
        statsController.syncStats();

        const applicationState = await this.channel.invoke(
            'app:getApplicationState',
        );

        // Setup scope
        this.scope = {
            components: {
                logger: this.logger,
                storage,
            },
            controllers: {
              stats: statsController
            },
            channel: this.channel,
            applicationState,
        };
        runRoulette(this.scope);

        io.on('connection', client => {
            subscribeRequests(this.scope, client);
            subscribeEvents(this.scope, client);
        });

        io.listen(7171 );
    }

    async cleanup(code, error) {
        const {components} = this.scope;
        if (error) {
            this.logger.fatal(error.toString());
            if (code === undefined) {
                code = 1;
            }
        } else if (code === undefined || code === null) {
            code = 0;
        }
        this.logger.info('Cleaning Roulette module...');

        try {
            if (components !== undefined) {
                Object.keys(components).forEach(async key => {
                    if (components[key].cleanup) {
                        await components[key].cleanup();
                    }
                });
            }
        } catch (componentCleanupError) {
            this.logger.error(componentCleanupError);
        }
        this.logger.info('Cleaned up successfully');
    }
}
