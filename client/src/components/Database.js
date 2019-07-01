import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
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
  progress: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block',
    width: '50%'
  }
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
    this.props.importTickets(helpscout.conversations.filter(c => c.status === 'closed')
      .map(c => {
        let threads = helpscout.threads[c.id]
        return { ...c, threads: threads }
      }))
  }

  render() {
    const { classes, helpscout, dbConnection, dbResponseDetails, testingButtonDisabled, postButtonDisabled } = this.props

    return (
      <div>
        {dbConnection.connected
          ? <div>
              <Button disabled={postButtonDisabled} color="primary" variant="contained" onClick={this.handleTickets}>Post Tickets to OsTicket</Button>
              {postButtonDisabled && <CircularProgress className={classes.progress} />}
            </div>
          : <div>
            {testingButtonDisabled
              ? <CircularProgress className={classes.progress} />
              :
              <div>
                <p>Connection to OsTicket Database failed.  Verify the IP address is whitelisted on BlueHost</p>
                <p>{dbConnection.message}</p>
              </div>
            }
            <Button disabled={testingButtonDisabled} color="secondary" variant="contained" onClick={this.handleDbConnectionTest}>Test Database Connection</Button>
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
        console.log(cur)
        acc.errors.count++
        acc.errors.details.push({
          ticketNumber: cur.ticketNumber,
          errorMessage: cur.message
        })
      }
      return acc
    }, { successes: 0, errors: { count: 0, details: [] } })
  }

  let testingButtonDisabled = dbConnection.testing === true ? true : false
  let postButtonDisabled = dbConnection.loading === true ? true : false

  return {
    helpscout,
    dbConnection,
    dbResponseDetails,
    testingButtonDisabled,
    postButtonDisabled
  }
}

function mapDispatchToProps(dispatch) {
  return {
    testDbConn: () => dispatch(testDbConnection()),
    importTickets: (conversations) => dispatch(postThreads(conversations))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Database))