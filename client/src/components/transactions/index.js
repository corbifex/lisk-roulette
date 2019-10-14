import React from 'react';
import './transactions.css';
import DataTable from 'react-data-table-component';

const data = [{ id: 1, Bet: 23, BetID: '12345689723454', Amount: '5000', Profit: 0, Result: 'Lost', Progress:'Confirmed' },
{ id: 2, Bet: 'black', BetID: '38991145', Amount: '1445', Profit: 0, Result: 'Lost', Progress: 'Confirmed' },
];
const columns = [
  {
    name: 'BetID',
    selector: 'BetID',
    sortable: true,
  },

  {
    name: 'Bet',
    selector: 'Bet',
    sortable: true,
    right: true,
  },
  {
    name: 'Amount',
    selector: 'Amount',
    sortable: true,
    right: true,
  },
  {
    name: 'Profit',
    selector: 'Profit',
    sortable: true,
    right: true,
  },
  {
    name: 'Result',
    selector: 'Result',
    sortable: true,
    right: true,
  },
  {
    name: 'Progress',
    selector: 'Progress',
    sortable: true,
    right: true,
  },
];

export class Transactions extends React.Component {
  render() {
    return (
      <DataTable
        title="Roulette Bets - Result: 12, Block Sign: 4e0c6f39b3, DateTime: 20.01 01-05-2019"
        columns={columns}
        data={data}
      />
    )
  }
};



