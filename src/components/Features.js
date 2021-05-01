import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import storeComponentWrapper from '../stores/jobDispatcher';
import { proteinStatus } from "../stores/JobParameters";
import classnames from 'classnames';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import SequenceHighlighter from "./SequenceHighlighter";
import {proteinColorSchemes} from "../utils/Graphics";
import Typography from "@material-ui/core/Typography/Typography";
import FeatureViewer from './FeatureViewer/FeatureViewer';
import FeatureGrabber from "./FeatureGrabber";
import {resultStatus} from "../stores/JobResults";

// subcell location images
import nucleus from "../assets/nucleus.PNG";
import mitochondrion from "../assets/mitochondrion.PNG";
import cytoplasm from "../assets/cytoplasm.PNG";
import plasmaMembrane from "../assets/plasmaMembrane.PNG";
import endoplasmicReticulum from "../assets/endoplasmicReticulum.PNG";
import golgiApparatus from "../assets/golgiApparatus.PNG";
import vacuole from "../assets/vacuole.PNG";
import peroxisome from "../assets/peroxisome.PNG";
import plastid from "../assets/plastid.PNG";
import secreted from "../assets/secreted.PNG";


const styles = theme => ({
    paper: {
        overflowX: 'auto',
        textAlign: "center",
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    constrainedPaper: {
        textAlign: "center",
        paddingTop: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
    text: {
        width: "max-content",
        margin: "auto",
    },
    titles: {
        minWidth: "12em"
    },
    expansionPanels: {
        minWidth: "18em",
    },
    sequenceHighlighter: {
        margin: 'auto',
        paddingTop: theme.spacing.unit,
        paddingLeft: theme.spacing.unit*3,
        paddingRight: theme.spacing.unit*3,
        paddingBottom: theme.spacing.unit,
    },
    filler: {
        backgroundColor: "#ededed",
        color: "#ededed"
    }
});

const locations_mapping = {
    "Cytoplasm": cytoplasm,
    "Cell-Membrane": plasmaMembrane,
    "Endoplasmic reticulum'": endoplasmicReticulum,
    "Golgi - Apparatus": golgiApparatus,
    "Lysosome / Vacuole": vacuole,
    "Mitochondrion": mitochondrion,
    "Nucleus": nucleus,
    "Peroxisome": peroxisome,
    "Plastid": plastid,
    "Extra - cellular": secreted,
}

const placeholder = {
    sequence: "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    predictedSubcellularLocalizations: " ",
    predictedMembrane: " ",

    predictedBPO:{},
    predictedBPOGraphDataString: "",
    predictedCCO:{},
    predictedCCOGraphDataString: "",
    predictedMFO:{},
    predictedMFOGraphDataString: "",

    predictedDSSP3: " ",
    predictedDSSP8: " ",
    predictedDisorder: " ",
};


class Features extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            proteinStatus: this.props.jobParameters.proteinStatus || proteinStatus.NULL,
            embedder: this.props.jobParameters.embedder || "seqvec",
            sequence: null,
            features: null,
            loading: null
        };
    }

    setFeatures = (embedder, results) => {
        if (embedder !== "best") {
            return this.setState({
                loading: results[embedder].status !== resultStatus.DONE,
                features: results[embedder]
            });
        }

        // Base off of ProtT5
        let features = {...results['prottrans_t5_xl_u50']};

        // GoPredSim from SeqVec
        features['predictedBPO'] = results['seqvec']['predictedBPO'];
        features['predictedBPOGraphDataString'] = results['seqvec']['predictedBPOGraphDataString'];
        features['predictedCCO'] = results['seqvec']['predictedCCO'];
        features['predictedCCOGraphDataString'] = results['seqvec']['predictedCCOGraphDataString'];
        features['predictedMFO'] = results['seqvec']['predictedMFO'];
        features['predictedMFOGraphDataString'] = results['seqvec']['predictedMFOGraphDataString'];

        // Secondary structure from ProtBert
        features['predictedDSSP3'] = results['prottrans_bert_bfd']['predictedDSSP3'];
        features['predictedDSSP8'] = results['prottrans_bert_bfd']['predictedDSSP8'];
        features['predictedDisorder'] = results['prottrans_bert_bfd']['predictedDisorder'];

        return this.setState({
            loading: (
                results['seqvec'].status !== resultStatus.DONE &&
                results['prottrans_bert_bfd'].status !== resultStatus.DONE &&
                results['prottrans_t5_xl_u50'].status !== resultStatus.DONE
            ),
            features: features
        });
    };

    componentWillReceiveProps(nextProps) {
        let jobParameters = nextProps.jobParameters;
        let jobResults = nextProps.jobResults;

        this.setState({
            proteinStatus: jobParameters.proteinStatus,
            sequence: jobParameters.protein && jobParameters.protein.sequence,
            embedder: jobParameters.embedder,
            loading: true
        }, () => {
            this.setFeatures(jobParameters.embedder, jobResults)
        });
    }

    render() {
        const { classes } = this.props;

        let features = this.state.loading || this.state.features === null ? placeholder : this.state.features;

        let filler = this.state.loading || this.state.features === null;

        return ( <div>
                {this.state.loading !== null &&
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper} elevation={2}>
                            <Typography className={classnames(classes.text, classes.titles, filler ? "animated-background" : null)} variant={"h6"}>
                                Your sequence
                            </Typography>
                            <br/>
                            <div className={classes.sequenceHighlighter}>
                                <SequenceHighlighter string={this.state.loading || this.state.sequence === null ? placeholder.sequence : this.state.sequence} proteinColorScheme={proteinColorSchemes['mview']}/>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper} elevation={2}>
                            <Grid container spacing={0}>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper} elevation={0}>
                                        <Typography className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)} variant={"h6"}>
                                            Protein-level features
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper} elevation={0}>
                                        <Typography className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)} variant={"h7"}>
                                            Via machine learning {
                                            (this.state.embedder === "prottrans_t5_xl_u50" || this.state.embedder === "prottrans_bert_bfd" || this.state.embedder === "best") &&
                                            " (using Light Attention)"
                                        }
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <img src={locations_mapping[features.predictedSubcellularLocalizations]} alt="Subcell Location" height={300}/>
                                </Grid>
                                <Grid item md={6} xl={6} xs={12}>
                                    <Paper className={classes.paper} elevation={0}>
                                        <Typography className={classnames(classes.text, filler ? "animated-background" : null)} variant={"caption"}>
                                            Subcellular location
                                        </Typography>
                                        <br/>
                                        <Typography className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)} variant={"h6"}>
                                            {features.predictedSubcellularLocalizations}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item md={6} xl={6} xs={12}>
                                    <Paper className={classes.paper} elevation={0}>
                                        <Typography className={classnames(classes.text, filler ? "animated-background" : null)} variant={"caption"}>
                                            Membrane bound
                                        </Typography>
                                        <br/>
                                        <Typography className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)} variant={"h6"}>
                                            {features.predictedMembrane}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                {Object.keys(features.predictedBPO).length > 0 && Object.keys(features.predictedMFO).length > 0 && Object.keys(features.predictedCCO).length > 0 &&
                                <Grid item xs={12}>
                                    <Paper className={classes.paper} elevation={0}>
                                        <Typography className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)} variant={"h7"}>
                                            Via embedding similarity (GoPredSim)
                                        </Typography>
                                    </Paper>
                                </Grid>}
                                {Object.keys(features.predictedBPO).length > 0 &&
                                <Grid item md={6} xl={6} xs={12}>
                                    <Paper className={classes.paper} elevation={0}>
                                        <Typography
                                            className={classnames(classes.text, filler ? "animated-background" : null)}
                                            variant={"caption"}>
                                            Biological process (BPO)
                                        </Typography>
                                        <br/>
                                        <Typography
                                            className={classnames(classes.text, filler ? "animated-background" : null)}
                                            variant={"body"}>
                                            {features.predictedBPOGraphDataString !== "" &&
                                            <a target="_blank"
                                               href={"http://amigo.geneontology.org/visualize?inline=false&format=png&mode=amigo&term_data_type=json&term_data=" + features.predictedBPOGraphDataString}>Open
                                                Graph</a>}
                                        </Typography>
                                        <br/>
                                        <table
                                            className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)}>
                                            <tr>
                                                <th>GO Term</th>
                                                <th>Reliability Index</th>
                                            </tr>
                                            {Object.keys(features.predictedBPO).map(e => <tr key={e}>
                                                <td><a href={"http://amigo.geneontology.org/amigo/term/" + e}
                                                       target={"_blank"}>{e}</a></td>
                                                <td>{features.predictedBPO[e].toFixed(2)}</td>
                                            </tr>)}
                                        </table>
                                    </Paper>
                                </Grid>
                                }
                                {Object.keys(features.predictedMFO).length > 0 &&
                                <Grid item md={6} xl={6} xs={12}>
                                    <Paper className={classes.paper} elevation={0}>
                                        <Typography
                                            className={classnames(classes.text, filler ? "animated-background" : null)}
                                            variant={"caption"}>
                                            Molecular function (MFO)
                                        </Typography>
                                        <br/>
                                        <Typography
                                            className={classnames(classes.text, filler ? "animated-background" : null)}
                                            variant={"body"}>
                                            {features.predictedMFOGraphDataString !== "" &&
                                            <a target="_blank"
                                               href={"http://amigo.geneontology.org/visualize?inline=false&format=png&mode=amigo&term_data_type=json&term_data=" + features.predictedMFOGraphDataString}>Open
                                                Graph</a>}
                                        </Typography>
                                        <br/>
                                        <table
                                            className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)}>
                                            <tr>
                                                <th>GO Term</th>
                                                <th>Reliability Index</th>
                                            </tr>
                                            {Object.keys(features.predictedMFO).map(e => <tr key={e}>
                                                <td><a href={"http://amigo.geneontology.org/amigo/term/" + e}
                                                       target={"_blank"}>{e}</a></td>
                                                <td>{features.predictedMFO[e].toFixed(2)}</td>
                                            </tr>)}
                                        </table>
                                    </Paper>
                                </Grid>
                                }
                                {Object.keys(features.predictedCCO).length > 0 &&
                                <Grid item md={6} xl={6} xs={12}>
                                    <Paper className={classes.paper} elevation={0}>
                                        <Typography
                                            className={classnames(classes.text, filler ? "animated-background" : null)}
                                            variant={"caption"}>
                                            Cellular Component (CCO)
                                        </Typography>
                                        <br/>
                                        <Typography
                                            className={classnames(classes.text, filler ? "animated-background" : null)}
                                            variant={"body"}>
                                            {features.predictedCCOGraphDataString !== "" &&
                                            <a target="_blank"
                                               href={"http://amigo.geneontology.org/visualize?inline=false&format=png&mode=amigo&term_data_type=json&term_data=" + features.predictedCCOGraphDataString}>Open
                                                Graph</a>}
                                        </Typography>
                                        <br/>
                                        <table
                                            className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)}>
                                            <tr>
                                                <th>GO Term</th>
                                                <th>Reliability Index</th>
                                            </tr>
                                            {Object.keys(features.predictedCCO).map(e => <tr key={e}>
                                                <td><a href={"http://amigo.geneontology.org/amigo/term/" + e}
                                                       target={"_blank"}>{e}</a></td>
                                                <td>{features.predictedCCO[e].toFixed(2)}</td>
                                            </tr>)}
                                        </table>
                                    </Paper>
                                </Grid>
                                }
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper} elevation={2}>
                            <Paper className={classes.paper} elevation={0}>
                                <Typography className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)} variant={"h6"}>
                                    Residue-level features
                                </Typography>
                            </Paper>
                            <FeatureViewer data={this.state.features}/>
                        </Paper>
                        {features.predictedDSSP3 && (
                            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography className={classnames(classes.text, filler ? classes.expansionPanels : null, filler ? "animated-background" : null)}>
                                        Secondary structure in three states (DSSP3)
                                    </Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <SequenceHighlighter string={features.predictedDSSP3} proteinColorScheme={proteinColorSchemes['dssp8']}/>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        )}
                        {features.predictedDSSP8 &&
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
                                <Typography
                                    className={classnames(classes.text, filler ? classes.expansionPanels : null, filler ? "animated-background" : null)}>
                                    Secondary structure in eight states (DSSP8)
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <SequenceHighlighter string={features.predictedDSSP8}
                                                     proteinColorScheme={proteinColorSchemes['dssp8']}/>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        }
                        {features.predictedDisorder &&
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classnames(classes.text, filler ? classes.expansionPanels : null, filler ? "animated-background" : null)}>
                                    Disorder prediction
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <SequenceHighlighter string={features.predictedDisorder} proteinColorScheme={proteinColorSchemes['disorder']}/>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        }
                    </Grid>
                </Grid>
                }
                <FeatureGrabber/>
            </div>
        );
    }
}

Features.propTypes = {
    classes: PropTypes.object.isRequired,
    jobParameters: PropTypes.object,
    jobResults: PropTypes.object
};

export default storeComponentWrapper(withStyles(styles)(Features));