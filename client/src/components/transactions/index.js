import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { TransactionTable } from './table';
import './transactions.css';

export class Transactions extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }

  

  static a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }

  TabPanel(props) {
    const {children, value, index, ...other} = props;

    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        <Box p={2}>{children}</Box>
      </Typography>
    );
  }

  handleChange(ctx, index) {
    this.setState({value: index});
  }

  getTabs() {
    if (this.props.login) {
      return [
        (<Tab key="tab1" label="All bets" {...Transactions.a11yProps(0)} />),
        (<Tab key="tab2" label="My bets" {...Transactions.a11yProps(1)} />)
      ];
    }
    return (<Tab label="All bets" {...Transactions.a11yProps(0)} />);
  }

  getViews() {
    if (this.props.login) {

      return [
        (<this.TabPanel key="panel1" value={this.state.value} index={0}>
        <TransactionTable view={this.props.view.bind(this)}/>
      </this.TabPanel>),
      (<this.TabPanel key="panel2" value={this.state.value} index={1}>
          <TransactionTable view={this.props.view.bind(this)} login={this.props.login}
                            private={this.props.account.address}/>
        </this.TabPanel>)
      ];
    }
    return (<this.TabPanel key="panel1" value={this.state.value} index={0}>
      <TransactionTable view={this.props.view.bind(this)}/>
    </this.TabPanel>);
  }

  render() {
    return (
      <div className="Transactions-container">
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            {this.getTabs()}
          </Tabs>
        </AppBar>
        <div className="Tab-container">
          <SwipeableViews
            axis={'x'}
            index={this.state.value}
            onChangeIndex={this.handleChange.bind(this)}
          >
            {this.getViews()}
          </SwipeableViews>
        </div>
      </div>
    )
  }
}
