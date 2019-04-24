import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Typography, Button } from '@material-ui/core'



const styles = theme => ({
    root: {
      ...theme.mixins.gutters(),
      paddingTop: theme.spacing.unit * 2,
      paddingBottom: theme.spacing.unit * 2,
    },
  });


class Main extends Component {
    constructor(props) {
      super(props)
      this.state = {
        accessToken: null
      }
    }

    componentDidMount() {
      fetch('/api/accessToken')
        .then(response => response.json())
        .then(data => this.setState({ accessToken: data}))
    }

    render() {
        const { classes } = this.props
        return (
            <div>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="h5" component="h3">
                    This is a sheet of paper.
                    </Typography>
                    <Typography component="p">
                    Here is the accessToken:  {JSON.stringify(this.state.accessToken)}
                    </Typography>
                </Paper>
            </div>
        )
    }
}

Main.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Main)