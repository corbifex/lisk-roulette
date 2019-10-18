const { APIClient } = require('@liskhq/lisk-api-client');

export class TransmitTransactions {
  constructor() {
    this.APIClient = new APIClient(['http://185.27.32.30:7777']);
  }

  send(transaction) {
    return this.APIClient.transactions.broadcast(transaction);
  }
}

