import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        overflowX: 'auto',
        textAlign: "center",
        paddingBottom: theme.spacing.unit
    },
    underline: {
        textDecoration: "underline",
        cursor: "pointer"
    },
    title: {
        paddingTop: theme.spacing.unit
    },
    topSpace: {
        paddingTop: theme.spacing.unit*2,
        paddingBottom: theme.spacing.unit

    }
});

class Cite extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Typography className={classes.title} variant={"h6"}>
                    Cite
                </Typography>
                <pre>
                    SOMEPAPER
                </pre>
            </Paper>
        );
    }
}

Cite.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cite);