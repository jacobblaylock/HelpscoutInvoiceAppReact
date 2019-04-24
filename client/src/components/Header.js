import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core'

const styles = {
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginLeft: -12,
      marginRight: 20,
    },
  };

class Header extends Component {

    state = {
        login: false,
        helpscoutConfig: { hi: "Hello"}
    }

    handleLogin = event => {
        console.log('logging in')
        fetch('/auth/example')
        .then(results => results.json())
        .then(data => {
            this.setState({ 
                login: true, 
                helpscoutConfig: data 
            })
            
        })
    }

    render() {
        const { classes } = this.props
        return (
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            Gestalt Diagnostics Helpscout Invoice Import
                        </Typography>
                        <Button color="inherit" onClick={this.handleLogin}>Login via Helpscout</Button>
                    </Toolbar>
                </AppBar>
                <p>{JSON.stringify(this.state.helpscoutConfig)}</p>
            </div>
        )
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Header)