import React from 'react';
import './transactions.css';
import DataTable from 'react-data-table-component';

const data = [{ id: 1, Transaction: '12345689723454', Amount: '5000', Blocktime: '20.01 01-05-2019', Progress:'done' },
{ id: 2, Transaction: '38991145', Amount: '1445', Blocktime: '20.01 01-05-2019', Progress: 'done' },
];
const columns = [
  {
    name: 'Transaction',
    selector: 'Transaction',
    sortable: true,
  },
  {
    name: 'Amount',
    selector: 'Amount',
    sortable: true,
    right: true,
  },
  {
    name: 'Blocktime',
    selector: 'Blocktime',
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
        title="Roulette Transactions"
        columns={columns}
        data={data}

      />
    )
  }
};



