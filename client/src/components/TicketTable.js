import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
})

const billableHoursId = 1240

class SimpleTable extends Component {


    render() {
        const { classes, stats } = this.props
        console.log(JSON.stringify(stats))

        return (
            <div>
                <h2>Ticket Snapshot</h2>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>User</TableCell>
                            <TableCell>Tickets</TableCell>
                            <TableCell>Billable Hours</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats.map(s => (
                            <TableRow key={s.user}>
                                <TableCell>{s.user}</TableCell>
                                <TableCell>{s.tickets}</TableCell>
                                <TableCell>{s.hours}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
}

function mapStateToProps({ helpscout }, ownProps) {
    return {
        stats: helpscout.conversations.reduce((acc, cur) => {
            let user = cur.assignee ? cur.assignee.first + ' ' + cur.assignee.last : 'unassigned'
            let i = acc.findIndex(a => a.user === user)
            let hours = cur.customFields.find(f => f.id === billableHoursId) ? cur.customFields.find(f => f.id === billableHoursId).value : 0
            if (hours === '') hours = 0
            console.log(hours)

            if (i > -1) {
                acc[i].tickets = acc[i].tickets + 1
                acc[i].hours = (parseFloat(acc[i].hours) + parseFloat(hours)).toFixed(2)
            } else {
                acc.push({
                    user,
                    tickets: 1,
                    hours: parseFloat(hours).toFixed(2)
                })
            }
            return acc
        }, [])
    }
}

export default connect(mapStateToProps)(withStyles(styles)(SimpleTable))
