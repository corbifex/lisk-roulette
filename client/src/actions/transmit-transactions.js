const { APIClient } = require('@liskhq/lisk-api-client');

export class TransmitTransactions {
  constructor() {
    this.APIClient = new APIClient(['https://api.roulette.delegate.moosty.com']);
  }

  send(transaction) {
    return this.APIClient.transactions.broadcast(transaction);
  }
}

