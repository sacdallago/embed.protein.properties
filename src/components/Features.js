import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import storeComponentWrapper from '../stores/jobDispatcher';
import { proteinStatus } from "../stores/JobParameters";
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import SequenceHighlighter from "./SequenceHighlighter";
import {proteinColorSchemes} from "../utils/Graphics";
import Typography from "@material-ui/core/Typography/Typography";

const styles = theme => ({
    root: {
        overflowX: 'auto',
        textAlign: "center",
        paddingBottom: theme.spacing.unit
    },
});

const ULR = "http://localhost:5000/features";


class Features extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            proteinStatus: this.props.jobParameters.proteinStatus || proteinStatus.NULL,
            sequence: "MALLHSARVLSGVASAFHPGLAAAASARASSWWAHVEMGPPDPILGVTEAYKRDTNSKKMNLGVGAYRDDNGKPYVLPSVRKAEAQIAAKGLDKEYLPIGGLAEFCRASAELALGENSEVVKSGRFVTVQTISGTGALRIGASFLQRFFKFSRDVFLPKPSWGNHTPIFRDAGMQLQSYRYYDPKTCGFDFTGALEDISKIPEQSVLLLHACAHNPTGVDPRPEQWKEIATVVKKRNLFAFFDMAYQGFASGDGDKDAWAVRHFIEQGINVCLCQSYAKNMGLYGERVGAFTVICKDADEAKRVESQLKILIRPMYSNPPIHGARIASTILTSPDLRKQWLQEVKGMADRIIGMRTQLVSNLKKEGSTHSWQHITDQIGMFCFTGLKPEQVERLTKEFSIYMTKDGRISVAGVTSGNVGYLAHAIHQVTK",
            features: {
                "predictedSubcellularLocalizations": "Mitochondrion",
                "predictedMembrane": "Soluble",
                "predictedDSSP3": "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCHHHHCCCCCCCCHHHHHHHHHHCCCCCCEECCCCCECCCCCCECCCHHHHHHHHHHHHCCCCCCCCCCCCCHHHHHHHHHHHHCCCCHHCCCCCEEEEEECCHHHHHHHHHHHHHHHHCCCCEEEEECCCCCCHHHHHHHHCCEEEEEEECCCCCCCECHHHHHHHHHHCCCCCEEEEEECCCCCCCCCCCHHHHHHHHHHHHHCCCEEEEECCCCCCCCCCCCCCHHHHHHHHHHCCCEEEEEECCCCCCCCCCCCCEEEEEECCHHHHHHHHHHHHHHCCCCCCCCHHHHHHHHHHHHCCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHCCCCCCCHHHHHCCCEEEEECCCHHHHHHHHHHCEEEEECCCCEEECCCCHHHHHHHHHHHHHHHC",
                "predictedDSSP8": "CCCCCCCCCCCCCCCCCCCCCHHCCCCCCCCHHGGCCCCCCCCHHHHHHHHHHHTTCCCECCCCCCECCTTSCBCCCHHHHHHHHHHHHTTCCCCCCCCTCCHHHHHHHHHHHHTCCCHHCCTCCEEEEEESCHHHHHHHHHHHHHHHHTCCSEEEEECSCCTTHHHHHHHTTCEEEEEEECCTTTCCECHHHHHHHHHTCCTTCEEEEECSSCCTTCCCCCHHHHHHHHHHHHHTTCEEEEECTTTTCCCTTTCTTHHHHHHHHHTTCCEEEEEETTSTTCCTTCCCEEEEEEESCHHHHHHHHHHHHHHCCCTTSCHHHHHHHHHHHHTTCHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHTTCCCCEHHHHHTCCEEEEEECCHHHHHHHHHHEEEEEETTSEEEEECCCHHHHHHHHHHHHHHHC",
                "predictedDisorder": "XXXXXXXXXXXXXXXXXXXXXXXXX---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------",
            },
            loading: false
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
                    console.log(json);
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
            sequence: jobParameters.protein.sequence
        });
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container spacing={16}>
                <Grid item xs={12}>
                    <Paper className={classes.root} elevation={2}>
                        <LinearProgress variant="query" style={this.state.loading ? {opacity:1} : {opacity:0}}/>
                        <Typography className={classes.title} variant={"h6"}>
                            Your sequence
                        </Typography>
                        <SequenceHighlighter string={this.state.sequence} proteinColorScheme={proteinColorSchemes['mview']}/>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.root} elevation={2}>
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Paper className={classes.root} elevation={0}>
                                    <Typography className={classes.title} variant={"h6"}>
                                        Global predicted features
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper className={classes.root} elevation={0}>
                                    <Typography className={classes.title} variant={"caption"}>
                                        Sub-cellular location
                                    </Typography>
                                    {this.state.features && <Typography className={classes.title} variant={"h6"}>
                                        {this.state.features.predictedSubcellularLocalizations}
                                    </Typography>}
                                </Paper>
                            </Grid>
                            <Grid item xs={6}>
                                <Paper className={classes.root} elevation={0}>
                                    <Typography className={classes.title} variant={"caption"}>
                                        Membrane bound
                                    </Typography>
                                    {this.state.features && <Typography className={classes.title} variant={"h6"}>
                                        {this.state.features.predictedMembrane}
                                    </Typography>}
                                </Paper>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.root} elevation={2}>
                        <Typography className={classes.title} variant={"h6"}>
                            Amino-acid predicted features
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Expand to see secondary structure prediction (DSSP8)</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {this.state.features && <SequenceHighlighter string={this.state.features.predictedDSSP8} proteinColorScheme={proteinColorSchemes['dssp8']}/>}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Expand to see secondary structure prediction (DSSP3)</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {this.state.features && <SequenceHighlighter string={this.state.features.predictedDSSP8} proteinColorScheme={proteinColorSchemes['dssp8']}/>}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                    <ExpansionPanel>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography className={classes.heading}>Expand to see disorder prediction</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {this.state.features && <SequenceHighlighter string={this.state.features.predictedDisorder} proteinColorScheme={proteinColorSchemes['disorder']}/>}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Grid>
            </Grid>
        );
    }
}

Features.propTypes = {
    classes: PropTypes.object.isRequired,
    jobParameters: PropTypes.object
};

export default storeComponentWrapper(withStyles(styles)(Features));