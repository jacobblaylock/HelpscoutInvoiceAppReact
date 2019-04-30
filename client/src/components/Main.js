import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Typography, Button } from '@material-ui/core'
import { connect } from 'react-redux'
import { getAuth, getMailboxes, listConversations } from '../actions'



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
});


class Main extends Component {

  componentDidMount() {
    this.props.loadAuth()
  }

  render() {
    console.log(this.props)
    const { classes } = this.props
    const { auth } = this.props    

    return (
      <div>
        <Paper className={classes.root} elevation={1}>
          <Typography variant="h5" component="h3">
            This is a sheet of paper.
          </Typography>
          <Typography component="p">
            Here is the accessToken:  {JSON.stringify(auth)}
          </Typography>
          <Button color="primary" variant="contained" onClick={() => this.props.loadMailbox(auth)}>Get Mailbox</Button>         
          <Typography component="p">
            Here is the Mailbox Data:  {JSON.stringify(this.props.helpscout.mailboxes)}
          </Typography>
          <Button color="primary" variant="contained" onClick={() => this.props.loadConversations(auth)}>Get Conversations</Button>   
          <Typography>
            Here is the Conversation Data: {JSON.stringify(this.props.helpscout.conversations)}
          </Typography>
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
    loadConversations: (auth) => dispatch(listConversations(auth))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Main))