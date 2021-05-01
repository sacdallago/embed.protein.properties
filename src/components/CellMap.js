import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
});



class CellMap extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>

            </Paper>
        );
    }
}

CellMap.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CellMap);