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
                    This package includes the webserver serving this site, as well as scripts and pipelines to compute predictions for your sequences offline & in batch. Link: <a href={"https://github.com/sacdallago/bio_embeddings"} target={"_blank"} ref={"author"}>https://github.com/sacdallago/bio_embeddings</a>.
                    <br/>
                    <br/>
                    Dallago, C. Schütze, K. Heinzinger, M. Olenyi, T. Littmann, M. Lu, A. X. Yang, K. K. Min, S. Yoon, S. Morton, J. T. Rost, B. Learned Embeddings from Deep Learning to Visualize and Predict Protein Sets. Current Protocols in Bioinformatics 2021. <a target={"_blank"} ref={"author"} href={"https://doi.org/10.1002/cpz1.113"}>10.1002/cpz1.113</a>
                </Typography>
                <br/>
                <Typography variant={"body2"}>
                    Subcellular location and membrane permeability for ProtBert and ProtT5 calculated via Light Attention:
                </Typography>
                <Typography>
                    Staerk, H., Dallago, C., Heinzinger, M., & Rost, B. (2021). Light Attention Predicts Protein Location from the Language of Life. bioRxiv. <a target={"_blank"} ref={"author"} href={"https://doi.org/10.1101/2021.04.25.441334"}>10.1101/2021.04.25.441334</a>
                </Typography>
                <br/>
                <Typography variant={"body2"}>
                    GO annotations are predicted using GoPredSim:
                </Typography>
                <Typography>
                    We transfer annotations from proteins with known GO terms to query sequences via embedding distance.
                    To do so, we embed all sequences in a lookup database of proteins with known GO annotations as well as the given query sequence via SeqVec (see below) and calculate Euclidean distances between all embeddings.
                    We then pick the closest annotated embedding to the query sequence embedding.
                    Lastly, we convert the Euclidean distance to a Reliability Index (RI) ranging from 0 (weak prediction) to 1 (confident prediction). Our observations suggest that RI values above 0.35 for BPO, 0.28 for MFO, and 0.29 CCO lead to reliable results.
                    <br/>
                    <br/>
                    Littmann, M., Heinzinger, M., Dallago, C. et al. Embeddings from deep learning transfer GO annotations beyond homology. Sci Rep 11, 1160 (2021). <a target={"_blank"} ref={"author"} href={"https://doi.org/10.1038/s41598-020-80786-0"}>10.1038/s41598-020-80786-0</a>
                    <br/>
                    Code: <a href={"https://github.com/Rostlab/goPredSim"} target={"_blank"} ref={"author"}>https://github.com/Rostlab/goPredSim</a>
                </Typography>
                <br/>
                <Typography variant={"body2"}>
                    Embeddings & secondary structure & subcellular location predictions on this website are calculated using models presented in:
                </Typography>
                <Typography>
                    Heinzinger, M., Elnaggar, A., Wang, Y. et al. Modeling aspects of the language of life through transfer-learning protein sequences. BMC Bioinformatics 20, 723 (2019). <a target={"_blank"} ref={"author"} href={"https://doi.org/10.1186/s12859-019-3220-8"}>10.1186/s12859-019-3220-8</a>
                </Typography>
                <br/>
                <Typography>
                     Elnaggar, A., Heinzinger, M., Dallago, C., et al. ProtTrans: Towards Cracking the Language of Life's Code Through Self-Supervised Deep Learning and High Performance Computing. Arxiv (2020). <a target={"_blank"} ref={"author"} href={"https://arxiv.org/abs/2007.06225"}>https://arxiv.org/abs/2007.06225</a>
                </Typography>
            </Paper>
        );
    }
}

Cite.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Cite);