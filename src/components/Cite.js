import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        overflowX: 'auto',
        textAlign: "center",
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit*5,
        paddingRight: theme.spacing.unit*5
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
Modeling the Language of Life – Deep Learning Protein Sequences
                </pre>
                <pre>
Michael Heinzinger, Ahmed Elnaggar, Yu Wang, Christian Dallago, Dmitrii Nachaev, Florian Matthes, Burkhard Rost
                </pre>
                <pre>
bioRxiv 614313; DOI: <a href={"https://doi.org/10.1101/614313"}>https://doi.org/10.1101/614313</a>
                </pre>
            </Paper>
        );
    }
}

Cite.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cite);