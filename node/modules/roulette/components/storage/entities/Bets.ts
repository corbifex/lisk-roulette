import _ from 'lodash';
import path from 'path';
import filterTypes from 'lisk-framework/src/components/storage/utils/filter_types';
import { BaseEntity } from 'lisk-framework/src/components/storage/entities';

const sqlFiles = {
  select: 'bets/get.sql',
  update_one: 'bets/update_one.sql',
  last_height: 'bets/get_last_update.sql',
};

export class BetsEntity extends BaseEntity {
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

    this.addField('number', 'number', {
      filter: filterTypes.NUMBER,
    });

    this.addField('count', 'string', {
      filter: filterTypes.NUMBER,
    });

    this.addField('last', 'string', {
      filter: filterTypes.NUMBER,
    });

    this.sqlDirectory = path.join(path.dirname(__filename), '../sql');

    this.SQLs = this.loadSQLFiles('bets', sqlFiles, this.sqlDirectory);
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

  getOne(filters, options = {}, tx) {
    return this._getResults(filters, options, tx, 1);
  }

  get(filters, options = {}, tx) {
    return this._getResults(filters, options, tx, 37);
  }

  getLast() {
    return this.adapter
        .executeFile(
            this.SQLs.last_height
        )
        .then(resp => {
          return resp[0];
        });
  }

  updateOne(number: number, count: string, height: string) {
    const params = {
      count: count,
      height: height,
      number: number,
    };

    return this.adapter.executeFile(this.SQLs.update_one, params, {expectedResultCount: 0});
  }

  _getResults(filters, options, tx, expectedResultCount: number) {
    filters = BetsEntity._sanitizeFilters(filters);
    this.validateFilters(filters);
    this.validateOptions(options);

    const mergedFilters = this.mergeFilters(filters);
    const parsedFilters = this.parseFilters(mergedFilters);
    this.defaultOptions.limit = 37;
    const parsedOptions = _.defaults(
      {},
      _.pick(options, ['limit', 'offset', 'sort', 'extended']),
      _.pick(this.defaultOptions, ['limit', 'offset', 'sort', 'extended']),
    );

    // To have deterministic pagination add extra sorting
    if (parsedOptions.sort) {
      parsedOptions.sort = _.flatten([parsedOptions.sort, 'number:asc']).filter(
        Boolean,
      );
    } else {
      parsedOptions.sort = ['number:asc'];
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
