import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Typography, Button, TextField } from '@material-ui/core'
import { connect } from 'react-redux'
import { getAuth, getMailboxes, listConversations } from '../actions'
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
    startDate: '2019-05-01',
    endDate: '2019-06-01'
  }

  handleDates = (e) => {
    this.setState({
      startDate: '',
      endDate: ''
    })
  }

  componentDidMount() {
    this.props.loadAuth()
  }

  handleChange = (name) => event => {
    this.setState({
      ...this.state,
      [name]: event.target.value
    })
  }

  handleSubmit = () => {
    // TODO: Validation
    const { auth } = this.props
    const { startDate, endDate } = this.state
    const isoStartDate = new Date(startDate)
    const isoEndDate = new Date(endDate)
    const offset = new Date().getTimezoneOffset()

    let params = {
      mailbox: 79656,
      status: 'all',
      query: `(modifiedAt:[${isoStartDate.toISOString()} TO ${isoEndDate.toISOString()}])`
  }
    this.props.loadConversations(auth, params)
  }

  render() {
    const { classes, auth, helpscout } = this.props
    const { startDate, endDate } = this.state


    return (
      <div>
        <Paper className={classes.root} elevation={1}>
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
          <Button color="primary" variant="contained" onClick={this.handleSubmit}>Get Conversations</Button>
          {helpscout.conversations &&
            <div>
              <TicketTable/>
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

function mapStateToProps({ auth, helpscout }, ownProps) {
  return {
    auth,
    helpscout
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadAuth: () => dispatch(getAuth()),
    loadMailbox: (auth) => dispatch(getMailboxes(auth)),
    loadConversations: (auth, params) => dispatch(listConversations(auth, params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main))