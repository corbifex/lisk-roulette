import _ from 'lodash';
import path from 'path';
import filterTypes from 'lisk-framework/src/components/storage/utils/filter_types';
import {BaseEntity} from 'lisk-framework/src/components/storage/entities';

const sqlFiles = {
    select: 'userbets/get.sql',
    update_one: 'userbets/update_one.sql',
    create: 'userbets/create.sql',
};

export class UserBetsEntity extends BaseEntity {
    private sqlDirectory;
    private addField;
    private loadSQLFiles;
    private adapter;
    private SQLs;
    private validateFilters;
    private validateOptions;
    private defaultOptions;
    private mergeFilters;
    private parseFilters;
    private parseSort;

    constructor(adapter, defaultFilters = {}) {
        super(adapter, defaultFilters);

        this.addField('accountId', 'string', {
            filter: filterTypes.TEXT,
            format: 'address'
        });

        this.addField('bets', 'number', {
            filter: filterTypes.NUMBER,
        });

        this.addField('wins', 'number', {
            filter: filterTypes.NUMBER,
        });

        this.addField('payout', 'string', {
            filter: filterTypes.TEXT,
        });

        this.addField('wagered', 'string', {
            filter: filterTypes.TEXT,
        });

        this.addField('registered', 'number', {
            filter: filterTypes.NUMBER,
        });

        this.sqlDirectory = path.join(path.dirname(__filename), '../sql');

        this.SQLs = this.loadSQLFiles('userbets', sqlFiles, this.sqlDirectory);
    }

    static _sanitizeFilters(filters = {}) {
        const sanitizeFilterObject = filterObject => {
            return filterObject;
        };

        // PostgresSQL does not support null byte buffer so have to parse in javascript
        if (Array.isArray(filters)) {
            filters = filters.map(sanitizeFilterObject);
        } else {
            filters = sanitizeFilterObject(filters);
        }

        return filters;
    }

    get(filters, options = {}, tx) {
        return this._getResults(filters, options, tx);
    }

    create(address: string, date: number) {
        const params = {
            address,
            date,
        };

        return this.adapter.executeFile(this.SQLs.create, params, {expectedResultCount: 0});
    }

    updateOne(bets: string, wins: string, payout: string, wagered: string, address: string, lastTx: string) {
        const params = {
            bets,
            wins,
            payout,
            wagered,
            address,
            lastTx,
        };

        return this.adapter.executeFile(this.SQLs.update_one, params, {expectedResultCount: 0});
    }

    _getResults(filters, options, tx, expectedResultCount?: number) {
        filters = UserBetsEntity._sanitizeFilters(filters);
        this.validateFilters(filters);
        this.validateOptions(options);

        const mergedFilters = this.mergeFilters(filters);
        const parsedFilters = this.parseFilters(mergedFilters);
        const parsedOptions = _.defaults(
            {},
            _.pick(options, ['limit', 'offset', 'sort', 'extended']),
            _.pick(this.defaultOptions, ['limit', 'offset', 'sort', 'extended']),
        );

        // To have deterministic pagination add extra sorting
        if (parsedOptions.sort) {
            parsedOptions.sort = _.flatten([parsedOptions.sort, 'accountId:asc']).filter(
                Boolean,
            );
        } else {
            parsedOptions.sort = ['accountId:asc'];
        }

        let parsedSort = this.parseSort(parsedOptions.sort);

        const params = {
            limit: parsedOptions.limit,
            offset: parsedOptions.offset,
            parsedSort,
            parsedFilters,
        };

        return this.adapter
            .executeFile(
                this.SQLs.select,
                params,
                {expectedResultCount},
                tx,
            )
            .then(resp => {
                return resp;
            });
    }
}
