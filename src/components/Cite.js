import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        overflowX: 'auto',
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit*5,
        paddingRight: theme.spacing.unit*5
    },
    underline: {
        textDecoration: "underline",
        cursor: "pointer"
    },
    title: {
        textAlign: "center",
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
                    Cite & Resources
                </Typography>
                <Typography variant={"body2"}>
                    bio_embeddings: python package & pipeline for embedding generation:
                </Typography>
                <Typography>
                    This package includes SeqVec and new language models. Prediction for supervised features (secondary structure and sub-cellular localization) are available. Soon, the pipeline will allow to calculate similarity-based predictions (e.g. GoPredSim). Link: <a href={"https://github.com/sacdallago/bio_embeddings"} target={"_blank"} ref={"author"}>https://github.com/sacdallago/bio_embeddings</a>.
                </Typography>
                <br/>
                <Typography variant={"body2"}>
                    GO annotations are predicted using GoPredSim:
                </Typography>
                <Typography>
                    <a href={"https://github.com/Rostlab/goPredSim"} target={"_blank"} ref={"author"}>https://github.com/Rostlab/goPredSim</a>
                </Typography>
                <br/>
                <Typography variant={"body2"}>
                    Embeddings & secondary structure & subcellular location predictions on this website are calculated using models presented in:
                </Typography>
                <Typography>
                    Heinzinger, M., Elnaggar, A., Wang, Y. et al. Modeling aspects of the language of life through transfer-learning protein sequences. BMC Bioinformatics 20, 723 (2019). <a target={"_blank"} ref={"author"} href={"https://doi.org/10.1186/s12859-019-3220-8"}>https://doi.org/10.1186/s12859-019-3220-8</a>
                </Typography>
            </Paper>
        );
    }
}

Cite.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cite);