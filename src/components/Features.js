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

const styles = theme => ({
    paper: {
        overflowX: 'auto',
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

const ULR = "http://localhost:5000/features";

const placeholder = {
    sequence: "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    predictedSubcellularLocalizations: "++++++++++++++",
    predictedMembrane: "++++++++++++",
    predictedDSSP3: "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    predictedDSSP8: "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
    predictedDisorder: "+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
};


class Features extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            proteinStatus: this.props.jobParameters.proteinStatus || proteinStatus.NULL,
            sequence: null,
            features: null,
            loading: null
        };
    }

    getFeatures = (sequence) => {
        this.setState({
            loading: true
        }, () => {
            fetch(ULR, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, cors, *same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                    "Content-Type": "application/json",
                },
                redirect: "follow", // manual, *follow, error
                referrer: "no-referrer", // no-referrer, *client
                body: JSON.stringify({
                    "sequence": sequence
                }), // body data type must match "Content-Type" header
            })
                .then(response => response.json())
                .then(json => {
                    this.setState({
                        features: json,
                        loading: false
                    })
                })
                .catch(e => {
                    console.error(e);
                    this.setState({
                        loading: false
                    })
                })
            ;
        });
    };

    componentWillReceiveProps(nextProps) {
        let jobParameters = nextProps.jobParameters;

        switch (jobParameters.proteinStatus) {
            case proteinStatus.UNIPROT:
            case proteinStatus.AA:
            case proteinStatus.FASTA:
            case proteinStatus.MULTIPLESEQUENCES:
                this.getFeatures(jobParameters.protein.sequence);
                break;
            case proteinStatus.LOADING:
            case proteinStatus.INVALID:
            default:
            // do nothing
        }

        this.setState({
            proteinStatus: jobParameters.proteinStatus,
            sequence: jobParameters.protein && jobParameters.protein.sequence
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
                                            Global predicted features
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item md={6} xl={6} xs={12}>
                                    <Paper className={classes.paper} elevation={0}>
                                        <Typography className={classnames(classes.text, filler ? "animated-background" : null)} variant={"caption"}>
                                            Sub-cellular location
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
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.paper} elevation={2}>
                            <Paper className={classes.paper} elevation={0}>
                                <Typography className={classnames(classes.text, filler ? classes.titles : null, filler ? "animated-background" : null)} variant={"h6"}>
                                    Amino-acid predicted features
                                </Typography>
                            </Paper>
                            <FeatureViewer data={this.state.features}/>
                        </Paper>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classnames(classes.text, filler ? classes.expansionPanels : null, filler ? "animated-background" : null)}>
                                    Secondary structure prediction (DSSP8)
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <SequenceHighlighter string={features.predictedDSSP8} proteinColorScheme={proteinColorSchemes['dssp8']}/>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className={classnames(classes.text, filler ? classes.expansionPanels : null, filler ? "animated-background" : null)}>
                                    Secondary structure prediction (DSSP3)
                                </Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <SequenceHighlighter string={features.predictedDSSP3} proteinColorScheme={proteinColorSchemes['dssp8']}/>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
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
                    </Grid>
                </Grid>
                }
            </div>
        );
    }
}

Features.propTypes = {
    classes: PropTypes.object.isRequired,
    jobParameters: PropTypes.object
};

export default storeComponentWrapper(withStyles(styles)(Features));