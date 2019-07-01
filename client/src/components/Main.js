import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Paper, Button, TextField } from '@material-ui/core'
import { connect } from 'react-redux'
import { getMailboxes, listConversations, getThreads } from '../actions'
import TicketTable from '../components/TicketTable'
import Database from '../components/Database'

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
  progress: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    width: '50%'
  }
});



class Main extends Component {
  state = {
    startDate: '2019-06-03',
    endDate: '2019-07-01',
    conversationButtonDisabled: false,
    threadButtonDisabled: false
  }

  handleDates = (e) => {
    this.setState({
      startDate: '',
      endDate: ''
    })
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
      query: `(modifiedAt:[${isoStartDate.toISOString()} TO ${isoEndDate.toISOString()}])`
      // number: 35671
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

  render() {
    const { classes, helpscout, conversationButtonDisabled, threadButtonDisabled } = this.props
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
          <Button disabled={conversationButtonDisabled} color="primary" variant="contained" onClick={this.handleSubmit}>Get Tickets</Button>
          {helpscout.loadingConversations &&
            <div>
              {(helpscout.loadingConversations.loaded && helpscout.conversations)
                ?
                <div>
                  <br />
                  <TicketTable />
                  <br />
                  <Button disabled={threadButtonDisabled} color="primary" variant="contained" onClick={this.handleThreads}>Get Ticket Details</Button>
                  <br />
                </div>
                :
                <div>
                  <CircularProgress className={classes.progress} />
                  <br />
                </div>
              }

            </div>
          }
          {helpscout.loadingThreads &&
            <div>
              <br />
              {helpscout.loadingThreads.loaded
                ?
                <Database />
                :
                <div>
                  <CircularProgress className={classes.progress} />
                  <br />
                  Loading {helpscout.loadingThreads.count} tickets.  Helpscout throttles API requests at 400 per minute, so this may take up to 1 minute for every 400 tickets.
                </div>
              }
            </div>
          }
        </Paper>
      </div >
    )
  }
}

Main.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ helpscout, dbConnection }) {
  let conversationButtonDisabled = false
  let threadButtonDisabled = false

  if (helpscout.loadingConversations) {
    conversationButtonDisabled = helpscout.loadingConversations.loaded === false ? true : false
  }
  if (helpscout.loadingThreads) {
    threadButtonDisabled = helpscout.loadingThreads.loaded === false ? true : false
  }
  return {
    helpscout,
    conversationButtonDisabled,
    threadButtonDisabled
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadMailbox: () => dispatch(getMailboxes()),
    loadConversations: (params) => dispatch(listConversations(params)),
    loadThreads: (links) => dispatch(getThreads(links))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main))