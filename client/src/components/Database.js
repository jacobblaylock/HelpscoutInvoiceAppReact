import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { testDbConnection, postThreads } from '../actions'

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


class Database extends Component {

  componentDidMount() {
    this.props.testDbConn()
  }

  handleDbConnectionTest = () => {
    this.props.testDbConn()
  }

  handleTickets = () => {
    const { helpscout } = this.props
    this.props.importTickets(helpscout.conversations.map(c => {
      let threads = helpscout.threads[c.id]
      return { ...c, threads: threads }
    }))
  }

  render() {
    const { helpscout, dbConnection, dbResponseDetails } = this.props

    return (
      <div>
        {dbConnection.connected
          ? <Button color="primary" variant="contained" onClick={this.handleTickets}>Post Tickets to OsTicket</Button>
          : <div>
            <p>Connection to OsTicket Database failed.  Verify the IP address is whitelisted on BlueHost</p>
            <p>{dbConnection.message}</p>
            <Button color="primary" variant="contained" onClick={this.handleDbConnectionTest}>Test Database Connection</Button>
          </div>}
        {helpscout.dbResponse &&
          <div>
            <div>Successful Imports:  {dbResponseDetails.successes}</div>
            <div>Failed Imports: {dbResponseDetails.errors.count}</div>
            {dbResponseDetails.errors.count > 0 &&
              <div>JSON.stringify(dbResponseDetails.errors.details)</div>}
          </div>
        }
      </div>
    )
  }
}

Database.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps({ helpscout, dbConnection }) {
  let dbResponseDetails = []
  if (helpscout.dbResponse) {
    dbResponseDetails = helpscout.dbResponse.reduce((acc, cur) => {
      if (cur.affectedRows === 1 && cur.warningCount === 0 && cur.message === '') {
        acc.successes++
      } else {
        acc.errors.count++
        acc.errors.details.push({
          ticketNumber: cur.ticketNumber,
          errorMessage: cur.message
        })
      }
      return acc
    }, { successes: 0, errors: { count: 0, details: [] } })
  }

  return {
    helpscout,
    dbConnection,
    dbResponseDetails
  }
}

function mapDispatchToProps(dispatch) {
  return {
    testDbConn: () => dispatch(testDbConnection()),
    importTickets: (conversations) => dispatch(postThreads(conversations))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Database))