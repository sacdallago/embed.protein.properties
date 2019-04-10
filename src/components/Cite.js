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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ultrices neque eget lorem commodo, quis feugiat mi finibus. Fusce blandit porttitor porta. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed erat arcu, consectetur id ornare et, eleifend id urna. Integer accumsan fermentum nibh, ut rutrum purus lobortis quis. Aliquam iaculis mauris id viverra rutrum. Mauris lacinia mi dui, at tempus purus vestibulum sit amet. Morbi malesuada id neque et imperdiet. Nullam non urna sit amet urna efficitur volutpat vitae vel nisi. Suspendisse potenti. Aenean volutpat sagittis quam, at gravida purus accumsan et. Morbi cursus sodales pulvinar. Phasellus id odio in neque condimentum ullamcorper. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin euismod, ex fermentum tempus pretium, leo leo sodales risus, et lobortis nibh lectus a nunc. Duis erat ligula, porta vitae dui ut, lacinia consequat ex.
                </pre>
            </Paper>
        );
    }
}

Cite.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cite);