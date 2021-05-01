import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import nucleus from '../assets/nucleus.PNG';

const styles = theme => ({
    root: {
        overflowX: 'auto',
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit*5,
        paddingRight: theme.spacing.unit*5
    },
});

class Cite extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <img src={nucleus} alt="Logo" />
        );
    }
}

Cite.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cite);