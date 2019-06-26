import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Button, TextField } from '@material-ui/core'
import { connect } from 'react-redux'
import { getMailboxes, listConversations, getThreads, postThreads, testDbConnection } from '../actions'
import TicketTable from '../components/TicketTable'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});


class Main extends Component {
  state = {
    startDate: '2019-06-03',
    endDate: '2019-07-01'
  }

  handleDates = (e) => {
    this.setState({
      startDate: '',
      endDate: ''
    })
  }

  componentDidMount() {
    this.props.testDbConn()
  }

  handleChange = (name) => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value
    })
  }

  handleSubmit = () => {
    // TODO: Validation
    const { startDate, endDate } = this.state
    const isoStartDate = new Date(startDate)
    const isoEndDate = new Date(endDate)

    let params = {
      mailbox: 79656,
      status: 'all',
      // query: `(modifiedAt:[${isoStartDate.toISOString()} TO ${isoEndDate.toISOString()}])`
      number: 35136
    }
    this.props.loadConversations(params)
  }

  handleMailbox = () => {
    this.props.loadMailbox()
  }

  handleThreads = () => {
    const { helpscout } = this.props
    // Get list of thread links
    let links = helpscout.conversations.map(convo => convo.threadLink)
    this.props.loadThreads(links)
  }

  handleTickets = () => {
    const { helpscout } = this.props
    this.props.importTickets(helpscout.conversations.map(c => {
      let threads = helpscout.threads[c.id]
      return { ...c, threads: threads }
    }))
  }

  handleDbConnectionTest = () => {
    this.props.testDbConn()
  }

  render() {
    const { classes, helpscout, dbConnection } = this.props
    const { startDate, endDate } = this.state


    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          {/* <Button color="primary" variant="contained" onClick={this.handleMailbox}>Get Mailbox Details</Button> */}
          {helpscout.mailboxes &&
            <div>
              {JSON.stringify(helpscout.mailboxes)}
            </div>
          }
          <form className={classes.container} noValidate>
            <TextField
              id="date"
              label="Start Date"
              type="date"
              value={startDate}
              onChange={this.handleChange('startDate')}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              id="date"
              label="End Date"
              type="date"
              value={endDate}
              onChange={this.handleChange('endDate')}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
          <br />
          <Button color="primary" variant="contained" onClick={this.handleSubmit}>Get Tickets</Button>
          {helpscout.conversations &&
            <div>
              <br />
              <TicketTable />
              <br />
              <Button color="primary" variant="contained" onClick={this.handleThreads}>Get Ticket Details</Button>
              <br />
            </div>
          }
          {helpscout.threads &&
            <div>
              <br />
              {dbConnection.connected
                ? <Button color="primary" variant="contained" onClick={this.handleTickets}>Post Tickets to OsTicket</Button>
                : <div>
                    <p>Connection to OsTicket Database failed.  Verify the IP address is whitelisted on BlueHost</p>
                    <p>{dbConnection.message}</p>
                    <Button color="primary" variant="contained" onClick={this.handleDbConnectionTest}>Test Database Connection</Button>
                  </div>}
            </div>
          }
        </Paper>
      </div>
    )
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ helpscout, dbConnection }) {
  return {
    helpscout,
    dbConnection
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadMailbox: () => dispatch(getMailboxes()),
    loadConversations: (params) => dispatch(listConversations(params)),
    loadThreads: (links) => dispatch(getThreads(links)),
    importTickets: (conversations) => dispatch(postThreads(conversations)),
    testDbConn: () => dispatch(testDbConnection())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main))